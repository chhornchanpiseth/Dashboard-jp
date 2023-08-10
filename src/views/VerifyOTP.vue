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
              <div class>{{ $t('signIn.forgotPassword') }}</div>
            </v-card-title>
  
            <v-card-text>
              <v-form ref="verifyOTP" @submit.prevent="verifyOTP">
                <v-text-field
                  :label="$t('signIn.verifyOTP')"
                  prepend-icon="mdi-account"
                  :rules="[
                    (v) => !!v || 'OTP is required',
                  ]"
                  required
                  v-model="$store.state.user.otpcode"
                />
  
                
                <v-btn block outlined class="blue--text mt-4" type="submit">{{ $t( 'submit' )}}</v-btn>
              </v-form>
            </v-card-text>
  
            <v-alert color="red" :value="$store.state.user.error" icon="mdi-close">The email or password is in correct.</v-alert>
  
            <v-card-actions>
              <v-spacer></v-spacer>
            </v-card-actions>
           
        
          </v-card>
        </v-col>
      </v-row>
      <notifications position="bottom right" />
    </v-container>
  </template>
  
  <script>
  import {  verifyOTP } from "../Utilities/backend";
  export default {
    props: {
      source: String,
    },
    methods: {
        async verifyOTP(){
        console.log("submitted");
        if (this.$refs.verifyOTP.validate()) {
            const result = await verifyOTP(this.$store.state.user.username, this.$store.state.user.otpcode , this.$store.state.user.confirmForgetPassword)
            if(result){
                this.$notify({ title: this.$t('notifications.forgetPassword.success.title') ,text: this.$t('notifications.forgetPassword.success.text'), type: "success" })
                this.$router.push({ name: "signin" })

            }else{
                this.$notify({ title: this.$t('notifications.forgetPassword.fail.title') ,text: this.$t('notifications.forgetPassword.fail.text'), type: "error" })
            }
        }
        else{
            alert("Please fill the form correctly!")
        }
    },
    },
   
    created() {},
  };
  </script>
  
  <style></style>
  