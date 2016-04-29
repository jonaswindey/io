import React, { PropTypes } from 'react'
import Top from './Top'
import Foot from './Foot'
import { connect } from 'react-redux'
import * as actions from 'actions/application'
import * as storage from 'persistence/storage'

class Application extends React.Component {

  static propTypes = {
    children: PropTypes.any
  }

  static contextTypes = {
    store: PropTypes.any,
    history: PropTypes.any,
  }

  componentDidMount() {
    const {store, history} = this.context
    store.dispatch(actions.fetchProfile({token: storage.get('token'), history}))
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

export default connect(
  ({ application }) => ({ application }),
)(Application)
