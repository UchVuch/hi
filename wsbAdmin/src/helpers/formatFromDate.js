export default function (date) {
  if (date) {
    return Math.floor(
      new Date(date.split('.').reverse().join('-')).getTime() / 1000,
    )
  } else {
    return null
  }
}
