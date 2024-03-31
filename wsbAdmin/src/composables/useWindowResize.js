import { onMounted, onUnmounted, ref, watch } from 'vue'
import { debounce } from '@/helpers/debounce'

export function useWindowResize() {
  const width = ref(window.innerWidth)
  const height = ref(window.innerHeight)
  const handleResize = () => {
    width.value = window.innerWidth
    height.value = window.innerHeight
  }
  const debouncedHandleResize = debounce(handleResize, 500)

  const device = ref('desktop')
  watch(
    () => width.value,
    () => {
      if (width.value < 768) {
        device.value = 'mobile'
      } else {
        device.value = 'desktop'
      }
    }
  )

  onMounted(() => window.addEventListener('resize', debouncedHandleResize))
  onUnmounted(()=> window.removeEventListener('resize', debouncedHandleResize))

  return { device }
}