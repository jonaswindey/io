import {constants} from 'config/constants'
import {get, put, post} from 'utils/agent'
import {omit} from 'lodash'
import debug from 'debug'
import translate from 'utils/translate'
const {API, DEFAULT_PROJECT} = constants

export function fetchProducts(currentPackage, user, desk, admin) {
  return async (dispatch, getState) => {
    try {
      debug('dev')(`actions :: fetchProducts (current package: ${currentPackage})`)
      dispatch({type: constants.FETCH_PRODUCTS_START})

      let sector
      if (user && user.attributesMap)
        if (user.attributesMap.sector === constants.SECTORS.FRESH) {
          sector = 'FRESH'
        } else {
          sector = 'OTHER'
        }

      const res = await get(`${API}/products?pagesize=0`)

      let products = res.body.items

      if (currentPackage) {
        // filter out products with no preview files
        products = products.filter(product => {
          let filter = false
          product.attributes.forEach(attribute => {
            if (attribute.attribute === constants.PRODUCT_ATTRIBUTE_MAIN_PREVIEW)
              filter = true
          })
          return filter
        })

        // if package: filter only products of that category
        let filter = ''
        if (['nakedStand','furnishedStand','sharedStand'].indexOf(currentPackage) > -1)
          filter = constants.PRODUCT_CATEGORY_STAND
        if (currentPackage === 'multi')
          filter = constants.PRODUCT_CATEGORY_MULTI
        if (currentPackage === 'fresh')
          if (desk) {
            filter = constants.PRODUCT_CATEGORY_FRESH_AND_DESK
          } else {
            filter = constants.PRODUCT_CATEGORY_FRESH
          }
        if (currentPackage === 'expressConcept')
          filter = constants.PRODUCT_CATEGORY_EXPRESS_CONCEPT
        products = products.filter(product => {
          if (!admin) return product.categories.includes(filter)
          else return product.categories.includes(filter) || 
          product.categories.includes(constants.PRODUCT_CATEGORY_PRODUCTION)
        })
      }

      if (sector)
        /* VERSE (Fresh) <-> SKY_WHITE (other, pgc) */
        /* BRIO (Fresh) <-> CASSY (other, pgc) */
        products = products.filter(product => {
          let filter = true
          if (sector === 'FRESH')
            return product._id !== constants.PRODUCTS.SKY_WHITE &&
              product._id !== constants.PRODUCTS.CASSY
          else
            return product._id !== constants.PRODUCTS.VERSE &&
              product._id !== constants.PRODUCTS.BRIO

          return filter
        })

      // find main category for each product
      products.forEach(product => {
        product.categories.forEach(category => {
          if (category === constants.PRODUCT_CATEGORY_ELECTRICAL && product._id !== constants.PRODUCTS.ELECTRICITY)
            product.electrical = true

          getState().products.productCategories.forEach(productCategory => {
            if (category === productCategory._id) product.mainCategory = translate(productCategory)
          })
        })
      })

      // sort products by main category & translation alphabetically
      products.sort((a, b) => {

        const o1 = a.mainCategory
        const o2 = b.mainCategory

        const p1 = translate(a)
        const p2 = translate(b)

        if (o1 < o2) return -1
        if (o1 > o2) return 1
        if (p1 < p2) return -1
        if (p1 > p2) return 1
        return 0

      })

      // create product tree
      const getTreeData = (categories, allProducts) => {

        const createTree = (categories) => {
          let all = categories.map(category => {
            let label = translate(category)
            if (label.length > 25) label = label.substr(0, 25) + '...'

            let count = 0
            allProducts.forEach(product => {
              if (product.categories.includes(category._id))
                count++
            })

            if (count > 0)
              label += ' (' + count + ')'

            return {
              count,
              label,
              checkbox: true,
              children: createTree(category.children),
              _id: category._id
            }
          })

          all = all.filter(item => {
            return item.count > 0
          })

          return all
        }
        return createTree(categories)
      }

      // sort product categories alphabetically
      getState().products.productCategories.sort((a, b) => {
        if (translate(a) < translate(b)) return -1
        if (translate(a) > translate(b)) return 1
        return 0
      })

      const productTree = getTreeData(getState().products.productCategories, products)

      dispatch({
        type: constants.FETCH_PRODUCTS_COMPLETE,
        products: products,
        productTree
      })
    }
    catch (e){debug('dev')(e)}
  }
}

