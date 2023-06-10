const BASE_URL = import.meta.env.VITE_BASE_URL

export async function getTenders(start, length) {
  const res = await fetch(`${BASE_URL}/api/tenders?start=${start}&length=${length}`)
  if( res.status >=400 ){
    return false
  }
  const data = await res.json()
  // внутри data ожидаю поле с общим количеством тендеров totalTenders и поле data с объектом тендеров 
  return {records_total: 20, records_filtered: 20, data: []}
}

export async function putTender(tender, id) {
  const res = await fetch(`${BASE_URL}/api/tenders?${id}`, {
    method: 'PUT',
    body: JSON.stringify(tender),
  })
}

export async function postTender(tender) {
  const res = await fetch(`${BASE_URL}/api/tenders`, {
    method: 'POST',
    body: JSON.stringify(tender),
  })
}

export async function setSettingsTable(settings) {
  const res = await fetch(`${BASE_URL}/api/tenders/table_settings`, {
    method: 'POST',
    body: JSON.stringify(settings),
  })
}

export async function getSettingsTable() {
  const res = await fetch(`${BASE_URL}/api/tenders/table_settings`)
  if( res.status >=400 ){
    return false
  }
  const data = await res.json()
  // ожидаю внутри поле data с массивом
  return data.data
}

export async function login(user) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    body:JSON.stringify(user),
  }).catch((error) => ("Something went wrong!", error))

  // if( res.status >= 400 ) {
  //   return false
  // }

  localStorage.setItem('username', user.username)
  localStorage.setItem('password', user.password)

  return true
}

export async function logout() {
  const res = await fetch(`${BASE_URL}/logout`, {
    method: 'POST'
  }).catch((error) => ("Ошибка", error));
  localStorage.clear()
}

// export async function getme() {
// }