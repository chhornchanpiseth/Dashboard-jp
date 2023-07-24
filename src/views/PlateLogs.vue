<template>
  <div class="">
    <v-container text-center>
      <PlateDisplay
        :totalPlates='totalPlates'
        :knownPlates='totalKnown'
        :unknownPlates="totalUnknown"
        :badPlates='totalBad'
        @changeType='changeType'
        >
        <template v-slot:title>
          <span class="display-1 font-weight-light">
            {{ $t("plate_logs")}}
          </span>
        </template>
      </PlateDisplay>

      <v-row class="my-4">
        <!-- select specific date -->
        <v-col cols="12" sm="7" md="6">
          <v-menu
            
            class="text-right"
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            :close-on-click="false"
            transition="scale-transition" 
            offset-y
            max-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                class="ma-0 pa-0"
                v-model="dateRangeText"
                :label="$t('select_specific_date')"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker 
              :max="new Date().toISOString()"
              range 
              v-model="date" 
              no-title 
              scrollable>
              <v-btn
                :disabled="loadingSelectDate"
                :loading="loadingClearDate"
                text
                color='red'
                @click="clearSelectedDate">
                {{ $t("button.clear")}}
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                :disabled="loadingSelectDate || loadingClearDate"
                text 
                color="primary" 
                @click="menu = false">
                {{ $t("button.cancel")}}
              </v-btn>
              <v-btn
                :disabled="loadingClearDate"
                depressed
                :loading='loadingSelectDate' 
                color="primary"   
                @click="selectSpecificDate(true)">
                {{ $t("button.ok")}}
              </v-btn>
            </v-date-picker>
          </v-menu>
        </v-col>

        <v-spacer></v-spacer>
        <!-- capture image  -->
        <v-col>
          <div class="text-md-end">
            <v-dialog
              max-width="1000px"
              v-model="capture">
              <template v-slot:activator="{ on, attrs}">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  depressed
                  dark
                  color="green"
                  @click="captureImageDialog">
                  {{ $t('button.capture')}}
                </v-btn>
              </template>
              <v-card>
                <v-form
                 class="pa-4">
                  <v-autocomplete
                    v-model="imageCaptureLocation"
                    :label="$t('location')"
                    :items="location"
                    :rules="[(v) => !!v || 'Required']">
                  </v-autocomplete>
                  <v-autocomplete
                    v-model="imageCaptureStatus"
                    :label="$t('direction')"
                    :items="[$t('in'), $t('out')]"
                    :rules="[(v) => !!v || 'Required']">
                  </v-autocomplete>
                  <v-card-actions>
                  <v-btn
                    text
                    class="mx-1"
                    color="grey"
                    @click="capture = false"
                    >{{ $t("cancel") }}</v-btn
                  >
                  <v-spacer></v-spacer>
                  <v-btn
                    depressed
                    dark
                    class="mx-1"
                    color="success"
                    link
                    target="_blank"
                    :href="IPCamera"
                    >{{ $t("button.goToIPCamera") }}</v-btn
                  >
                  <v-btn
                    depressed
                    dark
                    class="mx-1"
                    color="primary"
                    @click="captureImage"
                    >{{ $t("submit") }}</v-btn
                  >
                  </v-card-actions>
                </v-form>
              </v-card>
            </v-dialog>
          </div>       
        </v-col>
        <!-- generate data  -->
        <v-col >
          <div class="text-md-end">
            <v-dialog
            ref="menu"
            v-model="dialog"
            max-width="500px"
            persistent
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  class=" white--text"
                  color="blue"
                  v-bind="attrs"
                  v-on="on"
                  depressed
                >
                  <span>{{ $t("generate_daily_data") }}</span>
                </v-btn>
              </template>
              <v-date-picker 
                :max="new Date().toISOString()"
                range 
                v-model="date" 
                scrollable>
                <v-spacer></v-spacer>
                <v-btn 
                  :disabled="loadingGenerateExcel"
                  text  
                  color="primary"
                  @click="dialog = false">
                    {{ $t("button.cancel")}}
                </v-btn>
                <download-excel
                  :data="$store.state.plateByDate.plates"
                  :name="`${$t('plate_logs')} ${title}`"
                  :fields="excelFields"
                  :before-generate="selectSpecificDate"
                  :before-finish="generatedExcel"
                >
                  <v-btn
                    :loading="loadingGenerateExcel"
                    depressed
                    color="primary">
                    {{ $t("button.generate")}}
                  </v-btn>
                </download-excel>
              </v-date-picker>
            </v-dialog>
          </div>
        </v-col>
      </v-row>

      <Datatable
        :title="$t('plate_logs')"
        :items="plates"
        :headers="[
          { text: $t('license_plate'), sortable: false, value: 'id' },
          { text: $t('location'), value: 'location' },
          { text: $t('date'), value: 'date' },
          { text: $t('time'), sortable: false, value: 'timing' },
          { text: $t('direction'), value: 'status' },
          { text: $t('image'), sortable: false, value: 'image' },
          { text: $t('type'), value: 'type' },
          { text: $t('others'), value: 'origin' },
        ]"
        @editedDatatableItem="editedDatatableItem"
        @deletedDatatableItem="deletedDatatableItem"
        @changeLimit="changeLimit"
        @searchPlate="searchPlate"
        @sortPlate="sortPlate"
        @sortPlateDesc="sortPlateDesc"
        :loading="loadingDataTable"
        collection="plate_logs"
      />
    </v-container>
    <notifications position="top right" />
  </div> 
