import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import {
  NgbModule,
  NgbNavModule,
  NgbModalModule,
} from '@ng-bootstrap/ng-bootstrap'
import * as sharedComponents from './shared'
import { ModalContentComponent } from './shared/modal/modal-content.component'
import { FormBuilderComponent } from './form-builder/form-builder.component'
import { TransactionItemComponent } from './transaction-item/transaction-item.component'

@NgModule({
  declarations: [
    ...sharedComponents.components,
    ModalContentComponent,
    TransactionItemComponent,
    FormBuilderComponent,
  ],
  imports: [
    NgbModule,
    CommonModule,
    FormsModule,
    NgbNavModule,
    NgbModalModule,
    ReactiveFormsModule,
  ],
  exports: [
    NgbModule,
    FormsModule,
    NgbNavModule,
    NgbModalModule,
    ReactiveFormsModule,
    TransactionItemComponent,
    FormBuilderComponent,
    ...sharedComponents.components,
  ],
  entryComponents: [ModalContentComponent],
})
export class SharedComponentsModule {}
