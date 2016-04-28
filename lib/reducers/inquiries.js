import {constants} from 'config/constants'
import createReducer from 'utils/create-reducer'
import debug from 'debug'

const initialState = {
  inquiryAttributes: [],
  inquiryAttributesLoaded: false,
  inquiries: [],
  inquiriesLoaded: false,
  inquiry: {},
  inquiryLoaded: false,
  inquiryUpdating: false,
  formLoaded: false,
  formValue: {},
  commentAdding: false,
  suppliers: [],
  suppliersLoaded: false,
  orders: [],
  orderAttributesUpdating: false,
}

const actionHandlers = {
  [constants.FETCH_INQUIRY_ATTRIBUTES]: (state, action) =>
    ({ inquiryAttributes: action.inquiryAttributes, inquiryAttributesLoaded: true }),

  [constants.FETCH_INQUIRIES_START]: () => ({ inquiriesLoaded: false, inquiries: [] }),
  [constants.FETCH_INQUIRIES_COMPLETE]: (state, action) => ({ inquiries: action.inquiries, inquiriesLoaded: true }),

  [constants.FETCH_INQUIRY_START]: () => ({ inquiryLoaded: false, formLoaded: false }),
  [constants.FETCH_INQUIRY_COMPLETE]: (state, action) =>
    ({ inquiry: action.inquiry, inquiryLoaded: true, group: action.group, orders: action.orders }),

  [constants.REMOVE_ORDER_ITEM]: (state, action) => {
    debug('dev')('REMOVE_ORDER_ITEM')
    debug('dev')(action)
    const orders = state.orders

    const order = orders.find(order => order._id === action.order._id)
    order.items = order.items.filter(item => item !== action.item)

    return ({
      orders
    })
  },

  [constants.ADD_ORDER_ITEM]: (state, action) => {
    debug('dev')('ADD_ORDER_ITEM')
    debug('dev')(action)
    const orders = state.orders

    const order = orders.find(order => order._id === action.order._id)

    order.items.push({
      product: action.product,
      qty: 1,
      unitPrice: action.product.variants[0].price,
      price: action.product.variants[0].price
    })

    return ({
      orders
    })
  },

  [constants.CLEAR_INQUIRY]: () => ({ inquiry: {}, inquiryLoaded: true, formValue: {} }),
  [constants.FETCH_INQUIRY_FORM_VALUE]: (state, action) => ({ formValue: action.value, formLoaded: true }),
  [constants.SET_INQUIRY_FORM_VALUE]: (state, action) => ({ formValue: action.formValue, formLoaded: true }),

  [constants.CREATE_INQUIRY_START]: () => ({ inquiryUpdating: true }),
  [constants.CREATE_INQUIRY_COMPLETE]: (state, action) => ({
    inquiry: action.inquiry,  orders: action.orders, inquiryUpdating: false}),

  [constants.UPDATE_INQUIRY_START]: () => {
    document.body.scrollTop = 0
    return ({inquiryLoaded: false, formLoaded: false, inquiryUpdating: true })
  },

  [constants.UPDATE_INQUIRY_COMPLETE]: () => ({ inquiryLoaded: false, formLoaded: false, inquiryUpdating: false }),

  [constants.UPDATE_STEP_START]: () => ({ inquiryUpdating: true }),
  [constants.UPDATE_STEP_COMPLETE]: () => ({ inquiryUpdating: false }),

  [constants.ADD_COMMENT_START]: () => ({ commentAdding: true }),
  [constants.ADD_COMMENT_COMPLETE]: (state, action) => {
    const inquiry = state.inquiry
    if (inquiry.activity) inquiry.activity.push(action.activity)
    return ({
      inquiry,
      commentAdding: false
    })
  },

  [constants.FETCH_SUPPLIERS_START]: () => ({ suppliersLoaded: false }),
  [constants.FETCH_SUPPLIERS_COMPLETE]: (state, action) => ({ suppliers: action.suppliers, suppliersLoaded: true }),

  [constants.UPDATE_ORDER_ATTRIBUTES_START]: () => ({ orderAttributesUpdating: true }),
  [constants.UPDATE_ORDER_ATTRIBUTES_COMPLETE]: () => ({ orderAttributesUpdating: false }),

}

export default createReducer(initialState, actionHandlers)
