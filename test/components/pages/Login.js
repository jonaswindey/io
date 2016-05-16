import React from 'react'
import {shallow} from 'enzyme'
import {Login} from 'components/pages/Login'

import {constants} from 'config/constants'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

const application = {
  loginState: ''
}

describe('<Login />', () => {

  it('should render successfully', () => {
    const component = shallow(<Login application={application} />)
    component.children().length.should.be.above(0)
  })

  it('should update state when email changes', () => {
    const component = shallow(<Login application={application} />)
    component.find({id: 'email'}).simulate('change', {target: {value: 'test@test.com'}})
    component.state().email.should.equal('test@test.com')
  })

  it('should update state when password changes', () => {
    const component = shallow(<Login application={application} />)
    component.find({id: 'password'}).simulate('change', {target: {value: 'password'}})
    component.state().password.should.equal('password')
  })

  it('should update state when firstName changes', () => {
    const component = shallow(<Login application={application} />)
    component.find({id: 'firstName'}).simulate('change', {target: {value: 'first name'}})
    component.state().firstName.should.equal('first name')
  })

  it('should update state when lastName changes', () => {
    const component = shallow(<Login application={application} />)
    component.find({id: 'lastName'}).simulate('change', {target: {value: 'last name'}})
    component.state().lastName.should.equal('last name')
  })

  it('should update state when registerEmail changes', () => {
    const component = shallow(<Login application={application} />)
    component.find({id: 'registerEmail'}).simulate('change', {target: {value: 'test@test.com'}})
    component.state().registerEmail.should.equal('test@test.com')
  })

  it('should update state when registerPassword changes', () => {
    const component = shallow(<Login application={application} />)
    component.find({id: 'registerPassword'}).simulate('change', {target: {value: 'password'}})
    component.state().registerPassword.should.equal('password')
  })

  it('should submit and call store when clicking login button', () => {
    const store = mockStore({})
    const context = {store}
    const component = shallow(<Login application={application} />, {context})
    component.find({id: 'loginButton'}).simulate('click', new Event('click'))
    store.getActions().should.deep.equal([{type: constants.LOG_IN_START}])
  })

})
