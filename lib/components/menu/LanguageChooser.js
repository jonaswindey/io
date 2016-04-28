import React from 'react'
import * as storage from 'persistence/storage'

const LanguageChooser = props => {

  const languages = []
  languages.push({key: 'en', label: 'EN', flag: 'usa'})

  const activeStyle = {fontWeight: 'bold'}
  return (
    <div style={{float: 'left', paddingTop: 16, paddingLeft: 20}}>
      {languages.map(language => {
        return (
          <div key={language.key} style={{float: 'left', paddingRight: 10, cursor: 'pointer'}}
            onClick={() => props.languageChange(language.key)}>
            <span style={storage.get('locale') === language.key ? activeStyle : {}}>{language.label}</span>
            <img style={{marginLeft: 5, width: 22, height: 22}}
              src={'https://s3.amazonaws.com/3nit-cdn/assets/flags/'+language.flag+'.svg'} />
          </div>
        )
      })}
    </div>
  )
}

export default LanguageChooser
