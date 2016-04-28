import React from 'react'
import ResponsiveFixedDataTable from 'responsive-fixed-data-table'
import {Column, Cell} from 'fixed-data-table'
import {getValue, getProductValue} from 'utils/reporthelper'
import ProductThumbnail from 'components/products/ProductThumbnail'

const TurnOver = props => {
  const {report, products} = props
  return (
    <div className="row">
      <div className="col-sm-12" style={{height: 600, fontSize: 11}}>
        <ResponsiveFixedDataTable
          rowHeight={24}
          rowsCount={report.length}
          headerHeight={110}>
          <Column
            header={<Cell>Exposant</Cell>}
            fixed
            cell={({rowIndex, ...props}) => (
              <Cell {...props}>{getValue(report, rowIndex, 'exhibitorName')}</Cell>
            )}
            width={200}
            />
          <Column
            header={<Cell>Sector</Cell>}
            fixed
            cell={({rowIndex, ...props}) => (
              <Cell {...props}>{getValue(report, rowIndex, 'sector')}</Cell>
            )}
            width={150}
            />
          {products.map(product => {
            return (
              <Column
                key={product._id}
                header={<Cell>
                <ProductThumbnail product={product} />
                <div style={{paddingTop: 8}}>{product.reference}</div>
                </Cell>}
                cell={({rowIndex, ...props}) => (
                  <Cell {...props}>{getProductValue(report, rowIndex, product._id)}</Cell>
                )}
                width={200}
                />
            )
          })}
        </ResponsiveFixedDataTable>
      </div>
    </div>
  )
}

export default TurnOver
