import React, {Component} from 'react'
import {constants} from 'config/constants'

class ProductThumbnail extends Component {
  getPreviewFile(product) {
    let returnValue = ''
    if (product && product.attributes)
      product.attributes.forEach(attribute => {
        if (attribute.attribute === '54fe3078de532c1fc18cc67a')
          returnValue = attribute.value
      })
    return returnValue
  }
  render() {
    if (this.getPreviewFile(this.props.product) && this.getPreviewFile(this.props.product).length > 0)
      return (<div
        className="thumbContainer"
        style={{backgroundImage:'url(' + constants.API + '/files/products/' + this.getPreviewFile(this.props.product)
          + '/img_fit/x400' + ')'}}/>)
    else
      return <span></span>

  }

}

export default ProductThumbnail
