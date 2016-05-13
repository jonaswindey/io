import React, {Component} from 'react'

const year = new Date().getFullYear()

class Top extends Component {
  render() {
    return (
      <div style={{textAlign: 'center', padding: 20}}>
        <hr />
        Copyright &copy; {year} - 3NIT
      </div>
    )
  }
}


export default Top
