export default function(object) {
  const locale = localStorage.getItem('locale')
  let value = ''
  if (object && object.translations)
    object.translations.forEach(translation => {
      if (translation.key === locale)
        value = translation.value
    })

  if (value === '') value = `No translation for locale ${locale}`
  return value
}
