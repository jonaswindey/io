import React, {Component, PropTypes} from 'react'
import ElementInput from 'components/shared/ElementInput'
import {FormattedMessage} from 'react-intl'
import {Row, Col, Button} from 'react-bootstrap'
import {connect} from 'react-redux'
import {Form} from 'formsy-react'
//import debug from 'debug'
import * as actions from 'actions/application'
import check from 'assets/images/check.png'
import translate from 'utils/translate'
//import europe from 'config/europe'

@connect(state => ({
  application: state.application,
  users: state.users,
}))
class Profile extends Component {

  static contextTypes = {
    store: PropTypes.object,
  }

  state = this.getState()

  getState() {
    const props = this.props
    const user = props.application.user

    let loading = !user._id
    let languages = []

    const state =  {
      user,
      languages,
      loading,
    }
    return state
  }

  handleSubmit(data) {
    // update user profile
    this.context.store.dispatch(actions.updateProfile(
      // assign user properties
      Object.assign(this.state.user,
        {firstName: data.firstName},
        {lastName: data.lastName},
        {email: data.email},
        {locale: data.locale}),

      // send attributesMap
      data,

      // send all attributes store
      this.state.userAttributes,
      this.context.store.history))
  }

  enableButton() {
    this.setState({
      canSubmit: true
    })
  }

  disableButton() {
    this.setState({
      canSubmit: false
    })
  }

  render() {
    return (
      <div className="wrap">
      <div className="container">
        <div
          className={'paper paper-curve-horiz request ' + (this.state.loading ? 'loading' : 'loaded')}>
          <Row>
            <Form onSubmit={::this.handleSubmit} onValid={::this.enableButton}
                  onInvalid={::this.disableButton}>

                  <Col lg={6} className="panel">
                    <h2>User information</h2>

                    <div className="form-horizontal">
                      <ElementInput type="text" translation="signin.firstName"
                                    name="firstName" required
                                    value={this.state.user.firstName || ''}/>
                      <ElementInput type="text" translation="signin.lastName"
                                    name="lastName" required
                                    value={this.state.user.lastName || ''}/>
                      <ElementInput type="text" translation="signin.email"
                                    name="email"
                                    validations="isEmail"
                                    value={this.state.user.email || ''}/>
                      <ElementInput type="select" translation="profile.language"
                                    name="locale" required
                                    value={this.state.locale || ''}>
                        <FormattedMessage id='profile.chooseLanguage'>
                          {(msg) => (<option>{msg}</option>)}
                        </FormattedMessage>
                        {this.state.languages.map(language => {
                          return (<option key={language._id}
                                         value={language.key}>{translate(language)}</option>)
                        })}
                      </ElementInput>
                    </div>
                  </Col>


              <div className="col-xs-12">
                <Button bsStyle="primary" className="pull-right" type="submit"
                        disabled={!this.state.canSubmit || this.props.application.updateProfileLoading}>
                        <FormattedMessage id="profile.updateProfile" /></Button>
                {this.props.application.updateProfileComplete &&
                <div style={{paddingRight: 20}} className="pull-right">
                  <img style={{width: 40}} src={check} />
                  <FormattedMessage id="shared.updateProfileComplete" />
                </div>}
              </div>
            </Form>
          </Row>
        </div>
      </div>
    </div>
    )
  }
}

export default Profile
