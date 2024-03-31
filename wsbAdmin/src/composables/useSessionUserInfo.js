import { ref } from 'vue'

export function useSessionUserInfo() {
  const isAuth = ref(true)
  const userId = ref(null)
  const access = ref({
    users: 1,
    keys: 1,
    tenders: 1,
    files: 1,
    purchases: 1,
    support: 1,
    todo: 1,
    admin: 1,
  })
  const setAuthAccess = (access, userId) => {
    isAuth.value = true
    userId.value = userId
    access.value = access
  }

  const userName = ref('')
  const setUserName = (name) => {
    userName.value = name
  }
  
  return { isAuth, userId, access, setAuthAccess, userName, setUserName }
}