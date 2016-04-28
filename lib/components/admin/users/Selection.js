import React, {Component, PropTypes} from 'react'
import {Form, FormGroup, FormControl, ListGroup, ListGroupItem, Button, Well} from 'react-bootstrap'
import * as mailTemplateActions from 'actions/mailtemplates'
import ProgressButton from 'react-progress-button'
// import {FormattedMessage} from 'react-intl'

class Selection extends Component {

  state = {
    mailTemplate: '',
    confirm: false,
  }

  static contextTypes = {
    store: PropTypes.any
  }

  sendMail() {
    this.context.store.dispatch(
      mailTemplateActions.sendMailTemplate(
        this.state.mailTemplate, this.props.users.map(user => user._id) ))
  }

  selectionChange(user) {
    this.props.selectionChange(user, false)
  }

  componentWillReceiveProps(props) {
    if (props.sendState !== this.props.sendState && props.sendState === 'success')
      setTimeout(() => {
        this.setState({confirm: false})
        this.context.store.dispatch(mailTemplateActions.reset())
      }, 500)
  }

  render() {
    return (
      <div>
      <h4>
        Selection: {this.props.users.length}
        <a style={{cursor: 'pointer', float: 'right'}} onClick={() => this.props.clearSelection()}>Remove all</a>
      </h4>
      <ListGroup>
      {
        this.props.users.map(user => {
          return (
            <ListGroupItem
              style={{padding: 3, fontSize: 12}}
              key={user._id}>
              <span>{user.firstName} {user.lastName} ({user.email})</span>
              <a style={{cursor: 'pointer', float: 'right'}} onClick={() => this.selectionChange([user])}>Remove</a>
            </ListGroupItem>
          )
        })
      }
      </ListGroup>
      <h4>Send e-mail</h4>
        <Form inline>
          <FormGroup>
            <FormControl componentClass="select" value={this.state.mailTemplate}
                onChange={(e) => this.mailTemplateChange(e)}>
              <option value="">-No value-</option>
              {this.props.mailTemplates.map(mailTemplate => {
                return <option value={mailTemplate._id} key={mailTemplate._id}>{mailTemplate.key}</option>
              })}
            </FormControl>
            <Button onClick={() => this.confirm()}>Send</Button>
          </FormGroup>
        </Form>
        {
          this.state.confirm &&
            <Well style={{marginTop: 20}}>
              <p>Are you sure you want to send <br /><b>{this.state.mailTemplateKey} </b>
              to <b>{this.props.users.length}</b> user(s)?</p>
            <ProgressButton
              onClick={::this.sendMail}
              state={this.props.sendState}>
              Send e-mail
            </ProgressButton>
          </Well>
        }
      </div>
    )
  }

  mailTemplateChange(e) {
    const mailTemplate = this.props.mailTemplates.find(mailTemplate => mailTemplate._id === e.currentTarget.value)
    if (mailTemplate)
      this.setState({mailTemplate: mailTemplate._id, mailTemplateKey: mailTemplate.key})
    else
      this.setState({mailTemplate: '', mailTemplateKey: ''})
  }

  confirm() {
    if (this.state.mailTemplate.length > 0)
      this.setState({confirm: true})
  }
}

export default Selection
