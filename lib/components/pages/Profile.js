import React, {Component, PropTypes} from 'react'
import ElementInput from 'components/shared/ElementInput'
import {FormattedMessage} from 'react-intl'
import {Row, Col, FormGroup, Button, Checkbox} from 'react-bootstrap'
import {connect} from 'react-redux'
import {Form} from 'formsy-react'
import debug from 'debug'
import * as actions from 'actions/application'
import check from 'assets/images/check.png'
import translate from 'utils/translate'
import europe from 'config/europe'

@connect(state => ({
  application: state.application,
  users: state.users,
}))
class Profile extends Component {

    static contextTypes = {
      store: PropTypes.object,
      history: PropTypes.object,
    }

    state = this.getState()

    getState() {
      const props = this.props
      const user = props.application.user

      let loading = !user._id
      let languages = []

      const userCategories = props.users.userCategories
      const userAttributes = props.users.userAttributes

      // find language choices from user attribute 'language'
      let languagesAttribute = userAttributes.find(userAttribute => {
        return userAttribute.key === 'language'
      })
      if (languagesAttribute) languages = languagesAttribute.choices

      let sectors = []
      // find category 'sector'
      if (userCategories.length > 0) {
        let sectorCategory = userCategories.find(userCategory => {
          return userCategory.key === 'sector'
        })
        if (sectorCategory)
          sectors = sectorCategory.children

      }
      let map = (key) => {
        if (user.attributesMap[key]) return user.attributesMap[key]
        return ''
      }

      let subSectors = []
      if (map('sector')) {
        let sector = sectors.find(sector => {
          return sector._id === map('sector')
        })
        if (sector)
          subSectors = sector.children

      }

      // return state object
      const state =  {
        user,
        languages,
        loading,
        userAttributes,
        sectors,
        subSectors,
        exhibitorName: map('exhibitorName'),
        locale: user.locale,
        sector: map('sector'),
        subSector: map('subSector'),
        invoiceOverride: map('invoiceOverride'),
        salesContactCompany: map('salesContactCompany'),
        salesContactAddress: map('salesContactAddress'),
        salesContactZip: map('salesContactZip'),
        salesContactCity: map('salesContactCity'),
        salesContactCountry: map('salesContactCountry'),
        salesContactVAT: map('salesContactVAT'),
        salesContactMobile: map('salesContactMobile'),
        salesContactPhone: map('salesContactPhone'),
        invoiceContactFirstName: map('invoiceContactFirstName'),
        invoiceContactLastName: map('invoiceContactLastName'),
        invoiceContactCompany: map('invoiceContactCompany'),
        invoiceContactAddress: map('invoiceContactAddress'),
        invoiceContactZip: map('invoiceContactZip'),
        invoiceContactCity: map('invoiceContactCity'),
        invoiceContactCountry: map('invoiceContactCountry'),
        invoiceContactVAT: map('invoiceContactVAT'),
        invoiceContactMobile: map('invoiceContactMobile'),
        invoiceContactPhone: map('invoiceContactPhone'),
        //isUpdating: authStore.isUpdating
      }
      return state
    }

