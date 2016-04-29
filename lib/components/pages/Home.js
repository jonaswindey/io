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

  state = {
    affixed: false
  }

  componentDidMount() {
    this.props.dispatch(fileActions.fetchFiles())
  }

  render () {
    let leftClassName, rightClassName
    if (!this.state.affixed) {
      leftClassName = 'col-md-6 col-md-push-6'
      rightClassName = 'col-md-6 col-md-pull-6'
    } else {
      leftClassName = 'col-md-6'
      rightClassName = 'col-md-6'
    }

    return (
      <div className="wrap">
        <div className="container">
          <div className="paper paper-curve-horiz request">
            <div className="row">
              <AutoAffix viewportOffsetTop={0} container={this}
                onAffix={ () => this.setState({ affixed: true }) }
                    onAffixTop={ () => this.setState({ affixed: false }) }
                affixClassName="affixed">
                <div className={leftClassName} >
                  <FileAdder />
                </div>
              </AutoAffix>
            <div style={{paddingLeft: 20}} className={rightClassName}>
              <SearchableFileTable
                files={this.props.files.files}
                filesLoaded={this.props.files.filesLoaded}/>
            </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
