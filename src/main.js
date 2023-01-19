import { createApp } from 'vue'
import App from './App.vue'
import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:3000"
});

const app =  createApp(App);
app.config.globalProperties.$axios = axiosInstance;
app.config.globalProperties.mode = 'production';

app.mount('#app');
