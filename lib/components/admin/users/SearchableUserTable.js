import React, {Component} from 'react'
import UserTable from './UserTable'
import {Link} from 'react-router'
import {Row, Col} from 'react-bootstrap'
import Loader from 'react-loader'

class SearchableUserTable extends Component {
  state = {
    filterText: ''
  }

  render() {
    return (
      <div>
        <h3>
          <Link to="/admin/users">Users </Link>
          /
        </h3>
        <Row>
          <Col sm={12}>
            <div style={{minHeight: 150}}>
            <Loader loaded={this.props.usersLoaded} lines={10} radius={10} length={7} color="#999" width={3}  />
            <UserTable
              selectionChange={this.props.selectionChange}
              users={this.props.users}/>
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}

export default SearchableUserTable
