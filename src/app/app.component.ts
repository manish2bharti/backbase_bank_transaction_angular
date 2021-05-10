import { Component, OnInit } from '@angular/core'
import { Subject } from 'rxjs'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { MakePayment } from './store/actions'
import { NgRedux } from '@angular-redux/store'

import { IState } from './store/reducer'
import { ModalContentComponent } from './components/shared/modal/modal-content.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private ngRedux: NgRedux<IState>,
    private modalService: NgbModal,
  ) {
    this.ngRedux
      .select<Array<any>>('transactions')
      .subscribe((items: Array<any>) => {
        this.transactions = items
        this.normalizedTransactions = items.filter((el) => {
          if (!['SI64397745065112345'].includes(el.merchant.accountNumber)) {
            return el
          }
        })
      })

    this.ngRedux
      .select<object>('payment')
      .subscribe((payment: object) => (this.payment = payment))
  }

  payment: object
  transactions: Array<any>
  normalizedTransactions: Array<any>
  formInputsObject: Array<IFromInputObj> = []
  filterInputsObject: Array<IFromInputObj> = [
    {
      type: 'searchable',
      label: 'search',
      key: 'search',
      required: false,
      disabled: false,
      placeholder: 'filter transaction',
      classes: 'col-md-6',
    },
    {
      type: 'buttons',
      label: 'sortBy',
      key: 'sortBy',
      required: false,
      disabled: false,
      classes: 'col-md-6',
      options: [
        {
          key: 'date',
        },
        {
          key: 'amount',
        },
      ],
    },
  ]
  formErrors = []
  retreiveTransfer: Subject<void> = new Subject<void>()
  formModel = {}
  filterModel = {}

  ngOnInit() {
    this.formInputsObject.push(
      {
        type: 'select',
        label: 'From Account',
        key: 'fromAccount',
        required: false,
        disabled: true,
        options: this.transactions.filter(
          (el) => el.merchant.accountNumber === 'SI64397745065112345',
        ),
      },
      {
        type: 'select',
        label: 'To Account',
        key: 'toAccount',
        required: true,
        disabled: false,
        options: this.transactions
          .filter((el) => el.merchant.accountNumber !== 'SI64397745065112345')
          .reverse(),
      },
      {
        type: 'input',
        label: 'Amount',
        key: 'amount',
        required: true,
        disabled: false,
        placeholder: 'specify the amount',
      },
    )
  }

  onSubmit(transfer) {
    this.ngRedux.dispatch(
      MakePayment({
        categoryCode: transfer.toAccount.categoryCode,
        dates: {
          valueDate: Date.now(),
        },
        transaction: {
          amountCurrency: {
            amount: transfer.amount,
            currencyCode: 'EUR',
          },
          type: transfer.toAccount.transaction.type,
          creditDebitIndicator: transfer.toAccount.transaction.type,
        },
        merchant: {
          name: transfer.toAccount.merchant.name,
          accountNumber: transfer.toAccount.merchant.accountNumber,
        },
      }),
    )

    this.openPreviewModal()
  }

  onFilter(filter) {
    if (filter.search && filter.search !== '') {
      this.normalizedTransactions = this.transactions.filter(
        (item) =>
          item.merchant.name
            .toLowerCase()
            .includes(filter.search.toLowerCase()) &&
          item.merchant.accountNumber !== 'SI64397745065112345',
      )
    } else {
      this.defaultSort()
    }

    if (filter.sortBy) {
      if (filter.sortBy.type == 'asc') {
        this.normalizedTransactions = this.transactions
          .slice()
          .sort((a, b) => {
            a =
              filter.sortBy.key == 'date'
                ? new Date(a.dates.valueDate)
                : filter.sortBy.key == 'amount'
                ? a.transaction.amountCurrency.amount
                : a.merchant.name
            b =
              filter.sortBy.key == 'date'
                ? new Date(b.dates.valueDate)
                : filter.sortBy.key == 'amount'
                ? b.transaction.amountCurrency.amount
                : b.merchant.name
            return a > b ? 1 : a < b ? -1 : 0
          })
          .filter(
            (item) => item.merchant.accountNumber !== 'SI64397745065112345',
          )
      } else if (filter.sortBy.type == 'desc') {
        this.normalizedTransactions = this.transactions
          .slice()
          .sort((a, b) => {
            a =
              filter.sortBy.key == 'date'
                ? new Date(a.dates.valueDate)
                : filter.sortBy.key == 'amount'
                ? a.transaction.amountCurrency.amount
                : a.merchant.name
            b =
              filter.sortBy.key == 'date'
                ? new Date(b.dates.valueDate)
                : filter.sortBy.key == 'amount'
                ? b.transaction.amountCurrency.amount
                : b.merchant.name
            return a > b ? -1 : a < b ? 1 : 0
          })
          .filter(
            (item) => item.merchant.accountNumber !== 'SI64397745065112345',
          )
      } else {
        this.defaultSort()
      }
    }
  }

  defaultSort() {
    this.normalizedTransactions = this.transactions.filter(
      (item) => item.merchant.accountNumber !== 'SI64397745065112345',
    )
  }

  openPreviewModal() {
    const modalRef = this.modalService.open(ModalContentComponent)
    modalRef.componentInstance.payment = this.payment

    modalRef.result.then(() => {
      this.retreiveTransfer.next()
      modalRef.close()
    })
  }
}

export interface IFromInputObj {
  type: string
  label: string
  key: string
  required: boolean
  disabled: boolean
  placeholder?: string
  options?: any
  classes?: string
}
