import React, {Component} from 'react'
import {FormattedMessage} from 'react-intl'
import Icon from 'react-fa'
import { LinkContainer } from 'react-router-bootstrap'
import {Button, Table} from 'react-bootstrap'
import {constants} from 'config/constants'
import moment from 'moment'
import check from 'assets/images/check.png'

class RequestTable extends Component {

  state = {
    sort: 'reference',
    order: 1
  }

  renderSteps(status) {
    const getStatus = step => {
      switch (status) {
        case 'requested':
          if (step === 'request')
            return 'complete'
          else
            return 'disabled'
          break
        case 'approved':
          if (step === 'request')
            return 'complete'
          else if (step === 'offer')
            return 'complete'
          else
            return 'disabled'
          break
        case 'accepted':
          return 'complete'
          break
        default:
          return 'complete'
          break
      }
    }
    if (status !== 'closed' && status !== 'declined')
      return (
        <div>
          <div className="row bs-wizard">
            <div className={'col-xs-4 bs-wizard-step ' + getStatus('request')}>
              <div
                className="text-center bs-wizard-stepnum"><FormattedMessage id='order.request' /></div>
              <div className="progress">
                <div className="progress-bar"></div>
              </div>
              <a className="bs-wizard-dot"></a>
            </div>

            <div className={'col-xs-4 bs-wizard-step ' + getStatus('offer')}>
              <div
                className="text-center bs-wizard-stepnum"><FormattedMessage id='order.offer' /></div>
              <div className="progress">
                <div className="progress-bar"></div>
              </div>
              <a className="bs-wizard-dot"></a>
            </div>

            <div className={'col-xs-4 bs-wizard-step ' + getStatus('order')}>
              <div
                className="text-center bs-wizard-stepnum"><FormattedMessage id='order.order' /></div>
              <div className="progress">
                <div className="progress-bar"></div>
              </div>
              <a className="bs-wizard-dot"></a>
            </div>
          </div>
        </div>
      )
    else if (status === 'closed')
      return (
        <div style={{width: '100%', textAlign: 'center'}}><img style={{width: 30}} src={check} />Closed </div>
      )
  }

  renderActionRequired(inquiry) {
    if (inquiry.actionRequired)
      return (<Icon name="hand-o-right"
                   style={{fontSize: '24px', lineHeight: '40px'}}/>)

    else
      return <div />

  }

  renderAction(inquiry) {
    let key = 'order.edit'
    let style = 'primary'
    if (inquiry.action) {
      style = 'success'
      key = 'order.' + inquiry.action
    }
    return (
      <LinkContainer eventKey={1}
        to={`/admin/request/${inquiry._id}`}>
          <Button bsStyle={style} bsSize="small">
            <FormattedMessage id={key} />
          </Button>
      </LinkContainer>
    )
  }

  renderPayed(inquiry) {
    if (inquiry.orders[inquiry.orders.length - 1].status === 'closed')
      return (
          <Button
            bsStyle='warning' bsSize="xsmall" style={{marginLeft: 5}}>
            Unpaid
          </Button>
      )
  }

  sort(key) {
    let order = this.state.order
    if (key === this.state.sort)
      order = -order

    this.props.inquiries.sort((a, b) => {
      if (a[key] < b[key]) return -order
      if (a[key] > b[key]) return order
      return 0
    })
    this.setState({sort: key, order})
  }

  renderSortArrow(key) {
    if (this.state.sort === key)
      if (this.state.order === 1)
        return <Icon name="arrow-down"/>

      else
        return <Icon name="arrow-up"/>

  }

  render() {
    return (
      <Table striped bordered condensed hove>
        <thead>
        <tr style={{cursor: 'pointer'}}>
          <th></th>
          <th
            onClick={this.sort.bind(this, 'reference')}>{this.renderSortArrow('reference')}Reference
          </th>
          <th
            onClick={this.sort.bind(this, 'status')}>{this.renderSortArrow('status')}Status
          </th>
          <th
            onClick={this.sort.bind(this, 'created')}>{this.renderSortArrow('created')}Created
          </th>
          <th
            onClick={this.sort.bind(this, 'creator')}>{this.renderSortArrow('creator')}Creator
          </th>
          <th
            onClick={this.sort.bind(this, 'company')}>{this.renderSortArrow('company')}Company
          </th>
          <th>Action</th>
        </tr>
        </thead>
        <tbody>
        {this.props.inquiries.map(inquiry => {

          let company = ''
          inquiry.creator.attributes.forEach(attribute => {
            if (attribute.attribute === constants.USER_ATTRIBUTE_COMPANY)
              company = attribute.value
          })

          const filter = this.props.filterText.toLowerCase()

          if (inquiry.reference.toLowerCase().lastIndexOf(filter) > -1 ||
            inquiry.creator.firstName.toLowerCase().lastIndexOf(filter) > -1 ||
            inquiry.creator.lastName.toLowerCase().lastIndexOf(filter) > -1 ||
            inquiry.orders[0].status.toLowerCase().lastIndexOf(filter) > -1 ||
            company.toLowerCase().lastIndexOf(filter) > -1
          )

            return (
              <tr key={inquiry._id}>
                <td>{this.renderActionRequired(inquiry)}</td>
                <td
                  className="col-md-1" style={{minWidth: 100}}>
                  {inquiry.orders[inquiry.orders.length - 1].reference}</td>
                <td className="col-md-4">
                  <div
                    className="hidden-sm hidden-xs">
                      {this.renderSteps(inquiry.orders[inquiry.orders.length - 1].status)}
                  </div>
                  <div
                    className="hidden-md hidden-lg">{inquiry.orders[inquiry.orders.length - 1].status}</div>
                </td>
                <td
                  className="col-md-2">{moment(inquiry.created).format('DD MMM YYYY @ hh:mm:ss')}</td>
                <td
                  className="col-md-2">{inquiry.creator.firstName} {inquiry.creator.lastName}</td>
                <td
                  className="col-md-2">{company}</td>
                <td className="col-md-2" style={{minWidth: 180, textAlign: 'center'}}>
                  {this.renderAction(inquiry)}
                  {this.renderPayed(inquiry)}
                </td>
              </tr>
            )

        })}
        </tbody>
      </Table>
    )
  }
}

export default RequestTable
