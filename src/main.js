import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueSocketIO from 'vue-socket.io'
import router from './router'
import store from './store'
import i18n from './i18n'
import Notifications from 'vue-notification'
import JsonExcel from "vue-json-excel"
// import Vuetify from 'vuetify/lib';



Vue.use(Notifications)

Vue.component("downloadExcel", JsonExcel);

Vue.use(new VueSocketIO({
  debug: true,
  connection: 'http://192.168.7.30:3000',
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_'
  },
}))


// use beforeEach route guard to set the language
router.beforeEach((to, from, next) => {

  // use the language from the routing param or default language
  let language = to.params.lang;
  if (!language) {
    language = 'kh'
  }
  // set the current language for i18n.
   i18n.locale = language // set default locale
  next()

})

// creating a instance of vue localisation module
// const i18n = new VueI18n({
// 	locale: store.getters.selectedLocale.locale,
// 	messages,
// })


// Vue.use(Vuetify)
Vue.config.productionTip = false
new Vue({

  vuetify,
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')

