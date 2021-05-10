import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { SharedComponentsModule } from './components/components.module'
import { NgReduxModule, NgRedux } from '@angular-redux/store'
import { HttpClientModule } from '@angular/common/http'

import { AppComponent } from './app.component'
import { BankReducer, IState, initialState } from './store/reducer'

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    SharedComponentsModule,
    NgReduxModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(ngRedux: NgRedux<IState>) {
    ngRedux.configureStore(BankReducer, initialState)
  }
}
