import Vue from "vue";
import VueRouter from "vue-router";
import CurrentlyIn from "../views/CurrentlyIn.vue";
import PlateLogs from "../views/PlateLogs.vue";
import Management from "../views/Management.vue";
import Login from "../views/Login.vue";
import NotFound from "../views/NotFound.vue";
import i18n from '@/i18n.js'
// import Monitoring from "../views/Monitoring.vue"
Vue.use(VueRouter);

  const routes = [
    {
      path: '/',
      redirect: `/${i18n.locale}`
    },
    {
      path: '/:lang',
      component: {
        render(c) {return c('router-view')}
      },
      children: [
        {
          path: "signin",
          name: "signin",
          component: Login,
        },
        // {
        //   path: "/",
        //   name: "monitoring",
        //   component: Monitoring,
        // },
        {
          path: "currently_in",
          name: "currentlyin",
          component: CurrentlyIn,
        },
        {
          path: "/",
          name: "platelogs",
          component: PlateLogs,
        },
        {
          path: "manage" ,
          name: "manage",
          component: Management,
        },
        {
          path: "/*",
          name : "notfound",
          component : NotFound
        }
      ]
    }
  ];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});


export default router;
