import React, { PropTypes } from 'react'
import Top from './Top'
import Foot from './Foot'
import { connect } from 'react-redux'
import * as actions from 'actions/application'
import * as storage from 'persistence/storage'
import {withRouter} from 'react-router'

class Application extends React.Component {

  static propTypes = {
    children: PropTypes.any
  }

  static contextTypes = {
    store: PropTypes.any,
  }

  componentDidMount() {
    const {store} = this.context
    const {router} = this.props
    store.dispatch(actions.fetchProfile({token: storage.get('token'), router}))
  }

  constructor(props, context) {
    super(props, context)

    this.handleMenuClick = this.handleMenuClick.bind(this)

    this.state = {
      isMenuActive: false
    }
  }

  handleMenuClick(evt) {
    evt.preventDefault()
    this.setState({isMenuActive: !this.state.isMenuActive})
  }

  render() {
    if (!this.props.application.userLoaded) return <div />
    return (
      <div>
        <div>
          <Top {...this.props} />
          {this.props.children}
          <Foot {...this.props} />
        </div>
      </div>
    )

  }
}

export default withRouter(connect(
  ({ application }) => ({ application }),
)(Application))
