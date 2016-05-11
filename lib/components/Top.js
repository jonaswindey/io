import React, {Component} from 'react'
import {Link} from 'react-router'
import {Nav, Navbar, NavItem} from 'react-bootstrap'
import {ToastContainer, ToastMessage} from 'react-toastr'
import {LinkContainer} from 'react-router-bootstrap'
import {FormattedMessage} from 'react-intl'
import logo from 'assets/images/3nit-logo_header.png'
import * as storage from 'persistence/storage'
import {withRouter} from 'react-router'

const ToastMessageFactory = React.createFactory(ToastMessage.jQuery)

class Top extends Component {
  redirect(to) {
    this.props.router.push(to)
  }
  languageChange(value) {
    storage.put('locale', value)
    window.location.reload()
  }
  render() {
    return (
      <div>
        <Navbar fixedTop inverse className="navbar-static-top">
          <Navbar.Header>
            <Navbar.Brand>
              <Brand />
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Menu redirect={::this.redirect} application={this.props.application}/>
        </Navbar>
        <ToastContainer className="toast-top-right" ref="container" toastMessageFactory={ToastMessageFactory}/>
      </div>
    )
  }
}

const Brand = () =>
  <Link className="navbar-brand" to="/home">
    <img src={logo} style={{float: 'left', width: 170, marginTop: -12, marginRight: 10}}/>
  </Link>

const Profile = ({application}) =>
  <div><FormattedMessage id='header.myProfile' /> ({application.user.firstName})
    <span className="sr-only">(current)</span>
  </div>

const Menu = ({application, redirect}) => {
  const items = []
  if (application.userLoaded && application.user._id) {
    items.push(
      <LinkContainer key="profile" to="/profile">
        <NavItem><Profile application={application}/></NavItem>
      </LinkContainer>)
    items.push(
      <NavItem key="logout" onClick={() => redirect('/logout')}>
        <FormattedMessage id='header.logout' />
      </NavItem>)
  }
  else
    items.push(
      <LinkContainer to="/login" key="login">
        <NavItem><FormattedMessage id="shared.signIn" /></NavItem>
      </LinkContainer>)

  return <Navbar.Collapse><Nav eventKey={0} pullRight>{items}</Nav></Navbar.Collapse>
}

export default withRouter(Top)
