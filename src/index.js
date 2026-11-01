import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import { createPinia } from 'pinia'
import dayjs from 'dayjs'
import App from './App.vue';
import router from './router';
import directives from './directives';
import './index.css';
import 'ant-design-vue/dist/reset.css';
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')

createApp(App)
    .use(createPinia())
    .use(Antd)
    .use(router)
    .use(directives)
    .mount('#root');
