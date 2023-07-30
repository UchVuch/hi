const BASE_URL = import.meta.env.VITE_BASE_URL

// export async function getTenders(start, length, text='') {
//   const res = await fetch(`${BASE_URL}/api/tenders?search=${text}&start=${start}&length=${length}`)
//   if (res.status >= 400) {
//     return false
//   }
//   const data = await res.json()
//   return data
// }

export async function putTender(tender, id) {
  const res = await fetch(`${BASE_URL}/api/tenders/${id}`, {
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

// export async function getSettingsTable() {
//   const res = await fetch(`${BASE_URL}/api/tenders/table_settings`)
//   if (res.status >= 400) {
//     return false
//   }
//   const data = await res.json()
//   // ожидаю внутри массив
//   return data
// }

export async function getRoles() {
  const response = await fetch(`${import.meta.env.VITE_VUE_APP_SERVER}api/roles`)

  if (response.status === 200) {
    const data = await response.json()
    return data
  }
  if (response.status === 401) {
    return false
  }
  if (response.status === 500) {
    return false
  }
}

export async function getme() {
  const res = await fetch(`${BASE_URL}/me`)
  if (res.status >= 400) {
    return 0
  }
  const data = await res.text()
  // число (пока что приходит строка 'user_id=1')
  return data
}

export async function getUser(id) {
  const response = await fetch(`${import.meta.env.VITE_VUE_APP_SERVER}api/users/${id}`)
  
  if (response.status === 200) {
    const data = await response.json()
    return data
  }
  if (response.status === 401) {
    return false
  }
  if (response.status === 500) {
    return false
  }
}

export async function login(user) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    body: JSON.stringify(user),
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
  }).catch((error) => ("Ошибка", error))
  if (document.cookie) document.cookie = "name=user;expires=" + cookie_date.toUTCString()
  localStorage.clear()
}

// моковый запрос настроек
export async function getSettingsTable() {
  return [
    {
      name: 'contract_seller_name',
      value: 'Имя продавца',
      hidden: true,
      stage: 'contract',
    },
    {
      name: 'contract_customer_name',
      value: 'Имя клиента',
      hidden: false,
      stage: 'contract',
    },
    {
      name: 'contract_procuring',
      value: 'Контракт',
      hidden: false,
      stage: 'contract',
    },
    {
      name: 'contract_equipment',
      value: 'Оборудование в контракте',
      hidden: false,
      stage: 'contract',
    },
    {
      name: 'contract_number',
      value: 'Номер договора',
      hidden: false,
      stage: 'contract',
    },
    {
      name: 'contract_date',
      value: 'Дата контракта',
      hidden: false,
      stage: 'contract',
    },
    {
      name: 'contract_terms',
      value: 'Условия контракта',
      hidden: false,
      stage: 'contract',
    },
    {
      name: 'contract_addresses',
      value: 'Адреса',
      hidden: false,
      stage: 'contract',
    },
    {
      name: 'contract_contacts',
      value: 'Контакты',
      hidden: false,
      stage: 'contract',
    },
    {
      name: 'shipment_date',
      value: 'Дата отгрузки',
      hidden: false,
      stage: 'shipment',
    },
    {
      name: 'shipment_equipment',
      value: 'Отгрузка оборудования',
      hidden: false,
      stage: 'shipment',
    },
    {
      name: 'shipment_tk_media',
      value: 'ТК',
      hidden: true,
      stage: 'shipment',
    },
    {
      name: 'shipment_receipt_media',
      value: 'Квитанция',
      hidden: true,
      stage: 'shipment',
    },
    {
      name: 'shipment_accounting_media',
      value: 'Бухгалтерия',
      hidden: true,
      stage: 'shipment',
    },
    {
      name: 'shipment_equipment_media',
      value: 'Фото оборудования',
      hidden: true,
      stage: 'shipment',
    },
    {
      name: 'inspection_payment',
      value: 'Оплата',
      hidden: false,
      stage: 'inspection',
    },
    {
      name: 'inspection_penalties',
      value: 'Штраф',
      hidden: false,
      stage: 'inspection',
    },
    {
      name: 'inspection_approved',
      value: 'Одобрено',
      hidden: false,
      stage: 'inspection',
    },
    {
      name: 'inspection_getting_signing_documents',
      value: 'Получение/подписание документов',
      hidden: false,
      stage: 'inspection',
    },
    {
      name: 'inspection_documents_media',
      value: 'Фото документов',
      hidden: true,
      stage: 'inspection',
    },
  ]
  // return [
  //   {
  //     name: 'contract.seller_name',
  //     value: 'Имя продавца',
  //     hidden: true,
  //     stage: 'contract',
  //   },
  //   {
  //     name: 'contract.customer_name',
  //     value: 'Имя клиента',
  //     hidden: false,
  //     stage: 'contract',
  //   },
  //   {
  //     name: 'contract.procuring',
  //     value: 'Контракт',
  //     hidden: false,
  //     stage: 'contract',
  //   },
  //   {
  //     name: 'contract.equipment',
  //     value: 'Оборудование в контракте',
  //     hidden: false,
  //     stage: 'contract',
  //   },
  //   {
  //     name: 'contract.number',
  //     value: 'Номер договора',
  //     hidden: false,
  //     stage: 'contract',
  //   },
  //   {
  //     name: 'contract.date',
  //     value: 'Дата контракта',
  //     hidden: false,
  //     stage: 'contract',
  //   },
  //   {
  //     name: 'contract.terms',
  //     value: 'Условия контракта',
  //     hidden: false,
  //     stage: 'contract',
  //   },
  //   {
  //     name: 'contract.addresses',
  //     value: 'Адреса',
  //     hidden: false,
  //     stage: 'contract',
  //   },
  //   {
  //     name: 'contract.contacts',
  //     value: 'Контакты',
  //     hidden: false,
  //     stage: 'contract',
  //   },
  //   {
  //     name: 'shipment.date',
  //     value: 'Дата отгрузки',
  //     hidden: false,
  //     stage: 'shipment',
  //   },
  //   {
  //     name: 'shipment.equipment',
  //     value: 'Отгрузка оборудования',
  //     hidden: false,
  //     stage: 'shipment',
  //   },
  //   {
  //     name: 'shipment.tk_media',
  //     value: 'ТК',
  //     hidden: true,
  //     stage: 'shipment',
  //   },
  //   {
  //     name: 'shipment.receipt_media',
  //     value: 'Квитанция',
  //     hidden: true,
  //     stage: 'shipment',
  //   },
  //   {
  //     name: 'shipment.accounting_media',
  //     value: 'Бухгалтерия',
  //     hidden: true,
  //     stage: 'shipment',
  //   },
  //   {
  //     name: 'shipment.equipment_media',
  //     value: 'Фото оборудования',
  //     hidden: true,
  //     stage: 'shipment',
  //   },
  //   {
  //     name: 'inspection.payment',
  //     value: 'Оплата',
  //     hidden: false,
  //     stage: 'inspection',
  //   },
  //   {
  //     name: 'inspection.penalties',
  //     value: 'Штраф',
  //     hidden: false,
  //     stage: 'inspection',
  //   },
  //   {
  //     name: 'inspection.approved',
  //     value: 'Одобрено',
  //     hidden: false,
  //     stage: 'inspection',
  //   },
  //   {
  //     name: 'inspection.getting_signing_documents',
  //     value: 'Получение/подписание документов',
  //     hidden: false,
  //     stage: 'inspection',
  //   },
  //   {
  //     name: 'inspection.documents_media',
  //     value: 'Фото документов',
  //     hidden: true,
  //     stage: 'inspection',
  //   },
  // ]
}

