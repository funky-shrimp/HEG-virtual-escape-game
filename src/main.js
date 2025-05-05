// main.js
import { createApp, ref } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/main.css"; // Import Tailwind

const app = createApp(App);

// Créez la ref et fournissez-la sous la clé 'latestConsignesUrl'
const latestConsignesUrl = ref("/src/assets/misc/innokask_consignes.pdf");
app.provide("latestConsignesUrl", latestConsignesUrl);

// Montez votre app
app.use(router).mount("#app");
