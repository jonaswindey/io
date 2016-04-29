/*global $*/
import React from 'react'
import * as storage from 'persistence/storage'
import {FormControl, FormGroup} from 'react-bootstrap'

class ThemeSwitcher extends React.Component {
  render() {
    return (
      <FormGroup bsSize= "sm">
        <FormControl
          style={{width: 120, marginTop: 7, fontSize: 11, marginLeft: 'auto', marginRight: 'auto'}}
          multiple={false}
          componentClass="select"
          onChange={(e) => {
            const theme = e.currentTarget.value
            storage.put('theme', theme)
            $('head link#theme').attr('href','//maxcdn.bootstrapcdn.com/bootswatch/3.3.5/'
            +theme+'/bootstrap.min.css')
            this.setState({themeChanged: true})
          }}
          value={storage.get('theme') || ''}
          >

          {['cerulean', 'cosmo', 'cyborg', 'darkly', 'flatly', 'lumen', 'paper',
            'readable', 'sandstone', 'simplex', 'slate', 'spacelab', 'superhero', 'united', 'yeti']
            .map(theme => {
              return (<option key={theme} value={theme}>{theme}</option>)
            })}
          </FormControl>
        </FormGroup>
      )

  }
}

export default ThemeSwitcher
