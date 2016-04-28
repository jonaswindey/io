import React, {Component, PropTypes} from 'react'
import UserTable from 'components/admin/users/UserTable'
import Selection from 'components/admin/users/Selection'
import {connect} from 'react-redux'
import * as userActions from 'actions/users'
import * as mailTemplateActions from 'actions/mailtemplates'
import debug from 'debug'

@connect(state => ({
  users: state.users,
  mailTemplates: state.mailTemplates
}))
class Users extends Component {

  state = {
    selection: []
  }

  static contextTypes = {
    history: PropTypes.any
  }

  componentDidMount() {
    debug('dev')('Users :: componentDidMount()')
    this.props.dispatch(userActions.fetchUsersReporting())
    this.props.dispatch(mailTemplateActions.fetchMailTemplates({},{pageSize: 0}))
  }

  selectionChange(users, checked) {
    this.context.history.pushState(null, '/admin/users')
    this.props.dispatch(userActions.selectUsers(users, checked))
  }

  clearSelection() {
    this.props.dispatch(userActions.clearSelection())
  }

  render() {
    debug('dev')('Users :: render()')
    return (
      <div className="wrap">
        <div className="container">
          <div className="paper paper-curve-horiz request">
            <div className="row">
            <div className="col-md-7">
              <UserTable
                users={this.props.users.users}
                usersLoaded={this.props.users.usersLoaded}
                selectionChange={::this.selectionChange}/>
            </div>
            {this.props.children && (this.props.users.selection.length === 0 || this.props.params.id) &&
              <div style={{paddingTop: 0}}>
                {this.props.children}
              </div>
            }
            {this.props.users.selection.length > 0 && !this.props.params.id &&
              <div className="col-md-5">
                <Selection
                  users={this.props.users.selection}
                  mailTemplates={this.props.mailTemplates.mailTemplates}
                  sendState={this.props.mailTemplates.sendState}
                  selectionChange={::this.selectionChange}
                  clearSelection={::this.clearSelection} />
              </div>
            }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Users
