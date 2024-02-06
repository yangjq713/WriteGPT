import { createApp } from "vue";
import "./style.css";
import router from "./router";
import App from "./App.vue";
import { createPinia } from "pinia";
import i18n from './lang';


const pinia = createPinia();
const app = createApp(App);
app.use(pinia);
app.use(router);
app.use(i18n);
app.mount("#app");
