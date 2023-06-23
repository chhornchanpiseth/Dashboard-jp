<template>
  <v-container>
    
    <!-- navigation-drawer -->
    <v-navigation-drawer 
      width="auto"
      v-model="drawer" 
      app 
      v-if="$route.name !== 'login'">
      
      <div class="text-center">
        <span class="green--text display-2">LP</span>
        <span class="blue--text display-2">RS</span>
      </div>
      <v-divider></v-divider>
      <v-list>
        <v-list-item 
          v-for="item in items" 
          :key="item.url" 
          exact
          link 
          :to="`/${$i18n.locale}${item.url}`" >
          <v-list-item-icon>
            <v-icon color="blue">{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="subtitle text-uppercase">{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>


    <v-app-bar app flat>
      <v-app-bar-nav-icon @click='drawer=!drawer'></v-app-bar-nav-icon>
      <v-spacer></v-spacer>

      <LocaleSwitcher/>
      <v-toolbar-items>
        <v-btn text color="red" @click="signOut">
          {{ $t('sign_out')}}
          <v-icon right>mdi-location-exit</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
  </v-container>
</template>

<script>
import {
  mdiCityVariantOutline as Dashboard,
  mdiClipboardTextMultipleOutline as Management,
  mdiCarMultiple as PlateLogs,
  mdiMenu as toggle,
  mdiAccount as account
} from "@mdi/js";
import { signout } from "../Utilities/backend";
// import LanguageSwitcher from './Lang/LanguageSwitcher.vue'
import LocaleSwitcher from './Lang/LocaleSwitcher.vue'
import i18n from '@/i18n'

export default {
  name: "App",

  components: {
    LocaleSwitcher
  },
  

  data: ()=>({

    account,
    toggle,
    miniVariant: false,
    drawer: false,
    items: [
      { title: i18n.t('plate_logs'), icon: PlateLogs , url: "/" },
      { title: i18n.t('plate_management'), icon: Management, url: "/manage" },
      { title: i18n.t('currently'), icon: Dashboard, url: "/currently_in" }, 
    ]
  }),

  methods: {
    signOut() {
      signout();
    }
  }
};
</script>

<style>
</style>