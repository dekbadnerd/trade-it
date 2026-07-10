import { ref, watch } from 'vue'

const sidebarStorageKey = 'kawai888.sidebar.expanded'
const storedValue =
  typeof window !== 'undefined' ? window.localStorage.getItem(sidebarStorageKey) : null

const sidebarExpanded = ref(storedValue === null ? true : storedValue === 'true')

if (typeof window !== 'undefined') {
  watch(
    sidebarExpanded,
    (value) => {
      window.localStorage.setItem(sidebarStorageKey, String(value))
    },
    { immediate: true },
  )
}

function toggleSidebar() {
  sidebarExpanded.value = !sidebarExpanded.value
}

function setSidebarExpanded(value) {
  sidebarExpanded.value = Boolean(value)
}

export function useLayoutStore() {
  return {
    sidebarExpanded,
    toggleSidebar,
    setSidebarExpanded,
  }
}