// моковый запрос тендеров
export async function getTenders(start, length) {
  return {
    records_total: 1, records_filtered: 100, data: [
      {
        id: 1,
        contract: {
          seller_name: 'name1',
          customer_name: 'name2',
          procuring: {
            contract: { amount: 0, date: 1674651234 },
            guarantee: { amount: 3452.43, date: 1674651234 },
          },
          equipment: [
            {
              name: "equip0",
              count: 2,
              price: 3555.33,
              variation: "variation3",
            },
            {
              name: "equip1",
              count: 22,
              price: 345.33,
              variation: "variation1",
            }
          ],
          number: 431,
          date: 1684454400,
          terms: {
            date: 1684454400,
            note: "text",
          },
          addresses: ["Адерс 1"],
          contacts: ["Контакт 1"],
        },
        shipment: null,
        inspection: null,
      },
      {
        id: 2,
        contract: {
          seller_name: 'name3',
          customer_name: 'name4',
          procuring: {
            contract: { amount: 0, date: 1674651234 },
            guarantee: { amount: 3452.43, date: 1674651234 },
          },
          equipment: [
            {
              name: "equip0",
              count: 2,
              price: 3555.33,
              variation: "variation3",
            },
            {
              name: "equip1",
              count: 22,
              price: 345.33,
              variation: "variation1",
            }
          ],
          number: 431,
          date: 1684454400,
          terms: {
            date: 1684454400,
            note: "text",
          },
          addresses: ["Адерс 1"],
          contacts: ["Контакт 1"],
        },
        shipment: {
          date:1684454400,
          equipment: [
            {
              name: "equip3",
              count: 2,
              price: 3555.33,
              variation: "variation3",
            },
            {
              name: "equip4",
              count: 22,
              price: 345.33,
              variation: "variation1",
            }
          ],
          tk_media: [1,2],
          receipt_media: [3],
          accounting_media: [],
          equipment_media: []
        },
        inspection: {
          payment: 200,
          penalties: 30,
          approved: true,
          getting_signing_documents: true,
          documents_media: [2]
        },
      },
    ]
  }
}