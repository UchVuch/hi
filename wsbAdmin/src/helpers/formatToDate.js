export default function (value) {
  if (value) {
    return new Date(value * 1000).toLocaleDateString('en-EN')
  } else {
    return ''
  }
}
