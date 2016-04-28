import React, {Component, PropTypes} from 'react'
import {constants} from 'config/constants'
import ImageLoader from 'react-imageloader'

class Avatar extends Component {
  static propTypes = {
    userId: PropTypes.string,
  };

  render() {
    return (
      <ImageLoader
      src={
        constants.API +
        '/files/filemaker/' +
        encodeURIComponent('/users/' +
        this.props.userId)}
        wrapper={React.DOM.div}
        imgProps={{alt: 'Avatar', className: 'img-circle'}}>
        <img src="http://www.3nit.com/garment/garment_icon.png" className="img-circle" />
      </ImageLoader>
    )
  }
}

export default Avatar