export function fetchProductCategories() {
  return async (dispatch) => {

    // create product tree
    const getTreeData = (categories) => {

      const createTree = (categories) => {
        let all = categories.map(category => {
          const label = translate(category)
          return {
            label,
            checkbox: true,
            children: createTree(category.children),
            _id: category._id
          }
        })
        return all
      }
      return createTree(categories)
    }

    try {
      dispatch({type: constants.FETCH_PRODUCTCATEGORIES_START})
      const equipment = await get(`${API}/productcategories/tree?parent=${constants.PRODUCT_CATEGORY_EQUIPMENT}`)
      const productCategories = equipment.body

      const all = await get(`${API}/productcategories/tree`)
      const allCategories = all.body

      dispatch({
        type: constants.FETCH_PRODUCTCATEGORIES_COMPLETE,
        productCategories,
        categoryTree: getTreeData(allCategories)})
    }
    catch (e){debug('dev')(e)}
  }
}

export function fetchProduct(id) {
  return async (dispatch) => {
    try {
      debug('dev')('actions :: fetchProduct')
      dispatch({type: constants.FETCH_PRODUCT_START})
      const res = await get(`${API}/products/${id}`)
      const product = res.body

      if (product.variants.length === 0)
        product.variants.push({
          price: 0,
          stock: 0,
        })

      // check if all translations exist
      const languages = ['nl', 'fr', 'pl', 'en', 'it']
      languages.forEach(language => {
        const translation = product.translations.find(translation => translation.key === language)
        if (!translation) product.translations.push({key: language, value: ''})
      })

      product.translations.forEach(translation => {
        product[translation.key] = translation.value
      })

      product.attributes.forEach(attribute => {
        if (attribute.attribute === constants.PRODUCT_ATTRIBUTE_DIMENSIONS)
          product.dimensions = attribute.value
        if (attribute.attribute === constants.PRODUCT_ATTRIBUTE_MAIN_PREVIEW)
          product.preview = attribute.value
      })

      dispatch({
        type: constants.FETCH_PRODUCT_COMPLETE,
        product})
    }
    catch (e){debug('dev')(e)}
  }
}

export function updateProduct(product) {
  const id = product._id
  product = omit(product, /*'categories',*/ 'id', '_id', '__v', 'fr', 'nl', 'pl', 'en', 'it', 'dimensions', 'preview')
  return async (dispatch) => {
    try {
      debug('dev')('actions :: updateProduct')
      dispatch({type: constants.UPDATE_PRODUCT_START})
      await put(`${API}/products/${id}`).send(product)

      dispatch({
        type: constants.UPDATE_PRODUCT_COMPLETE,
        product})

      dispatch(fetchProduct(id))
      return dispatch(fetchProducts())
    }
    catch (e){debug('dev')(e)}
  }
}

export function createProduct(reference, history) {
  return async (dispatch) => {
    try {
      debug('dev')('actions :: createProduct')
      dispatch({type: constants.CREATE_PRODUCT_START})
      const res = await post(`${API}/products`).send({reference})
      const product = res.body

      dispatch({
        type: constants.CREATE_PRODUCT_COMPLETE,
        product})

      history.push('/admin/product/' + product._id)
    }
    catch (e){
      if (e.message === 'Conflict')
        dispatch({
          type: constants.CREATE_PRODUCT_CONFLICT})
      else
        debug('dev')(e)
    }
  }
}

export function addFile(id, blob, fileName) {
  return async (dispatch) => {
    try {
      debug('dev')('actions :: addFile')
      dispatch({type: constants.ADD_PRODUCT_FILE_START})

      const req = post(`${API}/in/${DEFAULT_PROJECT}`)
      req.attach('file', blob, fileName)

      req.end((err, res) => {
        if (err) debug('dev')(err)
        else
          dispatch({type: constants.ADD_PRODUCT_FILE_COMPLETE, file: res.body})
      })

    }
    catch (e){
      if (e.message === 'Conflict')
        dispatch({
          type: constants.CREATE_PRODUCT_CONFLICT})
      else
        debug('dev')(e)
    }
  }
}
