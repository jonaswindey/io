import React from 'react'
import ResponsiveFixedDataTable from 'responsive-fixed-data-table'
import {Column, Cell} from 'fixed-data-table'
import {getValue, getOrderValue} from 'utils/reporthelper'

const TurnOver = props => {
  const {report} = props
  return (
    <div className="row">
      <div className="col-sm-12" style={{height: 600, fontSize: 11}}>
        <ResponsiveFixedDataTable
          rowHeight={24}
          rowsCount={report.length}
          headerHeight={30}>
          <Column
            header={<Cell>Stand nr.</Cell>}
            cell={({rowIndex, ...props}) => (
              <Cell {...props}>{getOrderValue(report, rowIndex, 0, 'placementPreference')}</Cell>
            )}
            width={80}
            />
          <Column
            header={<Cell>Sector</Cell>}
            fixed
            cell={({rowIndex, ...props}) => (
              <Cell {...props}>{getValue(report, rowIndex, 'sector')}</Cell>
            )}
            width={150}
          />
          <Column
            header={<Cell>Exposant</Cell>}
            fixed
            cell={({rowIndex, ...props}) => (
              <Cell {...props}>{getValue(report, rowIndex, 'exhibitorName')}</Cell>
            )}
            width={200}
            />
        </ResponsiveFixedDataTable>
      </div>
    </div>
  )
}

export default TurnOver
