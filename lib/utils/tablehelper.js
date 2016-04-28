import React from 'react'
import {Cell} from 'fixed-data-table'

export const SortTypes = {
  ASC: 'ASC',
  DESC: 'DESC',
}

export function reverseSortDirection(sortDir) {
  return sortDir === SortTypes.DESC ? SortTypes.ASC : SortTypes.DESC
}

export function sortIndexes(dataList, indexes, columnKey, sortDir) {
  indexes.sort((indexA, indexB) => {
    let valueA, valueB
    if (columnKey.lastIndexOf('.') > -1) {
      valueA = dataList[indexA][columnKey.split('.')[0]][columnKey.split('.')[1]]
      valueB = dataList[indexB][columnKey.split('.')[0]][columnKey.split('.')[1]]
    } else {
      valueA = dataList[indexA][columnKey]
      valueB = dataList[indexB][columnKey]
    }

    let sortVal = 0

    if (!valueA || !valueB) return sortVal

    if (valueA.toString().toLowerCase() > valueB.toString().toLowerCase())
      sortVal = 1
    if (valueA.toString().toLowerCase() < valueB.toString().toLowerCase())
      sortVal = -1
    if (sortVal !== 0 && sortDir === SortTypes.ASC)
      sortVal = sortVal * -1

    return sortVal
  })
}

export class DataListWrapper {
  constructor(indexMap, data) {
    this._indexMap = indexMap
    this._data = data
  }

  getSize() {
    return this._indexMap.length
  }

  getObjectAt(index) {
    try {
      const _index = this._indexMap[index]
      return this._data[_index]
    }
    catch (e) {}
  }
}

export const TextCell = ({rowIndex, data, columnKey, prefix, suffix, ...props}) => {
  let value = ''
  const row = data.getObjectAt(rowIndex)

  if (row) {
    if (columnKey.indexOf('.') > -1) {
      const key = columnKey.split('.')[0]
      const subKey = columnKey.split('.')[1]
      if (row[key] && row[key][subKey]) value = row[key][subKey]
    }
    else
    value = row[columnKey]

    if (prefix && prefix.length > 0) value = prefix + value
    if (suffix && suffix.length > 0) value = value + suffix
  }

  return (
    <Cell {...props}>{value}</Cell>
  )
}

export const CheckboxCell = ({rowIndex, data, ...props}) => (
  <Cell {...props}>
    <input type="checkbox" style={{marginLeft: 12}} readOnly checked={data.getObjectAt(rowIndex).checked} />
  </Cell>
)

export class SortHeaderCell extends React.Component {
  constructor(props) {
    super(props)
    this.sortChange = this.sortChange.bind(this)
  }

  render() {
    const {sortDir, children, ...props} = this.props
    return (
      <Cell {...props}>
        <a onClick={this.sortChange}>
          {children} {sortDir ? (sortDir === SortTypes.DESC ? '↓' : '↑') : ''}
        </a>
      </Cell>
    )
  }

  sortChange(e) {
    e.preventDefault()

    if (this.props.onSortChange)
      this.props.onSortChange(
        this.props.columnKey,
        this.props.sortDir ?
          reverseSortDirection(this.props.sortDir) :
          SortTypes.DESC
      )
  }
}
