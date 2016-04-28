import React, {Component, PropTypes} from 'react'
import {Nav, NavItem, Row, Col} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { FormattedMessage } from 'react-intl'
import * as inquiryActions from 'actions/inquiries'
import {connect} from 'react-redux'
import debug from 'debug'

@connect(state => ({
  inquiries: state.inquiries,
}))
class Request extends Component {

    static contextTypes = {
      store: PropTypes.any,
      history: PropTypes.any,
    }

    changeUrl() {
      location.href = '/success'
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

    componentDidMount() {
      this.props.dispatch(inquiryActions.fetchUserInquiry())
    }

    componentWillReceiveProps(props) {
      if (!this.props.inquiries.inquiryLoaded && props.inquiries.inquiryLoaded
      || (props.location.pathname === '/request' && this.props.location.pathname !== props.location.pathname)) {
        let current = false
        const {history} = this.context
        if (props.inquiries.inquiry && props.inquiries.inquiry.hasOwnProperty('_id')) current = true
        if (this.props.route.name === 'request')
          if (current) {
            debug('dev')('No current inquiry: redirect to /status')
            history.pushState(null, '/request/status')
          }
          else {
            debug('dev')('No current inquiry: redirect to /packages')
            history.pushState(null, '/request/packages')
          }
        else
          if (!current) {
            debug('dev')('No current inquiry: redirect to /packages')
            history.pushState(null, '/request/packages')
          }
      }
    }

    renderMenu() {
      const menu = []
      const current = this.props.inquiries.inquiry._id
      //const open = true

      let open = false
      this.props.inquiries.orders.forEach(order => {
        if (['closed', 'accepted', 'declined'].lastIndexOf(order.status) === -1) open = true
      })

      if (!current)
        menu.push(
          <LinkContainer to="/request/packages" key="packages"><NavItem>New request</NavItem></LinkContainer>
        )
      else
        menu.push(
          <LinkContainer to="/request/status" key="packages"><NavItem>Status</NavItem></LinkContainer>
        )

      if (current && !open)
        menu.push(
          <LinkContainer to="/request/complementary" key="complementary">
            <NavItem>
              <FormattedMessage id='header.orderComplementaryItems' />
            </NavItem>
          </LinkContainer>
        )

      if (current && !open)
        return (
            <Nav bsStyle="tabs" style={{marginBottom: '20px'}}>
              {menu}
            </Nav>
        )
    }

    render() {
      if (this.props.inquiries.inquiryLoaded)
        return (
          <div className="wrap">
            <div className="container">
              <div className="paper paper-curve-horiz request">
                <Row>
                  <Col md={12} className="col-nav">
                    {this.renderMenu()}
                  </Col>
                  <Col md={12}>
                    {this.props.children && React.cloneElement(this.props.children)}
                  </Col>
               </Row>
            </div>
          </div>
          </div>
        )
      return <div>Loading..</div>
    }
}


export default Request
