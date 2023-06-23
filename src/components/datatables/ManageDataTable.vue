<template>
  <v-card>
    <v-card-title>
      <v-row>
        <v-col cols="12" sm="12" md="6" xl="6">
          <v-text-field
            outlined
            :label="$t('search')"
            v-model="search"
            dense
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="12" md="6" xl="6">
          <v-btn
            depressed
            :color="btnColor"
            dark
            rounded
            small
            @click="openRegisterDialog(type)"
          >
            <v-icon>{{ add }}</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-title>
    <v-data-table
      :loading="loading"
      loading-text="loading plates"
      flat
      :search="search"
      :headers="headers"
      :items="items"
      :items-per-page="5"
      :custom-filter="filterSearch"
      class="elevation-1 px-5"
    >
      <template v-slot:[`item.id`]="{ item }">
        <v-card flat>
          <v-card-text class="my-1 plate_format text-center">
            <v-row>
              <span
                class="blue--text text--darken-4 font-weight-bold mx-auto my-n2"
                >{{ item.organization_name_khmer }}</span
              >
            </v-row>
            <v-row>
              <span class="black--text font-weight-bold pa-2 mx-auto">{{
                item.plate_number
              }}</span>
            </v-row>
            <v-row class>
              <span class="red--text body-2 font-weight-bold mx-auto my-n2">{{
                item.organization_name
              }}</span>
            </v-row>
          </v-card-text>
        </v-card>
      </template>

      <!-- <template v-slot:[`item.role`]="{ item }">
        <span> {{ t(`occupation.${item.role}`.toLowerCase(), item.role) }}</span>
      </template>

      <template v-slot:[`item.vehicle_type`]="{ item }">
        <span> {{ t(`vehicles.${item.vehicle_type}`.toLowerCase(), item.vehicle_type) }}</span>
      </template> -->


      <template v-slot:[`item.view`]="{ item }">
        <v-btn icon @click="openEditDialog(item, type)">
          <v-icon small>{{ view }}</v-icon>
        </v-btn>
        <v-btn icon color="red" x-small @click="deletePlate(item.plate_number, type)">
          <v-icon>{{ remove }}</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <notifications position="top right"/>
  </v-card>
</template>

<script>
import {
  mdiPlus as add,
  mdiPencil as view,
  mdiTrashCan as remove,
} from "@mdi/js";
export default {
  props: {
    items: Array,
    headers: Array,
    btnColor: String,
    openEditDialog: Function,
    openRegisterDialog: Function,
    deletePlate: Function,
    type: String,
    loading: Boolean,
    // title:String,
  },
  data: () => ({
    search: "",
    add,
    view,
    remove,
  }),
  methods: {
    filterSearch(_, search, item) { 
      // console.log(item)
      let result = false
      for (const property in item){
        if( property !== '__v' && property !== '_id'){
          // console.log(property, item[property])
          result = item[property].toString().toLowerCase().indexOf(search.toLowerCase()) !== -1
          if(result) break
        }
      }
      return result
    },
    t(str, fallbackStr) {
      // use `$te` and `$t
      return this.$t && this.$te
        ? this.$te(str)
          ? this.$t(str)
          : fallbackStr
        : fallbackStr
          ? fallbackStr
          : str
    }
  }
}
</script>

<style>
.plate_format {
  border: 1px solid blue;
  background: rgba(115, 115, 233, 0);
}
</style>
