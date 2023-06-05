export default function (value) {
  if (value) {
    return new Date(value*1000).toLocaleDateString('ru-RU')
  } else {
    return ''
  }
}