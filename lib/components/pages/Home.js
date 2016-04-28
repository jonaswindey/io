import React from 'react'
import ImageGallery from 'react-image-gallery'

import home1 from '../../../assets/images/home1.jpg'
import home2 from '../../../assets/images/home2.jpg'
import home3 from '../../../assets/images/home3.jpg'
import home4 from '../../../assets/images/home4.jpg'
import home5 from '../../../assets/images/home5.jpg'

const images = [home1, home2, home3, home4, home5].map(item => {
  return {original: item}
})

export default class Home extends React.Component {
  render () {
    return (
      <div className="wrap">
        <div className="container">
          <div className="row">
            <div className="col-md-10 col-md-offset-1">
              <ImageGallery
                ref="imageGallery"
                showThumbnails={false}
                items={images}
                autoPlay
                slideInterval={4000}/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
