import React, {Component} from 'react'
import RequestTable from './RequestTable'
import {Link} from 'react-router'
import {Row, Col, FormControl} from 'react-bootstrap'
import Loader from 'react-loader'

class SearchableRequestTable extends Component {
  state = {
    filterText: ''
  }

  onFilterChange(e) {
    this.setState({
      filterText: e.currentTarget.value
    })
  }

  render() {
    return (
      <div>
        <h3>
          <Link to="/admin/requests">Requests </Link>
          /
        </h3>
        <Row>
          <Col md={4}>
            <FormControl type="text" placeholder="Filter requests"
                   value={this.state.filterText}
                   onChange={::this.onFilterChange}
              />
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <div style={{minHeight: 150}}>
            <Loader loaded={this.props.inquiriesLoaded} lines={10} radius={10} length={7} color="#999" width={3}  />
            <RequestTable filterText={this.state.filterText}
                          inquiries={this.props.inquiries}/>
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}

export default SearchableRequestTable
