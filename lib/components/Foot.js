import React, {Component} from 'react'
import ThemeSwitcher from 'components/shared/ThemeSwitcher'

const year = new Date().getFullYear()

class Top extends Component {
  render() {
    return (
      <div style={{textAlign: 'center', padding: 20}}>
        <hr />
        <ThemeSwitcher />
        Copyright &copy; {year} - 3NIT
      </div>
    )
  }
}


export default Top
