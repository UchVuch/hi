const BASE_URL = import.meta.env.VITE_BASE_URL
import concatFetchParams from '@/helpers/concatFetchParams'

export async function customFetch(context, callback, ...callbackParams) {
  try {
    const response = await callback(...callbackParams)
    let getJson = false
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.indexOf('application/json') !== -1)
      getJson = true
    if (response.status === 200) {
      let res = await response.json()
      return getJson && res ? res : true
    }
    if (response.status === 400 || response.status === 500) {
      const { error_text } = getJson ? await response.json() : ''
      context.$modal.show(`Ошибка, статус ${response.status}:`, error_text)
      return false
    }
    context.$modal.show(`Ошибка сервера, статус ${response.status}`, callback)
    return false
  } catch (error) {
    if (context) {
      context.$modal.show('Возникла ошибка:', error)
    } else {
      alert(`Возникла ошибка:\n ${error}`)
    }
  }
}

export async function getEquipVariations(params = {}, id = '') {
  let paramsStr = ''
  if (id === '') {
    const concatParams = Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')
    paramsStr = concatParams ? '?' + concatParams : ''
    const res = await fetch(
      `${import.meta.env.VITE_BASE_URL}/api/equipment_variants${paramsStr}`,
    )
    return res
  }
  if (Object.keys(params).length === 0 && id !== '') {
    const res = await fetch(
      `${import.meta.env.VITE_BASE_URL}/api/equipment_variants/${id}`,
    )
    return res
  }
}

export async function postEquipVariation(tag) {
  const res = await fetch(`${BASE_URL}/api/equipment_variants`, {
    method: 'POST',
    body: JSON.stringify(tag),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return res
}

export async function putEquipVariation(tag, id) {
  const res = await fetch(`${BASE_URL}/api/equipment_variants/${id}`, {
    method: 'PUT',
    body: JSON.stringify(tag),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return res
}

export async function deleteEquipVariation(id) {
  const res = await fetch(
    `${import.meta.env.VITE_BASE_URL}/api/equipment_variants/${id}`,
    {
      method: 'DELETE',
    },
  )
  return res
}

export async function getTags(params = {}) {
  let paramsStr = ''
  if (Object.keys(params).length > 0) {
    const concatParams = Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')
    paramsStr = '?' + concatParams
  }
  const res = await fetch(
    `${import.meta.env.VITE_BASE_URL}/api/tags${paramsStr}`,
  )
  return res
}

export async function postTag(tag) {
  const res = await fetch(`${BASE_URL}/api/tags`, {
    method: 'POST',
    body: JSON.stringify(tag),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return res
}

export async function putTag(tag, id) {
  const res = await fetch(`${BASE_URL}/api/tags/${id}`, {
    method: 'PUT',
    body: JSON.stringify(tag),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return res
}

export async function deleteTag(id) {
  const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/tags/${id}`, {
    method: 'DELETE',
  })
  return res
}

export async function getRoles(id) {
  const roleId = id ? `/${id}` : ''
  const res = await fetch(
    `${import.meta.env.VITE_VUE_APP_SERVER}api/roles${roleId}`,
  )
  return res
}

export async function postRole(role) {
  const res = await fetch(`${BASE_URL}/api/roles`, {
    method: 'POST',
    body: JSON.stringify(role),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return res
}

export async function putRole(role, id) {
  const res = await fetch(`${BASE_URL}/api/roles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(role),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return res
}

export async function deleteRole(id) {
  const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/roles/${id}`, {
    method: 'DELETE',
  })
  return res
}

export async function getFullscreenTotos() {
  const res = await fetch(
    `${BASE_URL}/api/todo?status=0&search=&start=0&length=10`,
  )
  return res
}

export async function getUsers(params = {}) {
  let paramsStr = ''
  const concatParams = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
  paramsStr = concatParams ? '?' + concatParams : ''
  const res = await fetch(
    `${import.meta.env.VITE_BASE_URL}/api/users${paramsStr}`,
  )
  return res
}

export async function getChatMessages(chatId) {
  const res = await fetch(`${BASE_URL}/api/chats/${chatId}`)
  return res
}

export async function postChatMessage(message, chatId) {
  const res = await fetch(`${BASE_URL}/api/chats/${chatId}`, {
    method: 'POST',
    body: JSON.stringify(message),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return res
}

export async function getContracts(params) {
  const paramsStr = concatFetchParams(params)
  //search=${text}&start=${start}&length=${length}&is_active=${isActive}&tags=${tags}
  const res = await fetch(`${BASE_URL}/api/tenders${paramsStr}`)
  return res
}

export async function deleteContract(id) {
  const res = await fetch(`${BASE_URL}/api/tenders/${id}`, {
    method: 'DELETE',
  })
  return res
}

export async function getTenders(
  page,
  status = '',
  text = '',
  start,
  length,
  tenderId = null,
) {
  const res = await fetch(
    `${BASE_URL}/api/${page}?status=${status}&search=${text}&start=${start}&length=${length}&tender_id=${tenderId}`,
  )
  return res
}

export async function getTender(page, id) {
  const res = await fetch(`${BASE_URL}/api/${page}/${id}`)
  return res
}

export async function putTender(page, tender, id) {
  const res = await fetch(`${BASE_URL}/api/${page}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(tender),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return res
}

export async function postTender(page, tender) {
  const res = await fetch(`${BASE_URL}/api/${page}`, {
    method: 'POST',
    body: JSON.stringify(tender),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return res
}

export async function setSettingsTable(page, settings) {
  const res = await fetch(`${BASE_URL}/api/table_settings/${page}`, {
    method: 'POST',
    body: JSON.stringify(settings),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return res
}

export async function getSettingsTable(page) {
  const res = await fetch(`${BASE_URL}/api/table_settings/${page}`)

  return res
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
  const response = await fetch(
    `${import.meta.env.VITE_VUE_APP_SERVER}api/users/${id}`,
  )

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
      'Content-Type': 'application/json',
    },
  }).catch((error) => ('Something went wrong!', error))
  if (res.status >= 400) {
    return false
  }

  localStorage.setItem('username', user.username)
  localStorage.setItem('password', user.password)

  return true
}

export async function logout() {
  await fetch(`${BASE_URL}/logout`, {
    method: 'POST',
  }).catch((error) => ('Ошибка', error))
  if (document.cookie)
    document.cookie =
      'name=user;expires=' + new Date(Date.now() + 86400 * 1000).toUTCString()
  localStorage.clear()
}
