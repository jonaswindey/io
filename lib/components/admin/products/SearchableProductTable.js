import React, {Component} from 'react'
import ProductTable from './ProductTable'
import {Link} from 'react-router'
import {Row, Col, FormControl, Button, Alert} from 'react-bootstrap'
import Loader from 'react-loader'

class SearchableProductTable extends Component {
  state = {
    filterText: '',
    reference: '',
  }

  onFilterChange(e) {
    this.setState({
      filterText: e.currentTarget.value
    })
  }

  onReferenceChange(e) {
    this.setState({
      reference: e.currentTarget.value
    })
  }

  render() {
    return (
      <div>
        <h3>
          <Link to="/admin/products">Products </Link>
          /
        </h3>
        <Row>
          <Col md={4} style={{paddingTop: 10, paddingBottom: 10}}>
            <FormControl type="text" placeholder="Filter products"
                   value={this.state.filterText}
                   onChange={::this.onFilterChange}
              />
          </Col>
          <Col md={8} style={{textAlign: 'right', paddingTop: 10}}>
              <Row>
                <Col style={{float: 'left', width: 185, marginRight: 5, textAlign: 'right'}}>
                  <FormControl placeholder="Reference" type="text"
                    value={this.state.reference}
                    onChange={::this.onReferenceChange} />
                </Col>
                <Col style={{float: 'left'}}>
                  <Button disabled={this.state.reference.length === 0}
                    onClick={() => this.props.createProduct(this.state.reference)}>New product</Button>
                </Col>
              </Row>
          </Col>
        </Row>
        {this.props.conflict &&
          <Alert bsStyle="warning">A product with this reference already exists</Alert>
        }
        <Row>
          <Col sm={12}>
            <div style={{minHeight: 150}}>
            <Loader loaded={this.props.productsLoaded} lines={10} radius={10} length={7} color="#999" width={3}  />
            <ProductTable filterText={this.state.filterText}
                          products={this.props.products}/>
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}

export default SearchableProductTable
