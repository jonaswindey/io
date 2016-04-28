import React, {Component, PropTypes} from 'react'
import Row from './Row'
import changeCase from 'change-case'
import {Button, ButtonToolbar} from 'react-bootstrap'
import {Link} from 'react-router'
import { fetchOnUpdate } from '../../decorators'
import Spinner from '../shared/Spinner'

@fetchOnUpdate(['group', 'keywords'], (params, actions) => {
  const { group, keywords } = params
  actions.fetchUsers({ group, keywords })
})
export default class List extends Component {
  static contextTypes = {
    router: PropTypes.object,
    store: PropTypes.object.isRequired,
    intl: React.PropTypes.object,
    history: PropTypes.any
  };

  static propTypes = {
    params: PropTypes.object.isRequired,
    users: PropTypes.object.isRequired,
  };

  _changeKeywordsFilter(group, keywords) {
    this.context.router.transitionTo('/users/' + group + (keywords?'/' + keywords:''))
  }

  _changeGroupFilter(group, keywords) {
    this.context.router.transitionTo('/users/' + group + (keywords?'/' + keywords:''))
  }

  _renderFilters(group, keywords) {
    return (
      <div className="ibox-content ibox-heading"
        style={{'textAlign': 'center'}}>
        <ButtonToolbar>
          <Button key={'officeSearchBtn'}
            bsStyle="info"
            bsSize="small"
            onClick={() => this._changeGroupFilter('office', keywords)}>
            {this.context.intl.getMessage('users.office')}
          </Button>
          <Button key={'supplierSearchBtn'}
            bsStyle="info"
            bsSize="small"
            onClick={() => this._changeGroupFilter('supplier', keywords)}>
            {this.context.intl.getMessage('users.supplier')}
          </Button>
          <Button key={'customerSearchBtn'}
            bsStyle="info"
            bsSize="small"
            onClick={() => this._changeGroupFilter('client', keywords)}>
            {this.context.intl.getMessage('users.client')}
          </Button>
          <Button key={'keywordSearchBtn'}
            bsStyle="info"
            bsSize="small"
            onClick={() => this._changeKeywordsFilter('bruno', keywords)}>
            {this.context.intl.getMessage('users.search')}
          </Button>
        </ButtonToolbar>
      </div>
    )
  }

  _renderList(columns) {
    return (
      <div>
        <div className="ibox-title">
          <h5>Users
            <small style={{paddingLeft: '5px'}}>(#{this.props.users.count})</small>
          </h5>
        </div>
        <div className="ibox-content">
          <div className="row">
            <div className="col-lg-12">
              {(
                this.props.users.usersLoaded ?
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      {columns.map((column) =>
                        <th key={column.key}>
                          {changeCase.titleCase(column.key)}
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {this.props.users.users.map((user) =>
                      <Row key={'row' + user._id}
                        columns={columns}
                        user={user}
                        group={this.props.params.group}
                        />
                    )}
                  </tbody>
                </table>
                :
                <div style={{width: '100px', marginLeft: 'auto', marginRight: 'auto'}}>
                  <Spinner active dark />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const group = this.props.params.group ? this.props.params.group : 'all'
    const keywords = this.props.params.keywords ? this.props.params.keywords : ''
    const model = require('./../../models/users/' + group + '_detail')
    const columns = model.Columns
    return (
      <div className="ibox float-e-margins">
        <div className="ibox-title">
          <h5>
            Filter users
          </h5>
          <div width="100%">
            <Link to='/users/client/detail/new'
              className="pull-right"
              style={{marginTop: '-7px'}}>
              <Button bsStyle="success">Create new</Button>
            </Link>
          </div>
        </div>
        {this._renderFilters(group, keywords)}
        {this._renderList(columns)}
      </div>
    )

    return <div />
  }
}
