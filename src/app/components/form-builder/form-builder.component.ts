import { Component, Input, Output, EventEmitter, ChangeDetectorRef, OnInit } from '@angular/core'
import { FormControl, Validators, FormGroup } from '@angular/forms'
import { FormBuilder } from '@angular/forms'
import { Observable, Subscription } from 'rxjs'
import { NgRedux } from '@angular-redux/store'
import { IState } from '../../store/reducer'

@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.scss'],
})
export class FormBuilderComponent implements OnInit {
  @Input() formObject: any
  @Input() formErrors: any
  @Input() formModel: any = {}
  @Input() showSubmitBtn: boolean = false
  @Input() retreiveInfo: Observable<void>
  @Output() onSaveEvent: EventEmitter<any> = new EventEmitter()

  private shouldSendFormData: Subscription
  firstTime: boolean = true
  overdraft: boolean = false
  balance: number
  formGroup: FormGroup
  formValidatorPattern = {
    input: ['',
      Validators.required,
    ],
    select: ['', Validators.required],
  }

  constructor(
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private ngRedux: NgRedux<IState>,
  ) {
    this.ngRedux
      .select<number>('defaultBalance')
      .subscribe((balance: number) => (this.balance = balance))
  }

  isFieldValid(form: FormGroup, field: string, fieldIndex) {
    if (this.formObject[fieldIndex].required == false) {
      return false
    } else {
      if (!this.firstTime)
        return !form.get(field).valid && form.get(field).touched
    }
  }

  displayFieldCss(form: FormGroup, field: string, fieldIndex) {
    return {
      'has-error': this.isFieldValid(form, field, fieldIndex),
      'has-feedback': this.isFieldValid(form, field, fieldIndex),
    }
  }

  onSubmit() {
    if (this.formGroup.valid) {
      const { amount } = this.formModel

      if (this.balance - amount < -500) {
        this.overdraft = true
      } else {
        this.onSaveEvent.emit(this.formModel)
      }
    } else {
      this.validateAllFormFields(this.formGroup)
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field: any) => {
      const control = formGroup.get(field)
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true })
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control)
      }
    })
  }

  ngOnInit() {
    let newFormValidator = {}
    for (var formElement of this.formObject) {
      if (formElement.required == false) {
        newFormValidator[formElement.key] = ['']
      } else {
        newFormValidator[formElement.key] = this.formValidatorPattern[
          formElement.type
        ]
      }
    }
    this.formGroup = this.formBuilder.group(newFormValidator)

    this.addDefaultValue()

    this.formGroup.valueChanges.subscribe(() => {
      if (this.formGroup.valid) this.cdr.detectChanges()
    })

    if (this.retreiveInfo) {
      this.shouldSendFormData = this.retreiveInfo.subscribe(() => {
        this.addDefaultValue()
        this.onSubmit()
        this.overdraft = false
        this.firstTime = true
      })
    }
  }

  ngOnDestroy() {
    if (this.retreiveInfo) {
      this.shouldSendFormData.unsubscribe()
    }
  }

  onFilterBy(key, type) {
    this.onSaveEvent.emit({ sortBy: { key, type } })
  }

  onClearInput(key) {
    this.formGroup.controls[key].reset()
    this.onSubmit()
  }

  addDefaultValue() {
    for (let obj of this.formObject) {
      if (obj.type === 'select') {
        this.formModel[obj.key] = obj.options[0]
      } else {
        this.formGroup.controls[obj.key].reset()
      }
    }
  }

  async selectValidationRegister(e, formObjectKey) {
    if (e) {
      this.formErrors[formObjectKey] = false
    } else {
      this.formErrors[formObjectKey] = 'validation.fieldRequired'
    }
  }

  async inputValidationRegister(e, formObjectKey) {
    this.firstTime = false
    if (e) {
      this.formErrors[formObjectKey] = false
    } else {
      this.formErrors[formObjectKey] = 'validation.faildRequired'
    }
  }
}
