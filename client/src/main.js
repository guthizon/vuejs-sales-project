// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import '@fortawesome/fontawesome-free/css/all.css';
import router from './router';
import Vuetify from 'vuetify';
import { sync } from 'vuex-router-sync';
import 'vuetify/dist/vuetify.min.css';
import store from '@/store/store';
import Panel from '@/components/globals/Panel';
import { VueMaskDirective } from 'v-mask';
import 'text-mask-addons/dist/createNumberMask';
import Print from 'vue-print-nb';

Vue.directive('mask', VueMaskDirective);
Vue.config.productionTip = false;

const opts = { icons: { iconfont: 'fa' } };
Vue.use(Print);
Vue.use(Vuetify);
Vue.component('panel', Panel);

sync(store, router);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  vuetify: new Vuetify(opts),
  components: { App },
  template: '<App/>',
  data() {
    return {
      drawer: false,
      exibirBarraTopo: true,
      exibirNavBar: true,
      userLogado: false,
      exibirFooter: false
    };
  }
});
