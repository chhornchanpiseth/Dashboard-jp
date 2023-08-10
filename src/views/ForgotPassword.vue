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
              <v-form ref="forgetPassword" @submit.prevent="forgetPassword">
                <v-text-field
                  :label="$t('signIn.email')"
                  prepend-icon="mdi-account"
                  :rules="[
                    (v) => !!v || 'Email is required',
                  ]"
                  required
                  v-model="$store.state.user.username"
                />
  
                <v-text-field
                  :label="$t('signIn.newpassword')"
                  type="password"
                  prepend-icon="mdi-lock"
                  :rules="[(v) => !!v || 'Password is required']"
                  required
                  v-model="$store.state.user.forgetPassword"
                />
                <v-text-field
                  :label="$t('signIn.confirmPassword')"
                  type="password"
                  prepend-icon="mdi-lock"
                  :rules="[confirmPasswordRule]"
                  required
                  v-model="$store.state.user.confirmForgetPassword"
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
  import { forgetPassword } from "../Utilities/backend";
  export default {
    props: {
      source: String,
    },
    computed: {
    confirmPasswordRule() {
      return (v) => {
        if (!v) return "Confirm Password is required";
        if (v !== this.$store.state.user.forgetPassword) return "Passwords do not match";
        return true;
      };
    },
  },
    methods: {
        async forgetPassword(){
        console.log("submitted");
        if (this.$refs.forgetPassword.validate()) {
            const result = await forgetPassword(this.$store.state.user.username)
            if(result){
                this.$notify({ title: this.$t('notifications.forgetPassword.success.title') ,text: this.$t('notifications.forgetPassword.success.text'), type: "success" })
                this.$router.push({ name: "verifyOTP" });
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
  