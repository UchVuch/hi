const BASE_URL = import.meta.env.VITE_BASE_URL

export async function getTenders(start, length) {
  const res = await fetch(`${BASE_URL}/api/tenders?start=${start}&length=${length}`)
  if( res.status >=400 ){
    return false
  }
  const data = await res.json()
  return data
}

export async function putTender(tender, id) {
  const res = await fetch(`${BASE_URL}/api/tenders?${id}`, {
    method: 'PUT',
    body: JSON.stringify(tender),
    headers: {
      "Content-Type": "application/json"
    }
  })
}

export async function postTender(tender) {
  const res = await fetch(`${BASE_URL}/api/tenders`, {
    method: 'POST',
    body: JSON.stringify(tender),
    headers: {
      "Content-Type": "application/json"
    }
  })
}

export async function setSettingsTable(settings) {
  const res = await fetch(`${BASE_URL}/api/tenders/table_settings`, {
    method: 'POST',
    body: JSON.stringify(settings),
    headers: {
      "Content-Type": "application/json"
    }
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
    headers: {
      "Content-Type": "application/json"
    }
  }).catch((error) => ("Something went wrong!", error))

  if( res.status >= 400 ) {
    return false
  }

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

// моковый запрос тендеров
// export async function getTenders(start, length) {
//   const res = await fetch(`${BASE_URL}/api/tenders?start=${start}&length=${length}`)
//   return {records_total: 10, records_filtered: 20, data: [
//     {
//         id: 1,
//         stage: 2,
//         contract:{
//           seller_name: 'name1',
//           customer_name: 'name2',
//           procuring:{
//           contract:{amount:null,date:1674651234},
//           guarantee:{amount:3452.43,date:null},
//           },
//           equipment:[
//           {
//           name:"equip0",
//           count:2,
//           price:3555.33,
//           variation:"variation3",
//           },
//           {
//           name:"equip1",
//           count:22,
//           price:345.33,
//           variation:"variation1",
//           }
//         ],
//           number:431,
//           date:1684454400,
//           terms:{
//           date:1684454400,
//           note:"text",
//           },
//           addresses: ["Адерс 1"],
//           contacts: ["Контакт 1"],
//         },
//         shipment:{
//           date:1684516379,
//           equipment:[
//           {
//           name:"equip00",
//           count:2,
//           price:3555.33,
//           variation:"variation3",
//           },
//           {
//           name:"equip11",
//           count:22,
//           price:345.33,
//           variation:"variation1",
//           }
//         ],
//         },
//         inspection:{
//           penalties:123.32,
//           payment:456.33,
//           approved:true,
//         }
//       },
//       {
//         id: 2,
//         stage: 1,
//         contract:{
//           seller_name:"",
//           customer_name:"name4",
//           procuring:{
//           contract:{amount:3452.43,date:1684514371},
//           guarantee:{amount:3452.43,date:1684514371},
//           },
//           equipment:[
//           {
//           name:"equip2",
//           count:2,
//           price:3555.33,
//           variation:"variation3",
//           },
//           {
//           name:"equip3",
//           count:22,
//           price:345.33,
//           variation:"variation1",
//           }],
//           number:431,
//           date:1684514371,
//           terms:{
//           date: null,
//           note:"Ещё не назначена",
//           },
//           addresses: ["Адрес 2"],
//           contacts: ["Контакт 2"],
//         },
//         shipment:{
//           date:1684516379,
//           equipment:[
//           {
//           name:"equip03",
//           count:2,
//           price:3555.33,
//           variation:"variation3",
//           },
//           {
//           name:"equip13",
//           count:22,
//           price:345.33,
//           variation:"variation1",
//           }],
//         },
//         inspection: null
//       },
//     ],}
// }