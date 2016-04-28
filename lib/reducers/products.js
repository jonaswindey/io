import {constants} from 'config/constants'
import createReducer from 'utils/create-reducer'

const initialState = {
  products: [],
  productsLoaded: false,
  productCategories: [],
  productCategoriesLoaded: false,
  productTree: {},
  productLoaded: false,
  product: {},
  conflict: false,
  fileAdding: false,
  preselect: {},
  categoryTree: [],
}

const actionHandlers = {

  [constants.FETCH_PRODUCTS_START]: () => ({ productsLoaded: false }),
  [constants.FETCH_PRODUCTS_COMPLETE]: (state, action) => ({
    products: action.products, productTree: action.productTree, productsLoaded: true }),

  [constants.FETCH_PRODUCTCATEGORIES_START]: () => ({ productCategoriesLoaded: false }),
  [constants.FETCH_PRODUCTCATEGORIES_COMPLETE]: (state, action) => ({
    productCategories: action.productCategories, productCategoriesLoaded: true, categoryTree: action.categoryTree }),

  [constants.FETCH_PRODUCT_START]: () => ({ productLoaded: false }),
  [constants.FETCH_PRODUCT_COMPLETE]: (state, action) => ({
    product: action.product, productLoaded: true }),

  [constants.CREATE_PRODUCT_START]: () => ({ conflict: false }),
  [constants.CREATE_PRODUCT_CONFLICT]: () => ({ conflict: true }),

  [constants.ADD_PRODUCT_FILE_START]: () => ({fileAdding: true}),
  [constants.ADD_PRODUCT_FILE_COMPLETE]: (state, action) => {
    const product = state.product
    product.files.push(action.file)
    return {fileAdding: false, product, preselect: action.file}
  },

}

export default createReducer(initialState, actionHandlers)
