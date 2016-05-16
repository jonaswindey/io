import React from 'react'
import {shallow} from 'enzyme'
// import helpers from 'test/helpers'
import {Login} from 'components/pages/Login'
import expect from 'expect'

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
    expect(component.children().length > 0).toEqual(true)
  })

  it('should update state when email changes', () => {
    const component = shallow(<Login application={application} />)
    component.find({id: 'email'}).simulate('change', {target: {value: 'test@test.com'}})
    expect(component.state().email).toEqual('test@test.com')
  })

  it('should update state when password changes', () => {
    const component = shallow(<Login application={application} />)
    component.find({id: 'password'}).simulate('change', {target: {value: 'password'}})
    expect(component.state().password).toEqual('password')
  })

  it('should update state when firstName changes', () => {
    const component = shallow(<Login application={application} />)
    component.find({id: 'firstName'}).simulate('change', {target: {value: 'first name'}})
    expect(component.state().firstName).toEqual('first name')
  })

  it('should update state when lastName changes', () => {
    const component = shallow(<Login application={application} />)
    component.find({id: 'lastName'}).simulate('change', {target: {value: 'last name'}})
    expect(component.state().lastName).toEqual('last name')
  })

  it('should update state when registerEmail changes', () => {
    const component = shallow(<Login application={application} />)
    component.find({id: 'registerEmail'}).simulate('change', {target: {value: 'test@test.com'}})
    expect(component.state().registerEmail).toEqual('test@test.com')
  })

  it('should update state when registerPassword changes', () => {
    const component = shallow(<Login application={application} />)
    component.find({id: 'registerPassword'}).simulate('change', {target: {value: 'password'}})
    expect(component.state().registerPassword).toEqual('password')
  })

  it('should submit and call store when clicking login button', () => {
    const store = mockStore({})
    const context = {store}
    const component = shallow(<Login application={application} />, {context})
    component.find({id: 'loginButton'}).simulate('click')
    expect(store.getActions()).toEqual([{type: constants.LOG_IN_START}])
  })

})
