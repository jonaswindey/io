import React from 'react'
import SearchableFileTable from 'components/io/SearchableFileTable'
import FileAdder from 'components/io/FileAdder'
import {connect} from 'react-redux'
import * as fileActions from 'actions/files'
import {AutoAffix} from 'react-overlays'

@connect(state => ({
  files: state.files,
}))
export default class Home extends React.Component {

  componentDidMount() {
    this.props.dispatch(fileActions.fetchFiles())
  }

  render () {
    return (
      <div className="wrap">
        <div className="container">
          <div className="paper paper-curve-horiz request">
            <div className="row">
            <div style={{width: 620, float: 'left', paddingLeft: 20}}>
              <SearchableFileTable
                files={this.props.files.files}
                filesLoaded={this.props.files.filesLoaded}/>
            </div>
            <div style={{width: 420, float: 'left', marginLeft:  50}}>
              <FileAdder />
            </div>
            {this.props.children &&
              <AutoAffix viewportOffsetTop={40} container={this} affixStyle={{marginLeft: 450, width: 450}}>
              <div style={{paddingTop: 20}} style={{width: 450, float: 'left', paddingLeft: 40, paddingTop: 20}} >
                  {this.props.children}
              </div>
            </AutoAffix>
            }
            </div>
          </div>
        </div>
      </div>
    )
  }
}
