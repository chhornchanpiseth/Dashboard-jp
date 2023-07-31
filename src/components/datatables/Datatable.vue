<template>
  <v-card 
    class="mb-10"
    >
    <v-card-title>
      <v-row>
        <v-col cols="12" sm="12" md="8" xl="9">
          <span class="font-weight-light">{{ title}}</span>
        </v-col>
        <v-col cols="12" sm="12" md="4" xl="3">
          <v-text-field
            outlined
            :label="$t('search')"
            v-model="$store.state.search"
            dense
            @input="$emit('searchPlate', $store.state.search)"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-title>
    <v-data-table
      :loading="loading"
      loading-text="loading plates"
      :server-items-length="sortFunction"
      :headers="headers"
      :items="items"
      :page.sync='page'
      :items-per-page="$store.state.limit"
      @update:sort-by="$emit('sortPlate', $event)"
      @update:sort-desc="$emit('sortPlateDesc', $event)"
      hide-default-footer
      class=" px-5"
    >
      <!-- license plate format -->
      <template v-slot:[`item.id`]="{ item }">
        <v-card flat max-width="200">
          <v-card-text class="my-1 plate_format">
            <v-row dense no-gutters >
              <v-col cols="4" sm="12" class="text-center">
                <span
                class="blue--text text--darken-4 font-weight-bold mx-auto my-n2"
                >
                
                  {{ item.place_name }} {{ item.classification_number }}
                </span>
              </v-col>
              <v-col cols="4" sm="12" class="text-center">
                <span class="black--text font-weight-bold pa-2 mx-auto">  
                {{ item.kana_text }}  {{item.plate_number}}
                </span>
              </v-col>
              <!-- <v-col cols="4" sm="12" class="text-center">
                <span class="red--text body-2 font-weight-bold mx-auto my-n2">
                  {{item.classification_number}}
                </span>
              </v-col> -->
            </v-row>
          </v-card-text>
        </v-card>
      </template>

      <!-- chip known unknown bad -->
      <template v-slot:[`item.type`]="{ item }">
        <v-chip
          v-if="item.type === 'unknown'"
          small
          :color="`${item.type}`"
          :class="`v-chip--active  white--text`"
          >{{ item.type }}
        </v-chip>

        <v-chip
          v-else-if="item.type === 'known'"
          small
          @click="detailknown(item.plate_number)"
          :color="`${item.type}`"
          :class="`v-chip--active  white--text`"
          > 
          {{ item.type }}
        </v-chip>

        <v-chip
          v-else
          @click="detailbad(item.plate_number)"
          small
          :color="`${item.type}`"
          :class="`v-chip--active  white--text`"
        >
          {{ item.type }}</v-chip
        >
      </template>

      <!-- translate Direction  -->
      <template v-slot:[`item.status`]="{ item }">
        {{$t(item.status.toLowerCase())}}
      </template>

      <!-- displaying image  -->
      <template v-slot:[`item.image`]="{ item }">
        <v-img
          class="ma-2 ml-0"
          max-height="50"
          max-width="100"
          :src="getImgUrl(item.image, item.location)"
          @click="openDialog(getImgUrl(item.image, item.location))"
          alt="unknown"
        >
        </v-img>
      </template>
      <template v-slot:[`item.origin`]="{ item }">
        <v-icon
          :color="item.approved ? 'green': 'grey-darken-2'"
          @click="editWrongData(item)"
          right
        >
          mdi-checkbox-marked-circle-outline
        </v-icon>

        <!-- <v-icon v-else @click="editWrongData(item)" color="green" right>
          mdi-checkbox-marked-circle-outline
        </v-icon> -->
      </template>
    </v-data-table>

    <!-- zoom img -->
    <v-dialog max-width="600" v-model="dialogImgOn">
      <v-img :src="dialogImg"> </v-img>
    </v-dialog>
    <!-- detail known/bad -->
    <v-dialog max-width="600" v-model="dialog">
      <v-card class="pa-4">
        <v-container>
          <v-card-title class="text-uppercase font-weight-light headline">
            <span class="mr-3">{{ $t("detailInformation") }}</span>
          </v-card-title>
          <v-row v-for="(field, i) in fields_known" :key="i">
            <v-col cols="6" class="black--text ml-20">{{ $t(`${field}`) }}</v-col>
            <v-spacer></v-spacer>
            <v-col cols="6" class="blue--text">: {{
              detailPlateInfo[field]
            }}</v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>

    <!--addional data X approve -->

    <v-dialog :width="width"
    persistent 
    v-model="dialogWrongData">
      <v-card class="m-5">
        <v-container>
          <v-card-title class="text-uppercase font-weight-light">
            <span class="mr-3 display-1">{{ $t('plate_logs') }}</span>
            <span>
              <v-switch v-model="editMode" :label="$t('edit_mode')"></v-switch>
            </span>
            <v-spacer></v-spacer>
          </v-card-title>
          <v-card flat>
            <v-form>
              <v-row class="ma-3">
                <v-col cols="12" md="6">
                  <v-autocomplete
                    class="purple-input"
                    :disabled="!editMode"
                    v-model="wrongData.approved_by"
                    :label="$t('approved_by')"
                    :items="$store.state.security"
                    required
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    :disabled="!editMode"
                    v-model="wrongData.plate_number"
                    :rules="[(v) => !!v || 'Required']"
                    class="purple-input"
                    :label="$t('plate_number')"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-autocomplete
                    class="purple-input"
                    :disabled="!editMode"
                    :label="$t('place_name_japaness')"
                    :rules="[(v) => !!v || 'Required']"
                    v-model="wrongData.place_name"
                    :items="$store.state.places_name"
                    item-text="plateKH"
                    @input="mapPlate('JP', wrongData.place_name)"
                    required
                  />
                </v-col>
                <!-- <v-col cols="12" md="6">
                  <v-autocomplete
                    class="purple-input"
                    :disabled="!editMode"
                    :label="$t('place_name')"
                    :rules="[(v) => !!v || 'Required']"
                    v-model="wrongData.orgnization_name"
                     :items="$store.state.places_name"
                    item-text="plateEN"
                     @input="mapPlate('EN', wrongData.orgnization_name)"
                    required
                  />
                </v-col> -->
                <v-col cols="10" md="6" lg="4">
                  <v-autocomplete
                    class="purple-input"
                    :disabled="!editMode"
                    v-model="wrongData.organizationPlate"
                    :label="$t('origin')"
                    :items="$store.state.organizationPlate"
                    item-text="plateKH"
                    @input="mapPlate('JP', wrongData.organizationPlate)"
                    required
                  />
                </v-col>
                  <v-col cols="10" md="6" lg="3">
                  <v-autocomplete
                    class="purple-input"
                    :disabled="!editMode"
                    v-model="wrongData.vehicle_type"
                    :label="$t('vehicle_type')"
                     :items="[$t('vehicles.car'), $t('vehicles.motorbike'), $t('vehicles.bus')]"
                    required
                  />
                </v-col>
              
                <v-col cols="10" md="6" lg="3">
                  <v-autocomplete
                    class="purple-input"
                    :disabled="!editMode"
                    :label="$t('kana_text')"
                    v-model="wrongData.kana_text"
                    :items="$store.state.kana_text"
                  />
                </v-col>
                <v-col cols="10" md="6" lg="2">
                  <v-text-field
                  :disabled="!editMode"
                    v-model="wrongData.temperature"
                    class="purple-input"
                    :label="$t('temperature')"
                  />
                </v-col>
                 <v-col cols="10" md="6" lg="3">
                  <v-text-field
                    v-model="wrongData.num_people"
                    :disabled="!editMode"
                    class="purple-input"
                    :label="$t('classification_num')"
                    type="number"
                    
                  />
                </v-col>
                <v-col cols="10" md="6" lg="2" v-if="$route.path!==`/${$i18n.locale}/currently_in`">
                  <v-autocomplete
                    v-model="wrongData.status"
                    :disabled="!editMode"
                    class="purple-input"
                    :label="$t('status')"
                    :items="[$t('in'), $t('out')]"
                  />
                </v-col>
                 <v-col cols="10" md="6" lg="3">
                  <v-text-field
                    v-model="wrongData.phone_number"
                    :disabled="!editMode"
                    class="purple-input"
                    :label="$t('phone')"
                  />
                </v-col>
                <v-col cols="10" md="6" lg="3">
                  <v-autocomplete
                    class="purple-input"
                    :label="$t('nationality')"
                    :disabled="!editMode"
                    v-model="wrongData.nationality"
                    :items="[$t('local'), $t('foreigner')]"
                    required
                  />      
                </v-col>
              </v-row>
              <v-card-actions>
                <v-btn
                  outlined
                  dark
                  class="mx-1"
                  color="red"
                  :disabled="loadingChangeDialog"
                  :loading="loadingDeleteDialog"
                  @click="deleteWrongData()"
                  >{{ $t("delete") }}</v-btn
                >
                <v-spacer></v-spacer>
                <v-btn
                  text
                  class="mx-1"
                  color="grey"
                  :disabled="loadingChangeDialog || loadingDeleteDialog"
                  @click="dialogWrongData = false"
                  >{{ $t("cancel") }}</v-btn
                >
                <v-btn
                  depressed
                  dark
                  class="mx-1"
                  color="primary"
                  :disabled="!editMode || loadingDeleteDialog"
                  :loading="loadingChangeDialog"
                  @click="updateWrongData(wrongData)"
                  >{{ $t("submit") }}</v-btn
                >
                </v-card-actions
              >
            </v-form>
          </v-card>

          <!-- <div
            v-else
            class="ma-3"
            v-for="(field, i) in additionalData"
            :key="i"
          >
            <span class="black--text ml-20">{{ field }}</span>
            <span style="float: right; margin-right: 30px" class="blue--text">{{
              wrongData[field]
            }}</span>
          </div> -->
        </v-container>
      </v-card>
    </v-dialog>
    <v-divider/>
    <div class="text-center pa-5">
      <v-row>
        <v-spacer></v-spacer>
        <v-col
          cols="12"
          lg="8">
          
          <v-pagination 
        color="blue"
        v-model="page"
        :length="length"
        :total-visible="totalVisible"
        @input="changePage"
      ></v-pagination>
        </v-col>
      <v-col>   
        <v-text-field style="width:200px"
        v-model="page"
        :label="$t('goToPage')"
        type="number"
        min="1"
        :max="length"
        @input="changePage"
      ></v-text-field>
      </v-col>
      </v-row>
        <v-text-field style="width:200px"
        v-model="$store.state.limit"
        :label="$t('limitPage')"
        type="number"
        min="0"
        @input="$emit('changeLimit')"
      ></v-text-field>
    </div>
  </v-card>
