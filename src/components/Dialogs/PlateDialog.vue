<template>
  <v-dialog
    max-width="700"
    v-model="dialog"
    persistent
    v-if="data !== undefined"
  >
    <v-card>
      <v-container>
        <v-card-title class="text-uppercase font-weight-light headline">
          <span class="mr-3">{{ title }}</span>
          <v-spacer></v-spacer>
          <v-btn 
            :disabled="loadingSubmit"
            v-if="removable"
            icon 
            color="red" 
            :loading="loadingDelete"
            @click="deletePlate(data.plate_number, type)"
            >
            <v-icon>{{ remove }}</v-icon>
          </v-btn>
        </v-card-title>

        <v-card
          flat>
          <v-card-text>
            <v-form ref="form">
              <v-container>
                <v-row class="ma-n5">
                  <v-col cols="12" md="6" lg="5">
                    <v-text-field
                      class="purple-input"
                      :label="$t('fullname')"
                      v-model="data[fields[0]]"
                      :rules="[(v) => !!v || 'Required']"
                      required
                    />
                  </v-col>

                  <v-col cols="12" md="6" lg="5">
                    <v-text-field
                      class="purple-input"
                      :label="$t('phone')"
                      v-model="data[fields[1]]"
                      :rules="[(v) => !!v || 'Required']"
                      required
                    />
                  </v-col>
                </v-row>
                <v-row class="ma-n5">
                  <v-col cols="12" md="12" lg="4">
                    <v-text-field
                      class="purple-input"
                      :label="$t('role')"
                      v-model="data[fields[2]]"
                      :rules="[(v) => !!v || 'Required']"
                      required
                    />
                  </v-col>
                  <v-col cols="10" md="6" lg="3">
                    <v-autocomplete
                    class="purple-input"
                    v-model="data[fields[3]]"
                    :label="$t('vehicle_type')"
                    :items="['Car', 'Motorbike']"
                    :rules="[(v) => !!v || 'Required']"
                    required
                  />
                  </v-col>
                  <v-col cols="10" md="6" lg="4">
                    <v-text-field
                      class="purple-input"
                      :label="$t('plate_number')"
                      :rules="[(v) => !!v || 'Required']"
                      v-model="data[fields[4]]"
                      required
                    />
                  </v-col>
                </v-row>

                <v-row class="ma-n5">
                  <v-col cols="10" md="6" lg="6">
                    <v-autocomplete
                      class="purple-input"
                      :label="$t('place_name')"
                      :rules="[(v) => !!v || 'Required']"
                      v-model="data[fields[5]]"
                      :items="$store.state.places_name"
                      required
                    />
                  </v-col>
                  <v-col cols="10" md="6" lg="6">
                    <v-autocomplete
                      class="purple-input"
                      :label="$t('kana_text')"
                      :rules="[(v) => !!v || 'Required']"
                      v-model="data[fields[6]]"
                      :items="$store.state.kana_text"
                      required
                    />
                  </v-col>
                  <v-col cols="10" md="6" lg="5">
                    <v-text-field
                      v-if="fields[7]"
                      class="purple-input"
                      :label="$t('classification_num')"
                      :rules="[(v) => !!v || 'Required']"

                      v-model="data[fields[7]]"
                    />
                  </v-col>
                  
                </v-row>
              </v-container>
            </v-form>
          </v-card-text>
          <v-card-actions class="mt-n8">
            <v-spacer></v-spacer>
            
            <v-btn
              :disabled="loadingSubmit"
              text
              class="mx-1"
              color="grey"
              @click="closeDialog(type)"
              >{{ $t("cancel") }}</v-btn
            >
            <v-btn
              depressed
              class="mx-1"
              color="primary"
              :loading="loadingSubmit"
              :disabled="loadingDelete"
              @click="submit(data, type, $refs.form)"
              >{{ $t("submit") }}</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-container>
    </v-card>
  </v-dialog>
</template>
<script>
import { mdiTrashCan as remove } from "@mdi/js";
export default {
  props: {
    dialog: Boolean,
    title: String,
    closeDialog: Function,
    fields: Array,
    data: Object,
    submit: Function,
    deletePlate: Function,
    type: String,
    removable: Boolean,
    loadingSubmit: Boolean,
    loadingDelete: Boolean
  },
  data: () => ({
    remove,
  }),
  methods: {
    //map Plate English to Plate Khmer and vice versa
    mapPlate(type, selectedPlate) {
      console.log("MAP PLATE TYPE",type)
      if(type === "EN"){
        const index = this.$store.state.organizationPlate.findIndex(plate => {
        return plate.plateEN === selectedPlate
        })
        this.data[this.fields[6]] = this.$store.state.organizationPlate[index].plateKH
      }
      else if (type === "JP") {
        const index = this.$store.state.organizationPlate.findIndex(plate => {
        return plate.plateKH === selectedPlate
        })
        this.data[this.fields[5]] = this.$store.state.organizationPlate[index].plateEN
      }
    }
  },
  computed: {}
};
</script>

<style></style>
