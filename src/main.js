import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/system/engine/router.js'
import ElementPlus from 'element-plus'
import i18n from '@/system/language/index.js'
import Global from '@/system/store/global.js'
import PermmissionVue from '@/system/engine/permissionVue.js'
import BootstrapVue3 from 'bootstrap-vue-3'
import BootstrapVue3Wrappers from 'bootstrap-vue-3-wrappers'
import VueHtmlToPaper from '@/system/library/VueHtmlToPaper/VueHtmlToPaper.js'
import CountTo from 'vue3-count-to';
import VueApexCharts from "vue3-apexcharts";
import VueViewer from 'v-viewer'

import 'element-plus/dist/index.css'
import 'nprogress/nprogress.css'
import '@/assets/fonts/font-awesome/style.css'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import '@/system/engine/permission'
import '@/assets/css/main.css'
import '@/assets/css/header.css'
import '@/assets/css/sidebar.css'
import '@/assets/css/dashboard.css'
import '@/assets/css/login.css'
import '@/assets/css/gallery.css'
import '@/assets/css/preloader.css'
import '@/assets/css/order.css'
import '@/assets/css/animation.css'
import '@/assets/css/custom.css'
import '@/assets/css/menu.css'
import '@/assets/css/template.css'
import '@/assets/css/responsive.css'
import '@/assets/css/util.css'
import '@/assets/css/status.css'
import '@/assets/css/stream.css'
import '@/assets/css/chat.css'
import '@/assets/css/info.css'
import 'viewerjs/dist/viewer.css'

const app = createApp(App)

app.use(router)
app.use(i18n)
app.use(ElementPlus)
app.use(Global)
app.use(PermmissionVue)
app.use(BootstrapVue3)
app.use(BootstrapVue3Wrappers)
app.use(VueHtmlToPaper)
app.use(CountTo)
app.use(VueApexCharts)
app.use(VueViewer)

app.mount('#app')
