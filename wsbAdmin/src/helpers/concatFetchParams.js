export default function concatFetchParams(params) {
  let paramsStr = ''
  const concatParams = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
  paramsStr = concatParams ? '?' + concatParams : ''
  return paramsStr
}
