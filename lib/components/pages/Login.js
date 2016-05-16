import React, {PropTypes} from 'react'
import {Col, Form, FormGroup, FormControl, ControlLabel, Row} from 'react-bootstrap'
import * as actions from '../../actions/application'
import * as storage from 'persistence/storage'
import {connect} from 'react-redux'
import {FormattedMessage} from 'react-intl'
import ProgressButton from 'react-progress-button'
import {Link} from 'react-router'

export class Login extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      email: storage.get('email'),
      password: '',
      firstName: '',
      lastName: '',
      registerEmail: '',
      registerPassword: '',
    }
  }

  static contextTypes = {
    store: PropTypes.any,
    intl: React.PropTypes.object
  };

  emailChange(e) {
    this.setState({email: e.target.value})
  }

  passwordChange(e) {
    this.setState({password: e.target.value})
  }

  firstNameChange(e) {
    this.setState({firstName: e.target.value})
  }

  lastNameChange(e) {
    this.setState({lastName: e.target.value})
  }

  registerEmailChange(e) {
    this.setState({registerEmail: e.target.value})
  }

  registerPasswordChange(e) {
    this.setState({registerPassword: e.target.value})
  }

  handleSubmit() {
    const {store} = this.context
    const {router} = this.props
    const {email, password} = this.state
    store.dispatch(actions.logIn({
      email,
      password,
      router,
      redirect: '/',
    }))
  }

  register() {
    /*const {firstName, lastName} = this.state
    const email = this.state.registerEmail.toLowerCase()
    const password = this.state.registerPassword
    const {store} = this.context
    const {router} = this.props
    if (firstName.length > 0 && lastName.length > 0
      && email.length > 0 && password.length > 0)
      store.dispatch(actions.register({firstName, lastName, email, password, router}))*/
  }

  render() {
    return (
      <div className="wrap">
        <div className="container">
          <div className="paper paper-curve-horiz request">
            <Row>
              <Col lg={4} lgOffset={2} md={5} mdOffset={1}>
                <form onSubmit={::this.handleSubmit}>
                  <h2><FormattedMessage id='signin.existingUser'/></h2>

                  <FormGroup>
                    <ControlLabel><FormattedMessage id = 'signin.email' /></ControlLabel>
                    <FormControl id="email"
                      type="email" onChange={::this.emailChange} value={this.state.email} />
                  </FormGroup>

                  <FormGroup>
                    <ControlLabel><FormattedMessage id = 'signin.password' /></ControlLabel>
                    <FormControl id="password"
                      type="password" onChange={::this.passwordChange} value={this.state.password} />
                  </FormGroup>

                  <ProgressButton
                    id="loginButton"
                    onClick={::this.handleSubmit}
                    state={this.props.application.loginState}>
                    <FormattedMessage id='shared.signIn'/>
                  </ProgressButton>

                  <div style={{paddingTop: 20}}>
                    <Link to="/forgot">
                      <FormattedMessage id='shared.forgot'/>
                    </Link>
                  </div>
                </form>
                <hr/>
              </Col>
              <Col lg={4} lgOffSet={2} md={5}>
                <Form onSubmit={(e) => this.register(e)}>
                  <h2><FormattedMessage id='signin.newUser'/></h2>
                  <FormGroup>
                    <ControlLabel><FormattedMessage id='signin.firstName' /></ControlLabel>
                    <FormControl id="firstName"
                      type="text" onChange={::this.firstNameChange} value={this.state.firstName} />
                  </FormGroup>
                  <FormGroup>
                    <ControlLabel><FormattedMessage id='signin.lastName' /></ControlLabel>
                    <FormControl id="lastName"
                      type="text" onChange={::this.lastNameChange} value={this.state.lastName} />
                  </FormGroup>
                  <FormGroup>
                    <ControlLabel><FormattedMessage id = 'signin.email' /></ControlLabel>
                    <FormControl id="registerEmail"
                      type="email" onChange={::this.registerEmailChange} value={this.state.registerEmail} />
                  </FormGroup>
                  <FormGroup>
                    <ControlLabel><FormattedMessage id = 'signin.password' /></ControlLabel>
                    <FormControl id="registerPassword"
                      type="password" onChange={::this.registerPasswordChange} value={this.state.registerPassword} />
                  </FormGroup>
                  <ProgressButton
                    id="registerButton"
                    onClick={(e) => this.register(e)}
                    state={this.props.application.registerState}>
                    <FormattedMessage id='signin.register'/>
                  </ProgressButton>
                </Form>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(state => ({application: state.application}))(Login)
