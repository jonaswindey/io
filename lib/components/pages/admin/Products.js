import React, {Component, PropTypes} from 'react'
import SearchableProductTable from 'components/admin/products/SearchableProductTable'
import {connect} from 'react-redux'
import * as productActions from 'actions/products'
import {AutoAffix} from 'react-overlays'

@connect(state => ({
  products: state.products,
}))
class Products extends Component {

  static contextTypes = {
    history: PropTypes.any
  }

  componentDidMount() {
    this.props.dispatch(productActions.fetchProducts())
  }

  createProduct(reference) {
    this.props.dispatch(productActions.createProduct(reference, this.context.history))
  }

  render() {
    return (
      <div className="wrap">
        <div className="container">
          <div className="paper paper-curve-horiz request">
            <div className="row">
            <div style={{width: 450, float: 'left', paddingLeft: 20}}>
              <SearchableProductTable
                conflict={this.props.products.conflict}
                createProduct={::this.createProduct}
                products={this.props.products.products}
                productsLoaded={this.props.products.productsLoaded}/>
            </div>
            {this.props.children &&
              <AutoAffix viewportOffsetTop={40} container={this} affixStyle={{marginLeft: 450, width: 450}}>
              <div style={{paddingTop: 20}} style={{width: 450, float: 'left', paddingLeft: 40, paddingTop: 20}} >
                  {this.props.children}
              </div>
            </AutoAffix>
            }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Products
