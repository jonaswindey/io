import React from 'react'
import {Button, ButtonGroup} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'

const ReportingMenu = () => {
  return (
    <div>
      <h1>2016</h1>
      <ButtonGroup vertical style={{width: '100%'}}>
        <LinkContainer to="/admin/reporting/2016/turnover">
          <Button bsSize="sm">Turnover</Button>
        </LinkContainer>
        <LinkContainer to="/admin/reporting/2016/exhibitors">
          <Button bsSize="sm">Exhibitors + products</Button>
        </LinkContainer>
        <LinkContainer to="/admin/reporting/2016/standnames">
          <Button bsSize="sm">Stand names</Button>
        </LinkContainer>
        <LinkContainer to="/admin/reporting/2016/foodbank">
          <Button bsSize="sm">Foodbank</Button>
        </LinkContainer>
      </ButtonGroup>
      <h3>2015</h3>
      <ButtonGroup vertical >
        <Button bsSize="sm">Turnover</Button>
        <Button bsSize="sm">Exhibitors</Button>
        <Button bsSize="sm">Stand names</Button>
        <Button bsSize="sm">Foodbank</Button>
      </ButtonGroup>
    </div>
  )
}

export default ReportingMenu