</template>

<script>
// import { mdiPlus as add } from "@mdi/js";
// import { makeGetRequest } from "../Utilities/backend";
import Datatable from "../components/datatables/Datatable";
import PlateDisplay from "../components/PlateDisplay.vue"
import { makePostRequest } from '../Utilities/backend';


export default {
  components: {
    Datatable,
    PlateDisplay
  },
  data: () => ({
    imageCaptureDetail: {
      status: 'Ou Tasek',
      location: 'In',
      date: null,
    },
    capture: false,
    dialog: false,
    title: "",
    generateDataDialog: false,
    date: [],
    type: null,
    loadingDataTable: true,
    menu: false,
    generate_data_menu: false,
    loadingSelectDate: false,
    loadingClearDate: false,
    loadingGenerateExcel: false,
    excelFields: {
      日にち: "date",
      時間: "timing",
      位置: "location",
      ナンバープレート: "plate_number",
      "都道府県名/機関名": "organization_name_khmer",
      ナンバープレートの種類: "type",
      車両の種類: "vehicle_type",
      人々の数: "num_people",
      方向: "status",
      民族: "nationality",
      住居: "origin",
      目的: "reason",
      電話番号: "phone_number",
      熱: "temperature",
      見た: "approved",
    },
  }),
  methods: {
    async getAllPlate(type = this.type, reloadPaginate = true, search = null) {
      this.loadingDataTable = true
      if(reloadPaginate) this.$store.commit('setPage', {page: 1  , collection: 'plate_logs'})
      this.$store.commit('setType', {type: type, collection: 'plate_logs'})
      await this.$store.dispatch('setPlate', {collection:'plate_logs', search})
      this.loadingDataTable = false
    },

    async changeType(type ) {
      this.type = type
      this.$store.commit('setType', {type: type, collection: 'plate_logs'})
      if(this.$store.getters.getPlateByDate.plates) {
        await this.selectSpecificDate(true)
        if(type){
            const data = await this.$store.state.plateByDate.plates.filter(plate => plate.type === type) 
            this.$store.commit('setPlateByDate', data)
          if(this.$store.state.search){
            this.$store.state.searchedPlateByDate.typePlates = this.$store.state.searchedPlateByDate.plates.filter(plate => plate.type === type)       
          }
        }
      } else {
        this.getAllPlate(type, true, this.$store.state.search)
      }
    },
    changeLimit() {
      this.$store.state.limit = parseInt(this.$store.state.limit, 10)
      if(this.$store.getters.getPlateByDate.plates) {
        this.selectSpecificDate()
      }
      else {
        this.getAllPlate(undefined, false, this.$store.state.search)
      }
    },

    async clearSelectedDate() {
      this.loadingClearDate = true
      this.date = []
      await this.getAllPlate(null, true)
      this.$store.state.plateByDate.plates = null
      this.loadingClearDate = false
      this.menu = false
    },

    async selectSpecificDate(reloadPaginate) {
      let body = {}
      this.date.sort((a, b) => {
        let sd = new Date(a)
        let ed = new Date(b)
        return sd - ed;
      });
      this.setTitleExcel(this.date)
      let startDate = this.date[0] ? new Date(this.date[0]).toISOString() : null
      let endDate = this.date[1] ? new Date(this.date[1]).toISOString() : null
      if(!startDate) {
        this.$notify({ title: this.$t('notifications.emptyDate.title') ,text: this.$t('notifications.emptyDate.text'), type: "error" })
      } 
      else {
        endDate = endDate ? endDate : startDate
        body = {
            "startDate": startDate,
            "endDate": endDate
          }
        this.loadingGenerateExcel = this.dialog
        this.loadingDataTable = true
        this.loadingSelectDate = true
         // console.log(reloadPaginate, !reloadPaginate)
        if(reloadPaginate) this.$store.commit('setPage', {page: 1, collection: 'plateByDate'})
        await this.$store.dispatch('setPlateByDate', body)
        // console.log(this.$store.getters.getPlateByDate.plates)
        this.loadingSelectDate = false
        this.menu = false
        this.loadingDataTable = false
      }  
    },

    setTitleExcel(date) {
      const startDate = date[0]
      const endDate = date[1] ? date[1] : startDate
      this.title = startDate + '~' + endDate
    },

    generatedExcel() {
      this.loadingGenerateExcel = false
      this.dialog = false
    },

    // show edited information
    editedDatatableItem(type, error){
      if (type ==='success') {
        this.$notify({ title: this.$t('notifications.edit.success.title'),text: this.$t('notifications.edit.success.text'), type: "success" })
      } 
      else {
        this.$notify({ title: this.$t('notifications.edit.fail.title'),text: error, type: "error" })
      }
      console.log('updated')
      // console.log(this.date)
      this.searchPlate(this.$store.state.search, false)
    },

    // show deleted information
    async deletedDatatableItem(type, error){ 
      if (type ==='success') {
        this.$notify({ title: this.$t('notifications.delete.success.title'),text: this.$t('notifications.delete.success.text'), type: "success" })
      } 
      else {
        this.$notify({ title: this.$t('notifications.delete.fail.title'),text: error, type: "error" })
      }
      console.log('deleted')
      this.searchPlate(this.$store.state.search, false)

    },
    searchPlate(search, reloadPaginate = true) {
      if(this.date.length !== 0){
        if(!search) this.selectSpecificDate(reloadPaginate)
        else {
          this.$store.state.searchedPlateByDate.total_unknown = 0
          this.$store.state.searchedPlateByDate.total_known = 0
          this.$store.state.searchedPlateByDate.total_bad = 0
          this.countSearchedPlateByDate()       
        }
      } else {
        this.getAllPlate(undefined, reloadPaginate, this.$store.state.search)
      }
    },
    sortPlateDesc(sortOrder){
      this.$store.state.sortOrder = (sortOrder[0]) ? "desc" : "asc"
      console.log(this.$store.state.sortOrder, sortOrder[0])
      this.searchPlate(this.$store.state.search, true)
    },
    sortPlate(sort) {
      this.$store.state.sort = sort[0]
    },
    countSearchedPlateByDate() {
      // console.log(this.$store.getters.getPlateByDate.plates)
      this.$store.state.searchedPlateByDate.plates = this.$store.getters.getPlateByDate.plates.filter(
        plate => plate.plate_number.toLowerCase().indexOf(this.$store.state.search.toLowerCase()) !== -1)
      this.$store.state.searchedPlateByDate.total_plates = this.$store.state.searchedPlateByDate.plates.length
      for(const plate in this.$store.state.searchedPlateByDate.plates){
        switch (this.$store.state.searchedPlateByDate.plates[plate].type) {
          case "unknown":
            this.$store.state.searchedPlateByDate.total_unknown +=1
            break
          case "known":
            this.$store.state.searchedPlateByDate.total_known +=1
            break
          case "bad":
            this.$store.state.searchedPlateByDate.total_bad +=1
        }
      }
      // console.log(this.$store.state.searchedPlateByDate.plates)
    },
    captureImageDialog() {
      this.imageCaptureDetail.location = this.imageCaptureLocation
      this.imageCaptureDetail.status = this.imageCaptureStatus
      let tzoffset = (new Date()).getTimezoneOffset() * 60000
      this.imageCaptureDetail.date = new Date(Date.now() - tzoffset).toISOString()
      this.capture = true
    },

    async captureImage() {
      const location = (this.$i18n.locale === 'en') ? this.imageCaptureDetail.location: this.$store.state.location_jp_to_eng[this.imageCaptureDetail.location]
      const status = (this.$i18n.locale === 'en') ? this.imageCaptureDetail.status: this.$store.state.status_jp_to_eng[this.imageCaptureDetail.status]
      const data = {
        "image_url": `${this.$store.state.imageURL[`${location}(${status})`]}/Streaming/channels/1/picture`,
        "status": status,
        "location": location,
        "datetime": this.imageCaptureDetail.date
      }
      const res = await makePostRequest(null, data, "http://192.168.7.30:5000/predict")
      if(res.status === 'error') {
        const message = res.message === 'No vehicles found' ? this.$t('notifications.captureImage.fail.text') : this.$t('notifications.fail.text')
        const title = res.message === 'No vehicles found' ? this.$t('notifications.captureImage.success.title') : this.$t('notifications.fail.title')
        this.$notify({ title: title, text: message, type: res.status })
      }
      else {
        const plateList = res.message.map(({plate_number}) => plate_number)
        this.$notify({title: this.$t('notifications.captureImage.success.title'),
        text: plateList.join('</br>'),
        type: res.status})
      }
      this.capture = false
    },
  },
  computed: {
    plates() {
      if(!this.$store.getters.getPlateByDate.plates) {
        return this.$store.state.plate_logs.plates
      }
      else {
        if(!this.$store.state.search) return this.$store.getters.getPlateByDate.plates
        else {
          if(!this.type) return this.$store.state.searchedPlateByDate.plates
          else return this.$store.state.searchedPlateByDate.typePlates
        }
      }
    },
    dateRangeText () {
      return this.date.join(' ~ ')
    },
    totalPlates() {
      if(this.$store.getters.getPlateByDate.plates) {
        if(this.$store.state.search) return this.$store.state.searchedPlateByDate.total_plates
        else return this.$store.getters.getPlateByDate.total_plates
      } 
      else return this.$store.state.plate_logs.total_plates 
    },
    totalKnown() {
      if(this.$store.getters.getPlateByDate.plates) {
        if(this.$store.state.search) return this.$store.state.searchedPlateByDate.total_known
        else return this.$store.getters.getPlateByDate.total_known
      } 
      else return this.$store.state.plate_logs.total_known 
    },
    totalUnknown() {
      if(this.$store.getters.getPlateByDate.plates) {
        if(this.$store.state.search) return this.$store.state.searchedPlateByDate.total_unknown
        else return this.$store.getters.getPlateByDate.total_unknown
      } 
      else return this.$store.state.plate_logs.total_unknown 
    },
    totalBad() {
      if(this.$store.getters.getPlateByDate.plates) {
        if(this.$store.state.search) return this.$store.state.searchedPlateByDate.total_bad
        else return this.$store.getters.getPlateByDate.total_bad
      } 
      else return this.$store.state.plate_logs.total_bad 
    },
    IPCamera() {
      const location = (this.$i18n.locale === 'en') ? this.imageCaptureDetail.location: this.$store.state.location_jp_to_eng[this.imageCaptureDetail.location]
      const status = (this.$i18n.locale === 'en') ? this.imageCaptureDetail.status: this.$store.state.status_jp_to_eng[this.imageCaptureDetail.status]
      return `${this.$store.state.imageURL[`${location}(${status})`]}`
    },
    imageCaptureLocation: {
      get(){
        return this.$t(this.$store.state.location[0].toLowerCase().replace(' ', ''))
      },
      set(location) {
        this.imageCaptureDetail.location = location
      }
    },
    imageCaptureStatus: {
      get(){
        return this.$t('in')
      },
      set(status) {
        this.imageCaptureDetail.status = status 
      }
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
    location() {
      this.$store.state.location.forEach((place, index) => {
        this.$store.state.location[index] = this.$t(place.replace(' ', '').toLowerCase())
        })
      return this.$store.state.location
    }
  },
  created() {
    this.$store.state.search = ""
    this.getAllPlate()
    
    // listen for event "newPlate" then refresh page when receive
    this.sockets.subscribe("newPlate", (data) => {
      console.log(data)
      this.searchPlate(this.$store.state.search, false)
    });
  },
  beforeDestroy() {
    this.sockets.unsubscribe("newPlate");
  },
  updated() {
  }
};
</script>

<style>
#total {
  border-left: 7px solid rgb(47, 164, 241);

}
#unknown {
  border-left: 7px solid orange;

}
#known {
  border-left: 7px solid rgb(64, 204, 64);

}
#bad {
  border-left: 7px solid rgb(245, 78, 0);

}
</style>
