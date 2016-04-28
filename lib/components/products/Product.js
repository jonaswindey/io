'use strict'

import _ from 'lodash'
import React from 'react'
import {constants} from 'config/constants'
import price from 'components/inquiries/packages/price'
import {FormattedMessage} from 'react-intl'
import translate from 'utils/translate'

let {
  Button
} = require('react-bootstrap')

let TransitiveNumber = require('react-transitive-number')

module.exports = React.createClass({
  getDefaultProps() {
    return {
      filter: true
    }
  },
  getLocalStorageKey() {
    return 'product_' + this.props.product._id
  },
  getInitialState() {
    return {
      qty: 0
    }
  },
  getPreviewFile() {
    let returnValue = ''
    _.forEach(this.props.product.attributes, attribute => {
      if (attribute.attribute === '54fe3078de532c1fc18cc67a')
        returnValue = attribute.value
    })
    return returnValue
  },
  getPrice() {
    let price
    if (this.props.product.variants.length > 0)
      price = this.props.product.variants[0].price
    if (!price)
      price = 0
    return price
  },
  updateQuantity(e) {
    let value = e.currentTarget.value
    this.setState({
      qty: value
    })
    this.props.product.qty = value
  },
  incrementQuantity() {
    if (this.props.product.electrical)
      this.props.onElectrical()
    let qty = parseInt(this.state.qty) + 1
    this.setState({
      qty: qty
    })
    this.props.product.qty = qty
  },
  decrementQuantity() {
    if (this.state.qty > 0) {
      let qty = parseInt(this.state.qty) - 1
      this.setState({
        qty: qty
      })
      this.props.product.qty = qty
    }
  },
  render() {
    let dimensions = ''
    if (this.props.product && this.props.product.attributes)
      this.props.product.attributes.forEach(attribute => {
        if (attribute.attribute === '54fd8bced4f9de1f4f025d94' && attribute.value && attribute.value.length > 0)
          dimensions = '(' + attribute.value + ')'
      })

    this.props.product.qty = this.state.qty
    if (this.props.filter && this.getPreviewFile().length > 0)
      return (<div className="col-md-3 col-sm-4 col-xs-6">
          <div className="thumbnail article">
            <p>
              <span style={{fontSize: 12}}>{translate(this.props.product)}</span>
              <span style={{fontSize: 11}}>{dimensions}</span>
            </p>
            <div>
                <img
                  className="img-responsive"
                  style={{minHeight: 80, maxHeight: 80}}
                  src={constants.API + '/files/products/' + this.getPreviewFile() + '/img_fit/x400'}/>
            </div>
            <div className="row thumb-info">
              <div style={{clear: 'both', textAlign: 'center', paddingTop: 15}}>
                <Button bsSize="small" bsStyle="success" className="btn-add hidden-md hidden-sm hidden-xs"
                  onClick={this.incrementQuantity}><FormattedMessage id='shared.add' /> +</Button>

                <Button bsSize="small" bsStyle="success" className="btn-add hidden-lg"
                  onClick={this.incrementQuantity}>+</Button>
              </div>
              <div className="thumb-price">
                <Button bsSize="xsmall" bsStyle="default" className="btn-remove"
                  onClick={this.decrementQuantity}>-</Button>

                <div className="thumb-qty">
                  <TransitiveNumber>{this.state.qty}</TransitiveNumber>x
                  </div>
                  €{price.trimPrice(this.getPrice())}
              </div>


            </div>
          </div>
        </div>
      )
    else
      return <div/>
  }
})
