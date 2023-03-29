import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.vue';
import { VAceEditor } from 'vue3-ace-editor';
const app = createApp(App);
app.use(ElementPlus);
app.use(VAceEditor);
app.mount('#app');
