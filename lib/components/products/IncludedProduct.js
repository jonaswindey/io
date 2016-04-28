'use strict'

let _ = require('lodash')
let React = require('react')
import {constants} from 'config/constants'

let price = require('components/inquiries/packages/price')

module.exports = React.createClass({
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
    if (this.props.product.variants.length > 0) price =
      this.props.product.variants[0].price
    if (!price) price = 0
    return price
  },
  render() {
    let dimensions = ''
    if (this.props.product && this.props.product.attributes)
      this.props.product.attributes.forEach(attribute => {
        if (attribute.attribute === '54fd8bced4f9de1f4f025d94')
          dimensions = '(' + attribute.value + ')'
      })
    if (this.getPreviewFile().length > 0)
      return (<tr>
        <td><p style={{lineHeight: '50px', marginBottom: '0px', paddingLeft: '5px'}}>
          <span>{this.props.product.reference}</span>&nbsp;
          <span>{dimensions}</span>
        </p></td>
        <td><p style={{lineHeight: '50px', marginBottom: '0px', paddingLeft: '5px'}}>{this.props.product.qty}x</p></td>
        <td><p style={{lineHeight: '50px', marginBottom: '0px', paddingLeft: '5px'}}><span>€0.00 </span>
          <span style={{textDecoration: 'line-through', fontSize: '10px'}}>
            €{price.trimPrice(this.getPrice())}
          </span> </p></td>
        <td style={{textAlign: 'center'}}><img style={{height: '50px'}}
                 src={constants.API + '/files/products/' + this.getPreviewFile() + '/img_fit/x400'}/></td>
      </tr>)
    else
      return <div />
  }
})
