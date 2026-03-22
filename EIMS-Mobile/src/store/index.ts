import { createPinia } from 'pinia'
import { useUserStore } from './modules/user'
import { useMessageStore } from './modules/message'
import { useApplicationStore } from './modules/application'
import { usePlatformStore } from './modules/platform'
import { useSystemStore } from './modules/system'

const pinia = createPinia()

export {
  pinia,
  useUserStore,
  useMessageStore,
  useApplicationStore,
  usePlatformStore,
  useSystemStore
}