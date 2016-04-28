import {constants} from 'config/constants'
import createReducer from 'utils/create-reducer'
import {trimPrice} from 'components/inquiries/packages/price'

const initialState = {
  report: {},
  totals: {},
  reportLoaded: false,
  products: []
}

const actionHandlers = {
  [constants.FETCH_REPORT_START]: () =>
    ({ reportLoaded: false }),

  [constants.FETCH_REPORT_COMPLETE]: (state, action) => {
    // calculate totals
    const report = action.report
    let totalBasePrice = 0, totalComplementaryPrice = 0
    report.forEach(item => {
      totalBasePrice += item.order_0.basePrice
      totalComplementaryPrice += item.order_0.complementaryPrice
    })

    const basePriceRatio = Math.floor((totalBasePrice / (totalBasePrice + totalComplementaryPrice)) * 100)
    const complementaryPriceRatio = 100 - basePriceRatio

    totalBasePrice = trimPrice(totalBasePrice)
    totalComplementaryPrice = trimPrice(totalComplementaryPrice)

    const totals = {totalBasePrice, totalComplementaryPrice, basePriceRatio, complementaryPriceRatio}

    const products = action.products.filter(product => product.files.length > 0)

    return ({ report, totals, reportLoaded: true, products })
  }

}

export default createReducer(initialState, actionHandlers)
