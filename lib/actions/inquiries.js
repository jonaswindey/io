import {constants} from 'config/constants'
import {get, post, put, del} from 'utils/agent'
import qs from 'qs'
import debug from 'debug'
import {defaults, cloneDeep} from 'lodash'
const API = constants.API

export function fetchUserInquiry() {
  return async (dispatch) => {
    try {
      dispatch({type: constants.FETCH_INQUIRY_START})
      const res = await get(`${API}/carrefour/inquiry`)
      let inquiry = {}
      let orders = []
      if (res.body.inquiry) inquiry = res.body.inquiry
      if (res.body.orders) orders = res.body.orders

      orders.forEach(order => {
        order.items = order.items.filter(item => item.product !== null)
      })

      return dispatch({
        type: constants.FETCH_INQUIRY_COMPLETE,
        inquiry,
        orders,
      })
    }
    catch (e){debug('dev')(e)}
  }
}

export function fetchInquiry(_id, options = {}) {
  return async (dispatch, getState) => {
    try {
      document.body.scrollTop = 0
      dispatch({type: constants.FETCH_INQUIRY_START})
      await dispatch(fetchInquiryAttributes())

      defaults(options, {select: '+activity'})
      const res = await get(`${API}/carrefour/inquiry/${_id}`)

      let inquiry = {}
      let orders = []
      if (res.body.inquiry) inquiry = res.body.inquiry
      if (res.body.orders) orders = res.body.orders

      const userAttributes = getState().users.userAttributes
      // set attributes on inquiry creator
      const attributes = {}
      // loop through result.user and map correct attributes
      userAttributes.forEach(userAttribute => {
        const attribute = userAttributes.find(_ => {
          return _._id === userAttribute.attribute
        })
        if (attribute) attributes[attribute.key] = userAttribute.value
      })
      inquiry.creator.attributesMap = attributes

      orders.forEach(order => {
        order.items = order.items.filter(item => item.product !== null)
      })

      dispatch({
        type: constants.FETCH_INQUIRY_COMPLETE,
        inquiry,
        orders
      })
    }
    catch (e){debug('dev')(e)}
  }
}

export function createInquiry(inquiry, history) {
  return async dispatch => {
    dispatch({type: constants.CREATE_INQUIRY_START})
    try {
      const res = await post(`${constants.API}/${constants.APP}/inquiry`).send(inquiry)
      // notify
      await post(`${constants.API}/${constants.APP}/notify`).send({orderId: res.body.orders[0]._id})
      dispatch({
        type: constants.CREATE_INQUIRY_COMPLETE,
        inquiry: res.body.inquiry,
        orders: res.body.orders
      })
      if (history) history.pushState(null, '/request/complete')
    }
    catch (e){debug('dev')(e)}
  }
}

export function createOrder(inquiryId, order, history) {
  return async dispatch => {
    dispatch({type: constants.CREATE_ORDER_START})
    try {
      const res = await post(`${constants.API}/${constants.APP}/inquiry/${inquiryId}`).send(order)
      // notify
      await post(`${constants.API}/${constants.APP}/notify`).send({orderId: res.body.orders[0]._id})
      dispatch({
        type: constants.CREATE_ORDER_COMPLETE,
      })
      if (history) history.pushState(null, '/request/complete')
    }
    catch (e){debug('dev')(e)}
  }

  /*this.dispatch(constants.CREATE_INQUIRY);
  request
    .post(constants.API + '/' + constants.APP + '/inquiry/' + inquiryId)
    .set('Authorization', 'bearer ' + localStorage.getItem('token'))
    .send(order)
    .end((error, res) => {
      if (res.status === 200) {
        this.dispatch(constants.CREATE_ORDER_SUCCESS);
        redirect('request/complete');
      }
      else {
        this.dispatch(constants.CREATE_ORDER_FAIL, res.body);
      }
    });*/
}

export function removeOrderItem(order, item) {
  return dispatch => {
    dispatch({type: constants.REMOVE_ORDER_ITEM, order, item})
  }
}

export function addOrderItem(order, product) {
  return dispatch => {
    dispatch({type: constants.ADD_ORDER_ITEM, order, product})
  }
}

export function updateOrder(order, inquiryId, type) {

  return async dispatch => {
    dispatch({type: constants.UPDATE_ORDER_START})
    try {
      const id = order._id
      // only update order items
      // deep clone order items because we will alter item.product with its _id
      order = {
        items: cloneDeep(order.items),
        status: order.status
      }
      order.items.forEach(item => {
        // TODO: addActivity!
        /*if (item.qtyChanged && item.qtyFrom !== item.qtyTo) {
          _this.addActivity(inquiryId, {
            from: item.qtyFrom,
            to: item.qtyTo,
            product: {
              id: item.product._id,
              translations: item.product.translations
            },
            property: 'qty'
          }, 'edit')
        }*/

        delete item.qtyChanged
        delete item.qtyFrom
        delete item.qtyTo

        // TODO: add activity!
        /*if (item.priceChanged && item.priceFrom !== item.priceTo)
          _this.addActivity(inquiryId, {
            from: item.priceFrom,
            to: item.priceTo,
            product: {
              id: item.product._id,
              translations: item.product.translations
            },
            property: 'price'
          }, 'edit')*/

        delete item.priceChanged
        delete item.priceFrom
        delete item.priceTo

        // set product id's instead of objects
        if (item.product && item.product._id) item.product = item.product._id
      })

      await put(constants.API + '/orders/' + id).send(order)

      if (type === 'user') dispatch(this.fetchUserInquiry() )
      else dispatch(this.fetchInquiry(inquiryId))

      dispatch({type: constants.UPDATE_ORDER_COMPLETE})
    }
    catch (e){
      debug('dev')(e)
    }
  }
}

  /* updateOrderComment(order, comment) {
    var existing;
    _.forEach(order.attributes, attribute => {
      if (attribute.attribute._id == constants.ORDER_ATTRIBUTE_COMMENT
      || attribute.attribute == constants.ORDER_ATTRIBUTE_COMMENT) {
        existing = attribute;
        existing.value = comment;
      }
    });
    if (!existing) {
      var data = {
        attribute: constants.ORDER_ATTRIBUTE_COMMENT,
        value: comment
      };
      order.attributes.push(data);
      request
        .post(constants.API + '/orders/' + order._id + '/attributes')
        .set('Authorization', 'bearer ' + localStorage.getItem('token'))
        .send(data)
        .end((error, res) => {
          this.flux.toaster.info(
            'Added',
            null, {
              timeOut: 1500,
              extendedTimeOut: 1500
            });
        });
    } else {
      var data = {
        attributes: order.attributes
      }
      request
        .put(constants.API + '/orders/' + order._id)
        .set('Authorization', 'bearer ' + localStorage.getItem('token'))
        .send(data)
        .end((error, res) => {
          this.flux.toaster.info(
            'Updated',
            null, {
              timeOut: 1500,
              extendedTimeOut: 1500
            });
        });
    }
  },
 */