    handleSubmit(data) {

      data.invoiceOverride = this.state.invoiceOverride

      if (!data.salesContactCountry)
        // no text in input field -> select belgium
        data.salesContactCountry = this.state.salesContactCountry

      if (!data.invoiceContactCountry)
        // no text in input field -> select belgium
        data.invoiceContactCountry = this.state.invoiceContactCountry


      if (!this.state.invoiceOverride) {
        data.invoiceContactFirstName = this.state.user.firstName
        data.invoiceContactLastName = this.state.user.lastName
        data.invoiceContactCompany = data.salesContactCompany
        data.invoiceContactAddress = data.salesContactAddress
        data.invoiceContactZip = data.salesContactZip
        data.invoiceContactCity = data.salesContactCity
        data.invoiceContactCountry = data.salesContactCountry
        data.invoiceContactVAT = data.salesContactVAT
        data.invoiceContactMobile = data.salesContactMobile
        data.invoiceContactPhone = data.salesContactPhone
      }

      data.profileComplete = true
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

    invoiceOverrideChange() {
      debug('dev')('invoiceOverrideChange')
      this.setState({
        invoiceOverride: !this.state.invoiceOverride,
        invoiceContactFirstName: null,
        invoiceContactLastName: null,
        invoiceContactCompany: null,
        invoiceContactAddress: null,
        invoiceContactZip: null,
        invoiceContactCity: null,
        invoiceContactCountry: null,
        invoiceContactVAT: null,
        invoiceContactMobile: null,
        invoiceContactPhone: null
      })
    }

    renderInvoiceContact() {
      if (this.state.invoiceOverride)
        return (
          <div>
            <h2><FormattedMessage id="profile.invoiceContact" /></h2>

            <div className="form-horizontal">
              <ElementInput type="text" translation="signin.firstName"
                            name="invoiceContactFirstName" required
                            value={this.state.invoiceContactFirstName || ''}/>
              <ElementInput type="text" translation="signin.lastName"
                            name="invoiceContactLastName" required
                            value={this.state.invoiceContactLastName || ''}/>
              <ElementInput type="text" translation="profile.companyName"
                            name="invoiceContactCompany" required
                            value={this.state.invoiceContactCompany || ''}/>
              <ElementInput type="text" translation="profile.address"
                            name="invoiceContactAddress" required
                            value={this.state.invoiceContactAddress || ''}/>
              <ElementInput type="text" translation="profile.zip"
                            name="invoiceContactZip" required
                            value={this.state.invoiceContactZip || ''}/>
              <ElementInput type="text" translation="profile.city"
                            name="invoiceContactCity" required
                            value={this.state.invoiceContactCity || ''}/>

              <ElementInput type="select" translation="profile.country"
                name="invoiceContactCountry" required
                value={this.state.invoiceContactCountry || ''}
                onSelectChange={::this.onInvoiceCountryChoiceChange}>
                <FormattedMessage id='shared.chooseCountry'>
                  {(msg) => (<option>{msg}</option>)}
                </FormattedMessage>
                {europe.map(country => {
                  return (<option key={country.value}
                    value={country.value}>{translate(country)}</option>)
                })}
              </ElementInput>

              <ElementInput type="text" translation="profile.vat"
                            validationCountry={this.state.invoiceContactCountry}
                            name="invoiceContactVAT" required
                            value={this.state.invoiceContactVAT || ''}/>

              <ElementInput type="text" translation="profile.mobile"
                            name="invoiceContactMobile"
                            value={this.state.invoiceContactMobile}/>
              <ElementInput type="text" translation="profile.phone"
                            name="invoiceContactPhone"
                            value={this.state.invoiceContactPhone}/>
            </div>
          </div>
        )
    }

    onSectorChange(event) {
      let sector = this.state.sectors.find(sector => {
        return sector._id === event.currentTarget.value
      })
      if (sector)
        this.setState({
          subSectors: sector.children
        })

    }

    onSalesCountryChoiceChange(e) {
      this.setState({salesContactCountry: e.currentTarget.value})
    }

    onInvoiceCountryChoiceChange(e) {
      this.setState({invoiceContactCountry: e.currentTarget.value})
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
                      <h2><FormattedMessage id="profile.clientInformation" /></h2>

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
                        <ElementInput type="text"
                                      translation="profile.exhibitorName"
                                      name="exhibitorName"
                                      value={this.state.exhibitorName || ''}
                                      required/>
                        <ElementInput type="select" translation="profile.sector"
                                      name="sector"
                                      required
                                      onSelectChange={::this.onSectorChange}
                                      value={this.state.sector || ''}>
                          <FormattedMessage id='profile.chooseSector'>
                            {(msg) => (<option>{msg}</option>)}
                          </FormattedMessage>
                          {this.state.sectors.map(sector => {
                            return (<option key={sector._id}
                                           value={sector._id}>{translate(sector)}</option>)
                          })}
                        </ElementInput>
                        <ElementInput type="select" translation="profile.subSector"
                                      name="subSector"
                                      required
                                      value={this.state.subSector || ''}>
                          <FormattedMessage id='profile.chooseSubSector'>
                            {(msg) => (<option>{msg}</option>)}
                          </FormattedMessage>
                          {this.state.subSectors.map(sector => {
                            return (<option key={sector._id}
                                           value={sector._id}>{translate(sector)}</option>)
                          })}
                        </ElementInput>
                      </div>
                    </Col>

                <Col lg={6} className="panel">
                  <h2><FormattedMessage id="profile.salesContact" /></h2>

                  <div className="form-horizontal">
                    <ElementInput type="text" translation="profile.companyName"
                                  name="salesContactCompany" required
                                  value={this.state.salesContactCompany || ''}/>
                    <ElementInput type="text" translation="profile.address"
                                  name="salesContactAddress" required
                                  value={this.state.salesContactAddress || ''}/>
                    <ElementInput type="text" translation="profile.zip"
                                  name="salesContactZip" required
                                  value={this.state.salesContactZip || ''}/>
                    <ElementInput type="text" translation="profile.city"
                                  name="salesContactCity" required
                                  value={this.state.salesContactCity || ''}/>

                    <ElementInput type="select" translation="profile.country"
                      name="salesContactCountry" required
                      value={this.state.salesContactCountry || ''}
                      onSelectChange={::this.onSalesCountryChoiceChange}>
                      <FormattedMessage id='shared.chooseCountry'>
                        {(msg) => (<option>{msg}</option>)}
                      </FormattedMessage>
                      {europe.map(country => {
                        return (<option key={country.value}
                          value={country.value}>{translate(country)}</option>)
                      })}
                    </ElementInput>

                    <ElementInput type="text" translation="profile.vat"
                                  validationCountry={this.state.salesContactCountry}
                                  name="salesContactVAT" required
                                  value={this.state.salesContactVAT || ''}/>

                    <ElementInput type="text" translation="profile.mobile"
                                  name="salesContactMobile"
                                  value={this.state.salesContactMobile || ''}/>
                    <ElementInput type="text" translation="profile.phone"
                                  name="salesContactPhone"
                                  value={this.state.salesContactPhone || ''}/>

                    <FormGroup>
                      <Checkbox inline
                        onChange={::this.invoiceOverrideChange}
                        checked={!this.state.invoiceOverride}>
                        <FormattedMessage id="profile.invoiceSame" />
                      </Checkbox>
                    </FormGroup>
                     </div>
                  {this.renderInvoiceContact()}
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
