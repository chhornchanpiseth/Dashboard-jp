<template>
  <div>
    <v-menu 
      offset-y
    >
        <template v-slot:activator="{on,attrs}">
          <v-btn text
            color="blue"
            v-on='on'
            v-bind="attrs">
            <v-icon left>
              mdi-translate
            </v-icon>
            <span>{{language}}</span>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(lang,i) in langs" :key='i'
            @click="changeLocale(lang)"
            >
            <v-list-item-title> 
              {{ lang.title }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
    </v-menu>
  </div>
</template>

<script>
import i18n from "@/i18n"

export default {
  data: () => ({
    langs: [
      {title: "English", value:'en'},
      {title: "日本語", value: 'jp'} 
      ],
    language: (i18n.locale === "jp") ? "日本語"  : "English",
  }),
  methods: {
    changeLocale(lang) {
      // check if the selected language is already the locale
      if (i18n.locale !== lang.value) {
        i18n.locale = lang.value
        this.language = lang.title
        this.$router.push({
          params: { lang: lang.value}
        })
        location.reload()
      }
    }
  }

}
</script>

<style>

</style>