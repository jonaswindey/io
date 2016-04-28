/*eslint-disable*/
import {constants} from 'config/constants'
import {get} from 'utils/agent'
import debug from 'debug'
const API = constants.API

const mock =
[
  {
    "_id": "558acf95d7b1cc8518d0ec51",
    "firstName": "Sarah",
    "lastName": "Wauters",
    "email": "sarah.wauters@abcosmetique.com",
    "locale": "fr",
    "sector": "Autres",
    "sectorKey": "other",
    "subSector": "Non Food, textile",
    "subSectorKey": "nonfoodTextile",
    "exhibitorName": "ABC - Bourjois",
    "inquiryId": "558ad07ed7b1cc8518d0ec74",
    "inquiryStatus": "archived",
    "products": {
      "550024d55f770b706d419a04": 1,
      "550024f05f770b706d419a0f": 1,
      "550024fc5f770b706d419a16": 1,
      "550028805f770b706d419a1d": 1,
      "5555b65d299070e00ecf9a52": 1,
      "5555bc86299070e00ecf9ac9": 1,
      "5555bdec299070e00ecf9b66": 1
    },
    "order_0": {
      "_id": "558ad07ed7b1cc8518d0ec66",
      "reference": "1500107",
      "status": "closed",
      "poNumber": "Salon Carrefour 23-09",
      "vatNumber": "",
      "placementPreference": "",
      "openStand": "",
      "standType": "bare",
      "acceptFoodBank": false,
      "surfaceArea": 16,
      "basePrice": 5395,
      "complementaryPrice": 0,
      "totalInvoicePrice": 5395
    }
  },
  {
    "_id": "558ad0b8d7b1cc8518d0ec7b",
    "firstName": "Thierry",
    "lastName": "Vanhooff",
    "email": "thierry.vanhooff@alcobrands.be",
    "locale": "fr",
    "sector": "PGC",
    "sectorKey": "consumerProducts",
    "subSector": "Liquides",
    "subSectorKey": "beverages",
    "exhibitorName": "Alcobrands",
    "inquiryId": "558ad16dd7b1cc8518d0ecb0",
    "inquiryStatus": "archived",
    "products": {
      "550024d55f770b706d419a04": 1,
      "550024f05f770b706d419a0f": 1,
      "550024fc5f770b706d419a16": 1,
      "550028805f770b706d419a1d": 1,
      "5555bc86299070e00ecf9ac9": 1,
      "5555bdec299070e00ecf9b66": 1
    },
    "order_0": {
      "_id": "558ad16dd7b1cc8518d0eca2",
      "reference": "1500108",
      "status": "closed",
      "poNumber": "",
      "vatNumber": "BE 0882 72 06 85",
      "placementPreference": "",
      "openStand": "",
      "standType": "bare",
      "acceptFoodBank": false,
      "surfaceArea": 18,
      "basePrice": 5587.5,
      "complementaryPrice": 0,
      "totalInvoicePrice": 5587.5
    }
  }
]

const MOCK = false

export function fetchReport(type) {
  return async dispatch => {
    try {
      dispatch({type: constants.FETCH_REPORT_START})
      debug('dev')(`Load report: ${type}`)

      const getProducts = await get(`${API}/products?pagesize=0`)
      const products = getProducts.body.items

      if (!MOCK) {
        const res = await get(`${API}/carrefour/reporting/${type}`)
        dispatch({
          type: constants.FETCH_REPORT_COMPLETE,
          products,
          report:res.body
        })
      } else {
        dispatch({
          type: constants.FETCH_REPORT_COMPLETE,
          products,
          report: mock
        })
      }
    }
    catch (e){debug('dev')(e)}
  }
}
