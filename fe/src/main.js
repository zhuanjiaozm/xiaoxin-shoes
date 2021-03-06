import Vue from 'vue';
// import ElementUI from 'element-ui';
import {
  TabPane,
  Tabs,
  MessageBox,
  Message,
  MenuItem,
  Menu,
  Submenu,
  Button,
  Card,
  Progress,
  ButtonGroup
} from 'element-ui';
import App from './App.vue';
import router from './router';
import store from './store';
import 'element-ui/lib/theme-chalk/index.css';

import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'

Vue.use(VXETable);


// Vue.use(ElementUI);
Vue.config.productionTip = false;
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(MenuItem);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(Button);
Vue.use(Card);
Vue.use(Progress);
Vue.use(ButtonGroup);
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$message = Message;

import api from '@/api/api.js'

Vue.prototype.$api = api
Vue.prototype.$VXETable = VXETable


new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
