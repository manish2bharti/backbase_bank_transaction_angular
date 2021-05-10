import { ActionTypes } from './types'

export const MakePayment = (payload) => {
  return {
    type: ActionTypes.ADD_PAYMENT,
    payload,
  }
}

export const AddTransaction = (payload) => {
  return {
    type: ActionTypes.ADD_TRANSACTION,
    payload,
  }
}

export const ExtractMoney = (payload) => {
  return {
    type: ActionTypes.EXTRACT_MONEY,
    payload,
  }
}
