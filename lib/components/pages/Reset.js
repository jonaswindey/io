import React, {PropTypes} from 'react'
import {FormControl, Row, Col, Button} from 'react-bootstrap'
import * as actions from '../../actions/application'
import {FormattedMessage} from 'react-intl'
import {connect} from 'react-redux'

@connect(state => ({application: state.application}))
export default class Login extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      password: '',
      passwordConfirm: ''
    }
  }

  static contextTypes = {
    store: PropTypes.any,
    history: PropTypes.any,
  };

  passwordChange(e) {
    this.setState({password: e.currentTarget.value})
  }

  passwordConfirmChange(e) {
    this.setState({passwordConfirm: e.currentTarget.value})
  }

  handleSubmit(evt) {
    evt.preventDefault()
    const {store, history} = this.context
    const token = `Bearer ${this.props.location.query.token}`
    store.dispatch(actions.reset({password: this.refs.password.getValue(), history, token}))
  }

  render() {
    return (
      <div className="wrap">
        <div className="container">
          <div className="paper paper-curve-horiz request">
            <Row>
              <Col lg={4} lgOffset={2} md={5} mdOffset={1}>
                <form onSubmit={(e) => this.handleSubmit(e)}>
                  <h2><FormattedMessage id='shared.reset'/></h2>
                  <p><FormattedMessage id='shared.resetIntro'/></p>
                  <FormControl type="password" label={< FormattedMessage id = 'signin.password' />}
                      onChange={::this.passwordChange} ref="password" value={this.state.email}/>
                  <Button disabled={this.props.application.forgotLoading}
                    type="submit" bsStyle="primary"><FormattedMessage id='shared.send'/></Button>
                </form>
                <hr/>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    )
  }
}
