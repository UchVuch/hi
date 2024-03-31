export default function (date) {
  if (date) {
    return Math.floor(Date.parse(date) / 1000)
  } else {
    return ''
  }
}
