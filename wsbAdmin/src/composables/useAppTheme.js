import { onMounted } from 'vue'
import { useTheme } from 'vuetify'

export function useAppTheme() {

  onMounted(() => {
    const userAppTheme = localStorage.getItem('appTheme')
    if (userAppTheme) {
      appTheme.global.name.value = userAppTheme
    }
  })

  const appTheme = useTheme()
  function toggleAppTheme () {
    console.log('toggleAppTheme', appTheme.global.current.value.dark)
    appTheme.global.name.value = appTheme.global.current.value.dark
      ? 'light'
      : 'dark'
    localStorage.setItem('appTheme', appTheme.global.name.value)
  }

  return { appTheme, toggleAppTheme }
}