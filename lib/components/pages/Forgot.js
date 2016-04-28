import React, {PropTypes} from 'react'
import {FormControl, Row, Col, Button} from 'react-bootstrap'
import * as actions from '../../actions/application'
import * as storage from 'persistence/storage'
import {FormattedMessage} from 'react-intl'
import {connect} from 'react-redux'
import check from 'assets/images/check.png'

@connect(state => ({application: state.application}))
export default class Login extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      email: storage.get('email')
    }
  }
  static propTypes = {
    location: PropTypes.object
  };

  static contextTypes = {
    store: PropTypes.any,
  };

  emailChange(e) {
    this.setState({email: e.currentTarget.value})
  }

  handleSubmit(evt) {
    evt.preventDefault()
    this.context.store.dispatch(actions.forgot({email: this.refs.email.getValue()}))
  }

  render() {
    return (
      <div className="wrap">
        <div className="container">
          <div className="paper paper-curve-horiz request">
            <Row>
              <Col lg={4} lgOffset={2} md={5} mdOffset={1}>
                <form onSubmit={(e) => this.handleSubmit(e)}>
                  <h2><FormattedMessage id='shared.forgot'/></h2>
                  <p><FormattedMessage id='shared.forgotIntro'/></p>
                  <FormControl type="email" label={< FormattedMessage id = 'signin.email' />}
                      onChange={::this.emailChange} ref="email" value={this.state.email}/>
                  <Button disabled={this.props.application.forgotLoading}
                    type="submit" bsStyle="primary"><FormattedMessage id='shared.send'/></Button>
                  {this.props.application.forgotComplete &&<div style={{paddingTop: 20}}>
                    <img style={{width: 40}} src={check} />
                  <FormattedMessage id="shared.forgotComplete" />
                  </div>}
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
