import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

const app = createApp(App)
  .use(store)
  .use(router)

// Базовые компоненты: делаем глобальными компоненты, начинающиеся на App...
const requireComponent = require.context("@/components", true, /App[A-Z]\w+\.(vue|js)$/)
requireComponent.keys().forEach(function (fileName) {
  let baseComponentConfig = requireComponent(fileName)
  baseComponentConfig = baseComponentConfig.default || baseComponentConfig
  const baseComponentName = baseComponentConfig.name || (
    fileName
      .replace(/^.+\//, '')
      .replace(/\.\w+$/, '')
  )
  app.component(baseComponentName, baseComponentConfig)
})

app.mount('#app')
