import React, {Component, PropTypes} from 'react'
import { Link } from 'react-router'
import {Table} from 'react-bootstrap'
import ProductThumbnail from 'components/products/ProductThumbnail'
import translate from 'utils/translate'

class ProductTable extends Component {

  static contextTypes = {
    history: PropTypes.any
  }

  onRowClick(id) {
    this.context.history.pushState(null, '/admin/product/'+id )
  }

  render() {
    return (
          <div>
          <Table striped bordered condensed hover>
            <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Edit</th>
            </tr>
            </thead>
            <tbody>
            {this.props.products.map(product => {
              if (product.reference.toLowerCase().lastIndexOf(this.props.filterText.toLowerCase()) > -1
                || product.translations[0].value.toLowerCase().lastIndexOf(this.props.filterText.toLowerCase()) > -1
                || product.translations[1].value.toLowerCase().lastIndexOf(this.props.filterText.toLowerCase()) > -1) {

                let price = ''
                if (product.variants[0])
                  price = '€ ' + product.variants[0].price
                let stock = ''
                if (product.variants[0]) {
                  stock = product.variants[0].stock
                  if (stock === -1) stock = 'Illimité'
                }

                return (
                  <tr key={product._id} style={{cursor: 'pointer'}} onClick={() => this.onRowClick(product._id)}>
                    <td className="col-xs-1">
                      <ProductThumbnail product={product}/>
                    </td>
                    <td className="col-md-10">
                      {translate(product)}<br />
                    <div style={{fontSize: 12, lineHeight: '20px'}}>
                      Stock: {stock} - Price: {price}
                    </div>
                    </td>
                    <td className="col-md-1">
                        <Link to={'/admin/product/'+product._id}>Edit</Link>
                    </td>
                  </tr>
                )
              }
            })}
            </tbody>
          </Table>
            </div>
        )

  }
}

export default ProductTable
