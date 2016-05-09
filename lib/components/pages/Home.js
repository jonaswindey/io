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
    let rightStyle = {paddingLeft: 20}
    if (!this.state.affixed) {
      leftClassName = 'col-sm-5 col-sm-push-7'
      rightClassName = 'col-sm-7 col-sm-pull-5'
    } else {
      leftClassName = 'col-sm-5'
      rightClassName = 'col-sm-7'
      if (window.innerWidth <= 767)
        rightStyle.marginTop = 64
    }

    return (
      <div className="wrap">
        <div className="container">
          <div className="paper paper-curve-horiz request">
            <div className="row">
              <AutoAffix viewportOffsetTop={40} offsetTop={0} container={this}
                onAffix={ () => this.setState({ affixed: true }) }
                    onAffixTop={ () => this.setState({ affixed: false }) }
                affixClassName="affixed">
                <div className={leftClassName} >
                  <FileAdder />
                </div>
              </AutoAffix>
            <div style={rightStyle} className={rightClassName}>
              <SearchableFileTable
                {...this.props}
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
