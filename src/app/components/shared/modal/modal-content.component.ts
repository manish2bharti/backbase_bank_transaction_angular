import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { NgRedux } from '@angular-redux/store'
import { AddTransaction, ExtractMoney } from '../../../store/actions'
import { IState } from '../../../store/reducer'

@Component({
  selector: 'app-modal-content',
  templateUrl: './modal-content.component.html',
  styleUrls: ['./modal-content.component.scss'],
})
export class ModalContentComponent implements OnInit {
  @Input() payment
  @Output() onTransferEvent: EventEmitter<any> = new EventEmitter()

  balance: number

  constructor(
    public activeModal: NgbActiveModal,
    private ngRedux: NgRedux<IState>,
  ) {
    this.ngRedux
      .select<number>('defaultBalance')
      .subscribe((balance: number) => (this.balance = balance))
  }

  ngOnInit() {}

  onTransfer() {
    this.ngRedux.dispatch(AddTransaction(this.payment))
    this.ngRedux.dispatch(
      ExtractMoney(this.balance - this.payment.transaction.amountCurrency.amount),
    )
    this.activeModal.close('transfer')
  }
}