</template>

<script>
import {
  makeGetRequest,
  makePostRequest,
  makeDeleteRequest,
} from "../../Utilities/backend";

import { mdiEye as view } from "@mdi/js";

export default {
  components: {},
  props: {
    items: Array,
    headers: Array,
    loading: Boolean,
    collection: String,
    title: String,
  },

  data: () => ({
    view,
    detailPlateInfo: {},
    dialog: false,
    editMode: false,
    dialogImg: "",
    totalVisible: 10,
    previousPageNumber: null,
    dialogImgOn: false,
    dialogWrongData: false,
    loadingChangeDialog: false,
    loadingDeleteDialog: false,
    wrongData: {
      approved_by: "",
      reason: "",
      num_people: "",
      status:  "",
      vehicle_type: "",
      origin: "",
      temperature: "",
      phone_number: "",
      nationality: "",
      plate_number: "",
      orgnization_name: "",
      orgnization_name_khmer: "",
    },
    last_plate_object: {},
    approvedPlate: true,
    additionalData: [
      "plate_number",
      // change from orgnization_name to place name
      "place_name",
      "place_name_japaness",
      // change from reason to kana_text
      "kana_text",
      "classification_num", // from num_people
      "origin",
      "temperature",
      "phone_number",
      "nationality",
      "vehicle_type"
    ],
    fields_known: [
      "fullname",
      "phone",
      "role",
      "vehicle_type",
      "plate_number",
      // Make channges JP
      // "organization_name",
      // "organization_name_khmer",
      "place_name" , 
      "kana_text" , 
      "classification_number" ,
    ],
  }),
  methods: {
    async detailknown(id) {
      const data = await makeGetRequest(`/known_plates/${id}`);
      // console.log(data);
      this.detailPlateInfo = data;
      this.dialog = true;
    },
    async detailbad(id) {
      const data = await makeGetRequest(`/bad_plates/${id}`);
      this.detailPlateInfo = Object.value(data);
      // console.log(this.detailPlateInfo);
      this.dialog = true;
    },
    getImgUrl(time, location) {
      console.log("GET IMAGE URL EXEC") 
      console.log(time)
      console.log(location)
      if (location in this.$store.state.location_jp_to_eng) location = this.$store.state.location_jp_to_eng[location];
      const place = location.replace(" ", '').toLowerCase();
      const modifiedTime = time.replace(/:/g, '_');
      console.log(modifiedTime)
      return `http://localhost:3000/${place}/${modifiedTime}.png`
    },
    openDialog(img) {
      this.dialogImg = img;
      this.dialogImgOn = true;
    },
    editWrongData(plate_object) {
      // console.log(plate_object)
      if (plate_object.approved == false) {
        this.editMode = true;
      }
      else this.editMode = false
      //check if approve_by is empty else put username 
      this.wrongData.approved_by =  plate_object.approved_by ? plate_object.approved_by : this.$store.state.user.username
      //add username into security array if username doesn't exist in order to have autocomplete field to select
      if(!this.$store.state.security.includes(this.$store.state.user.username)) this.$store.state.security.push(this.$store.state.user.username)
      this.$store.state.security.sort()
      this.wrongData.plate_number = plate_object.plate_number;
      this.wrongData.orgnization_name_khmer = plate_object.organization_name_khmer;
      this.wrongData.orgnization_name = plate_object.organization_name;
      this.wrongData.origin = this.wrongData.orgnization_name_khmer
      this.wrongData.temperature = plate_object.temperature
      this.wrongData.num_people = plate_object.num_people
      this.wrongData.phone_number = plate_object.phone_number
      if(this.$i18n.locale === "en") {
        this.wrongData.reason = this.$store.state.reason_jp_to_eng[plate_object.reason]
        this.wrongData.vehicle_type = this.$store.state.vehicle_type_jp_to_eng[plate_object.vehicle_type]
        this.wrongData.status = plate_object.status
      }
      else {
        this.wrongData.reason = plate_object.reason
        this.wrongData.vehicle_type = plate_object.vehicle_type
        this.wrongData.status = (this.$route.path ===`/${this.$i18n.locale}/currently_in`) ? this.$t('in', 'jp') : this.$t(plate_object.status.toLowerCase(), 'jp')
      }
      this.wrongData.nationality = plate_object.nationality
      this.last_plate_object = plate_object
      this.dialogWrongData = true
    },
    async updateWrongData(wrongData) {
      this.loadingChangeDialog = true
      wrongData.status = (this.wrongData.status) ? this.wrongData.status : ''
      wrongData.reason = (this.wrongData.reason) ? this.wrongData.reason : ''
      const body = {
        plate: this.last_plate_object,
        change: true,
        approved_by: wrongData.approved_by,
        plate_number: wrongData.plate_number.toUpperCase(),
        organization_name: wrongData.orgnization_name,
        organization_name_khmer: wrongData.orgnization_name_khmer,
        origin: wrongData.orgnization_name_khmer,
        temperature: wrongData.temperature,
        reason: (this.$i18n.locale === "en") ? this.$t(wrongData.reason.toLowerCase().replace(' ', "_"), "jp"): wrongData.reason,
        num_people: wrongData.num_people,
        status : (this.$i18n.locale === "en") ? wrongData.status : this.$store.state.status_jp_to_eng[wrongData.status] ,
        phone_number: wrongData.phone_number,
        nationality : wrongData.nationality,
        vehicle_type :  (this.$i18n.locale === "en") ? this.$t(`vehicles.${wrongData.vehicle_type.toLowerCase()}`, 'jp') : wrongData.vehicle_type,
      }
      console.log(body)
      try {
        await makePostRequest(this.approvePath() + "/approve", body);
        this.$emit("editedDatatableItem", 'success')
      }
      catch (err) {
        this.$emit("editedDatatableItem", 'error', err)
      }
      finally {
        this.loadingChangeDialog = false
        this.dialogWrongData = false
      }
    },
    async deleteWrongData() {
      let response = confirm(this.$t('notifications.delete.confirmMessage.text'))
      if (response) {
        this.loadingDeleteDialog = true
        console.log(this.last_plate_object)
        try {
          const body = { plate: this.last_plate_object }
          await makeDeleteRequest(this.approvePath() + "/delete", body)
          this.$emit("deletedDatatableItem", 'success')
        }
        catch (err) {
          this.$emit('deletedDatatableItem', 'error', err)
        }
        finally {
          this.loadingDeleteDialog = false
          this.dialogWrongData = false
        }
      }
    },

    approvePath() {
      let approvePath = this.$route.path;
      if (this.$route.name == "platelogs") {
        approvePath = "/plate_logs";
      }
      else if (this.$route.name == "currentlyin") {
        approvePath = "/currently_in"
      }
      return approvePath
    },
    //map Plate English to Plate Khmer and vice versa
    mapPlate(type, selectedPlate) {
      // console.log('selected')
      if(type === "EN"){
        const index = this.$store.state.organizationPlate.findIndex(plate => {
        return plate.plateEN === selectedPlate
        })
        this.wrongData.orgnization_name_khmer = this.$store.state.organizationPlate[index].plateKH
      }
      else if (type === "JP") {
        const index = this.$store.state.organizationPlate.findIndex(plate => {
        return plate.plateKH === selectedPlate
        })
        this.wrongData.orgnization_name = this.$store.state.organizationPlate[index].plateEN
      }
    },
    async changePage(page) {
      if(page !== this.previousPageNumber) {
        this.$store.commit('setPage', {page: page, collection: this.collection})
        if(!this.$store.getters.getPlateByDate.plates){
          if (!this.$store.state.search) {
            await this.$store.dispatch('setPlate', {collection:this.collection})
          }
          else {
            console.log('searched change page')
            await this.$store.dispatch('setPlate', {search:this.$store.state.search, collection:this.collection})
          }
        }
        this.previousPageNumber = page
      }
    },
  },
  computed: {
    page: {
        get(){
          if(this.$store.getters.getPlateByDate.plates) {
            if(!this.$store.state.search) return this.$store.getters.getPlateByDate.current_page
            else return this.$store.state.searchedPlateByDate.current_page
          } 
          else {
            return this.$store.state[this.collection].current_page
          }
        },
        set(page){
          if(this.$store.getters.getPlateByDate.plates) {
            if(!this.$store.state.search) this.$store.getters.getPlateByDate.current_page = page
            else this.$store.state.searchedPlateByDate.current_page = page
          } 
          else {
            this.$store.state[this.collection].current_page = page
          }
        } 
    },
    length() {
      let type = this.$store.state[this.collection].type
      // console.log(type)
      if(this.$store.getters.getPlateByDate.plates) {
          if(!this.$store.state.search) return Math.ceil(this.$store.getters.getPlateByDate.plates.length/this.$store.state.limit)
          else 
          {
            if(!type) return Math.ceil(this.$store.state.searchedPlateByDate.plates.length/this.$store.state.limit)
            else return Math.ceil(this.$store.state.searchedPlateByDate.typePlates.length/this.$store.state.limit)
          }
      }
      else {
        if(!type) {
          return this.$store.state[this.collection].total_page
        }
        else if(type==="known"){
          return Math.ceil(this.$store.state[this.collection].total_known/this.$store.state.limit)
        }
        else if (type==="unknown") {
          return Math.ceil(this.$store.state[this.collection].total_unknown/this.$store.state.limit)
        }
        else {
          return Math.ceil(this.$store.state[this.collection].total_bad/this.$store.state.limit)
        }
      }
    },
    sortFunction() {
      if(this.$store.getters.getPlateByDate.plates) return -1
      else return this.length
    },
    width() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return 500
        case 'sm': return 800
        case 'md': return 900
        case 'lg': return 1100
        case 'xl': return 1200
      }
      return "auto"
    },
  },
}
</script>
<style>
.v-chip.bad {
  background-color: rgb(247, 33, 33);
}
.v-chip.unknown {
  background: rgb(245, 172, 36);
}
.v-chip.known {
  background: rgb(35, 202, 35);
}
.v-label {
  font-size: 1em;
}

.v-input, .v-btn__content, .v-list-item__title {
  font-size: 1.3em;
}

</style>