export function updateOrderAttribute(order, attributeId, value) {
  return async () => {
    let existing
    order.attributes.forEach(attribute => {
      if (attribute.attribute._id === attributeId
        || attribute.attribute === attributeId) {
        existing = attribute
        existing.value = value
      }
    })
    if (!existing) {
      // todo:  find attribute and add whole object (for translation)
      const data = {
        attribute: attributeId,
        value: value
      }
      order.attributes.push(data)
      await post(constants.API + '/orders/' + order._id + '/attributes').send(data)
    } else {
      const data = {
        attributes: order.attributes
      }
      await put(constants.API + '/orders/' + order._id).send(data)
    }
  }
}

export function updateOrderAttributes(order, comment, purchaseOrder) {
  return async dispatch => {
    dispatch({type: constants.UPDATE_ORDER_ATTRIBUTES_START})

    await dispatch(this.updateOrderAttribute(
      order, constants.ORDER_ATTRIBUTE_COMMENT, comment))

    await dispatch(this.updateOrderAttribute(
      order, constants.ORDER_ATTRIBUTE_PURCHASE_ORDER, purchaseOrder))

    dispatch({type: constants.UPDATE_ORDER_ATTRIBUTES_COMPLETE})
  }
}


export function updateOrderStatus(order, status, attributes) {
  return async dispatch => {
    dispatch({type: constants.UPDATE_ORDER_START})
    const data = {
      status
    }
    const id = order._id
    try {
      if (attributes)
        attributes.forEach(async attribute => {
          await dispatch(this.updateOrderAttribute(order, attribute.attribute, attribute.value))
        })

      await put(`${constants.API}/orders/${id}`).send(data)
      await post(`${constants.API}/${constants.APP}/notify`).send({orderId: id})
      debug('dev')('order updated')
      dispatch({
        type: constants.UPDATE_ORDER_COMPLETE,
      })
    }
    catch (e){debug('dev')(e)}
  }
}

export function updateInquiryStatus(id, status, history) {
  return async dispatch => {
    dispatch({type: constants.UPDATE_INQUIRY_START})
    const inquiry = {
      status
    }
    try {
      await put(`${constants.API}/inquiries/${id}`).send(inquiry)
      dispatch({
        type: constants.UPDATE_INQUIRY_COMPLETE,
      })
      if (history) history.pushState(null, '/admin/requests')
    }
    catch (e){debug('dev')(e)}
  }
}

export function fetchInquiryAttributes() {
  return async (dispatch, getState) => {
    try {
      if (getState().inquiries.inquiryAttributesLoaded) return Promise.resolve()
      const query = qs.stringify({
        page: 1,
        pagesize: 0
      })
      const res = await get(`${API}/inquiryattributes?${query}`)
      dispatch({
        type: constants.FETCH_INQUIRY_ATTRIBUTES,
        inquiryAttributes: res.body.items
      })
    }
    catch (e){debug('dev')(e.messsage)}
  }
}

export function fetchInquiries() {
  return async dispatch => {
    dispatch({type: constants.FETCH_INQUIRIES_START})

    const res = await get(`${API}/inquiries?populate=creator orders&filters=status:open&pagesize=0`)
    const inquiries = res.body.items

    inquiries.forEach(inquiry => {
      // get action required based on status
      const status = inquiry.orders[inquiry.orders.length - 1].status
      switch (status) {
        case 'requested':
          inquiry.actionRequired = true
          inquiry.action = 'approve'
          break
        case 'accepted':
          inquiry.actionRequired = true
          inquiry.action = 'close'
          break
      }
    })

    return dispatch({
      type: constants.FETCH_INQUIRIES_COMPLETE,
      inquiries
    })
  }
}

export function addComment(id, value, type) {
  return async dispatch => {
    dispatch({type: constants.ADD_INQUIRY_COMMENT_START})
    if (value.length > 0) {
      const data = {
        type: 'comment',
        value
      }
      await post(`${API}/inquiries/${id}/activity`).send(data)
      if (type === 'user') dispatch(this.fetchUserInquiry() )
      else dispatch(this.fetchInquiry(id))
    }
  }
}

export function removeComment(id, item, type) {
  return async dispatch => {
    dispatch({type: constants.ADD_INQUIRY_COMMENT_START})
    await del(`${API}/inquiries/${id}/activity/${item._id}`)
    if (type === 'user') dispatch(this.fetchUserInquiry() )
    else dispatch(this.fetchInquiry(id))
  }
}
