import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'
import {Nav, Navbar, NavItem, NavDropdown, MenuItem} from 'react-bootstrap'
import {ToastContainer, ToastMessage} from 'react-toastr'
import { LinkContainer } from 'react-router-bootstrap'
import { FormattedMessage } from 'react-intl'
import logo from 'assets/images/logo_180px.jpg'
import * as storage from 'persistence/storage'
import LanguageChooser from './menu/LanguageChooser'

const ToastMessageFactory = React.createFactory(ToastMessage.jQuery)

class Top extends Component {
  static contextTypes = {
    history: PropTypes.any
  }
  redirect(to) {
    const {history} = this.context
    history.pushState(null, to)
  }
  languageChange(value) {
    storage.put('locale', value)
    window.location.reload()
  }
  render() {
    return (
      <div>
        <Navbar fixedTop>
          <Navbar.Header>
            <Navbar.Brand>
              <Brand />
            </Navbar.Brand>
          </Navbar.Header>
          <LanguageChooser languageChange={::this.languageChange} />
          <Menu redirect={::this.redirect} application={this.props.application}/>
        </Navbar>
        <ToastContainer className="toast-top-right" ref="container" toastMessageFactory={ToastMessageFactory}/>
      </div>
    )
  }
}

const Brand = () =>
  <Link className="navbar-brand" to="/home">
    <img src={logo} style={{float: 'left', width: '180px', marginTop: '-14px', marginRight: '10px'}}/>
    <FormattedMessage id='header.title' />
  </Link>

const Profile = ({application}) =>
  <div><FormattedMessage id='header.myProfile' /> ({application.user.firstName})
    <span className="sr-only">(current)</span>
  </div>

const Menu = ({application, redirect}) => {
  const items = []
  if (application.userLoaded && application.user._id)
    if (!application.validVAT) {
      items.push(
        <LinkContainer key="profile" to="/profile">
          <NavItem><Profile application={application}/></NavItem>
        </LinkContainer>)
      items.push(
        <NavItem key="logout" onClick={() => redirect('/logout')}>
          <FormattedMessage id='header.logout' />
        </NavItem>)
    }
    else {
      items.push(
        <LinkContainer to="/request" key="request">
          <NavItem><FormattedMessage id='header.myRequest' /></NavItem>
        </LinkContainer>
      )
      items.push(
        <LinkContainer key="profile" to="/profile">
          <NavItem><Profile application={application}/></NavItem>
        </LinkContainer>)
      items.push(
        <NavItem key="logout" onClick={() => redirect('/logout')}>
          <FormattedMessage id='header.logout' />
        </NavItem>)
      const admin = application.user.categories.find(category => category._id === '5453b22771b95c0000b9ac7c')
      if (admin)
        items.push(<NavDropdown id="admin" eventKey={3} key="admin" title="Admin" bsStyle="primary">
            <MenuItem onSelect={() => redirect('/admin/requests')}>
              <FormattedMessage id='header.requests' />
            </MenuItem>
            <MenuItem onSelect={() => redirect('/admin/products')}>
              <FormattedMessage id='header.products' />
            </MenuItem>
            <MenuItem onSelect={() => redirect('/admin/users')}>
              <FormattedMessage id='shared.users' />
            </MenuItem>
            <MenuItem onSelect={() => redirect('/admin/reporting')}>
              Reporting
            </MenuItem>
          </NavDropdown>)
    }
  else
    items.push(
      <LinkContainer to="/login" key="login">
        <NavItem><FormattedMessage id="shared.signIn" /></NavItem>
      </LinkContainer>)

  return <Nav eventKey={0} pullRight>{items}</Nav>
}

export default Top
