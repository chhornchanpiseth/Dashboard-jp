<template>
  <v-container class="fill-height">
    <v-row class="mt-12">
      <v-col>
        <div class="text-center">
          <span class="green--text display-4">LP</span>
          <span class="blue--text display-4">RS</span>
        </div>
      </v-col>
    </v-row>

    <v-row justify="center" class="mb-12">
      <v-col cols="10" sm="6" md="5">
        <v-card flat>
          <v-card-title class="headline blue--text">
            <div class>{{ $t('signIn.signIn') }}</div>
          </v-card-title>

          <v-card-text>
            <v-form ref="login" @submit.prevent="signIn">
              <v-text-field
                :label="$t('signIn.username')"
                prepend-icon="mdi-account"
                :rules="[
                  (v) => !!v || 'Username is required',
                ]"
                required
                v-model="$store.state.user.username"
              />

              <v-text-field
                :label="$t('signIn.password')"
                type="password"
                prepend-icon="mdi-lock"
                :rules="[(v) => !!v || 'Password is required']"
                required
                v-model="$store.state.user.password"
              />
              <v-btn block outlined class="blue--text mt-4" type="submit">{{ $t( 'signIn.logIn' )}}</v-btn>
            </v-form>
          </v-card-text>

          <v-alert color="red" :value="$store.state.user.error" icon="mdi-close">The email or password is in correct.</v-alert>

          <v-card-actions>
            <v-spacer></v-spacer>
          </v-card-actions>
          <div class="caption font-weight-light text-center mt-8 px-10">
            <!-- <span class="blue--text">{{ $t('signIn.forgotPassword' )}}?</span> -->
            <router-link :to="`/${$i18n.locale}/forgotpassword`" class="blue--text"> {{ $t('signIn.forgotPassword' )}}?</router-link>
            Copyright © 2020 by Optimus of Kirirom Institute of Technology
          </div>
          <div class="text-center">
            <v-btn text small class>
              <span class="text-lowercase"> {{ $t('signIn.help') }} </span>
              <v-icon>mdi-help-circle-outline</v-icon>
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <notifications position="bottom right" />
  </v-container>
</template>

<script>
import { signin } from "../Utilities/backend";
export default {
  props: {
    source: String,
  },
  methods: {
    async signIn() {
      console.log("submitted");
      if (this.$refs.login.validate()) {
        const result = await signin(this.$store.state.user)
        if (result){
          this.$notify({ title: this.$t('notifications.signIn.success.title') ,text: this.$t('notifications.signIn.success.text'), type: "success" })
          window.location.replace("/")
        }else{
          this.$notify({ title: this.$t('notifications.signIn.fail.title') ,text: this.$t('notifications.signIn.fail.text'), type: "error" })
        }
      } else {
        alert("Please fill the form correctly!");
      }
    },
  },
  created() {},
};
</script>

<style></style>
