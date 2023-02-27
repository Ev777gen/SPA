import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
// Importing Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

// Importing FontAwesome plugin
import FontAwesome from "@/plugins/FontAwesome";

// Initializing Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDrneVPNzmr8y5EraatCBjTIM4UIf563xs",
  authDomain: "spa-blog-c7ad9.firebaseapp.com",
  projectId: "spa-blog-c7ad9",
  storageBucket: "spa-blog-c7ad9.appspot.com",
  messagingSenderId: "965165354166",
  appId: "1:965165354166:web:8683642d1540a64df6ea17"
}
const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);

// Creating Vue app
const app = createApp(App)
  .use(store)
  .use(router)
  .use(FontAwesome)

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
});

app.mount('#app');
