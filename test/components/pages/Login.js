import React from 'react'
import {shallow, mount} from 'enzyme'
import helpers from 'test/helpers'
import {Login} from 'components/pages/Login'
import expect from 'expect'

describe('<Login />', () => {

  it('should render successfully', () => {
    const component = shallow(<Login />)
    expect(component.children().length > 0).toEqual(true)
  })

  it('should update state when email changes', () => {
    const component = helpers.mountWithIntl(<Login />)
    component.find({id: 'email'}).simulate('change', {target: {value: 'test@test.com'}})
    expect(component.state().email).toEqual('test@test.com')
  })

})
