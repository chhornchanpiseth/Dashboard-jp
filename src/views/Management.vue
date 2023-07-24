<template>

  <v-container >
    <v-tabs color="green" grow v-model="tab">
      <v-tab>
        <p>{{ $t("known_plate") }}</p>
      </v-tab>
      <v-tab>
        <p>{{ $t("bad_plate") }}</p>
        </v-tab>
    </v-tabs>
    <PlateDialog
      :dialog="registerKnownPlatesDialog"
      :title="$t('known_plate')"
      :closeDialog="closeRegisterPlatesDialog"
      :fields="fields"
      :data="registerInfo"
      :submit="registerPlate"
      :deletePlate="deletePlate"
      type='/known_plates'
      :removable="false"
      :loadingSubmit="loadingSubmit"
    />
    <PlateDialog
      :dialog="registerBadPlatesDialog"
      :title="$t('bad_plate')"
      :closeDialog="closeRegisterPlatesDialog"
      :fields="fields"
      :data="registerInfo"
      :submit="registerPlate"
      :deletePlate="deletePlate"
      type='/bad_plates'
      :removable="false"
      :loadingSubmit="loadingSubmit"
    />

    <PlateDialog
      :dialog="editKnownPlatesDialog"
      :title="$t('known_plate')"
      :closeDialog="closeEditPlatesDialog"
      :fields="fields"
      :data="editInfo"
      :submit="submitPlate"
      :deletePlate="deletePlate"
      type='/known_plates'
      :removable="true"
      :loadingSubmit="loadingSubmit"
      :loadingDelete="loadingDelete"
    />
    <PlateDialog
      :dialog="editBadPlatesDialog"
      :title="$t('bad_plate')"
      :closeDialog="closeEditPlatesDialog"
      :fields="fields"
      :data="editInfo"
      :submit="submitPlate"
      :deletePlate="deletePlate"
      type='/bad_plates'
      :removable="true"
      :loadingSubmit="loadingSubmit"
      :loadingDelete="loadingDelete"
    />
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <ManageDataTable
          btnColor="blue"
          type='/known_plates'
          :loading="loadingManageDataTable"
          :items="knownPlates"
          :openEditDialog="openEditPlatesDialog"
          :openRegisterDialog="openRegisterPlatesDialog"
          :deletePlate="deletePlate"
          :headers="[
            { text: $t('license_plate'), sortable: false, value: 'id' },
            { text: $t('name'), value: 'fullname' },
            { text: $t('role'), value: 'role' },
            { text: $t('vehicle_type'), value: 'vehicle_type' },
            { text: $t('phone'), value: 'phone' },
            { text: $t('view'), value: 'view' },
          ]"
        />
      </v-tab-item>
      <v-tab-item>
        <ManageDataTable
          btnColor="red"
          type='/bad_plates'
          :items="badPlates"
          :openEditDialog="openEditPlatesDialog"
          :openRegisterDialog="openRegisterPlatesDialog"
          :deletePlate="deletePlate"
          :headers="[
            { text: $t('license_plate'), sortable: false, value: 'id' },
            { text: $t('name'), value: 'fullname' },
            { text: $t('role'), value: 'role' },
            { text: $t('vehicle_type'), value: 'vehicle_type' },
            { text: $t('phone'), value: 'phone' },
            { text: $t('reason_why_bad_plate'), value: 'badStatus' },
            { text: $t('view'), value: 'view' },
          ]"
        />
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
import ManageDataTable from "../components/datatables/ManageDataTable.vue";
import PlateDialog from "../components/Dialogs/PlateDialog";
import {
  makeGetRequest,
  makePostRequest,
  makeDeleteRequest,
  makeEditRequest,
} from "../Utilities/backend";

export default {
  components: {
    ManageDataTable,
    PlateDialog,
  },
  data: () => ({
    tab: null,
    fields: [
      "fullname",   
      "phone",
      "role",
      "vehicle_type",
      "plate_number",
      "place_name" , 
      "kana_text" , 
      "classification_number" , 
      // "organization_name",
      // "organization_name_khmer",

    ],
    editInfo: {
      fullname: '',
      // organization_name: '',
      // organization_name_khmer: '',
      
      phone: '',
      plate_number: '',
      place_name: '',
      kana_text: '',
      classification_number: '',
      role: '',
      vehicle_type: ''
    },
    registerInfo: {},
    knownPlates: [],
    badPlates: [],
    registerKnownPlatesDialog: false,
    registerBadPlatesDialog: false,
    editKnownPlatesDialog: false,
    editBadPlatesDialog: false,
    loadingSubmit: false,
    loadingDelete: false,
    loadingManageDataTable: false
  }),
  methods: {
    // show data
    async getPlates(type) {
      try {
        this.loadingManageDataTable = true
        const data = await makeGetRequest(type)
        if( type === "/known_plates") {
          this.knownPlates = data
        }
        else if ( type === "/bad_plates" ) {
          this.badPlates = data
        }
        console.log(data)
      }
      catch (err) {
        console.log(err)
      }
      finally {
        this.loadingManageDataTable = false
      }
    },

    // get edit data
    getEditData(item) {
      this.editInfo.fullname = item.fullname
      this.editInfo.phone = item.phone
      this.editInfo.role = item.role
      this.editInfo.vehicle_type = item.vehicle_type
      this.editInfo.plate_number = item.plate_number
      this.editInfo.place_name = item.place_name
      this.editInfo.kana_text = item.kana_text
      this.editInfo.classification_number = item.classification_number

      // this.editInfo.organization_name = item.organization_name
      // this.editInfo.organization_name_khmer = item.organization_name_khmer
    },

    // register known plate dialog function
    openRegisterPlatesDialog(type) {
      if( type === "/known_plates" ) {
        this.registerKnownPlatesDialog = true
      }
      else if ( type === '/bad_plates') {
        this.registerBadPlatesDialog = true
      }
    },
    closeRegisterPlatesDialog(type) {
      if( type === "/known_plates" ) {
        this.registerKnownPlatesDialog = false
      }
      else if ( type === '/bad_plates') {
        this.registerBadPlatesDialog = false
      }
    },

    // edit bad plate dialog function 
    openEditPlatesDialog(item, type) {
      this.getEditData(item)
      if( type === "/known_plates" ) {
        this.editKnownPlatesDialog = true
      }
      else if ( type === '/bad_plates') {
        this.editBadPlatesDialog = true
      }
    },
    closeEditPlatesDialog(type) {
      if( type === "/known_plates" ) {
        this.editKnownPlatesDialog = false
      }
      else if ( type === '/bad_plates') {
        this.editBadPlatesDialog = false
      }
    },

    // registerPlates function
    async registerPlate(item, type, form ) {
      this.loadingSubmit = true
      if( form.validate()) {
        try {
          this.registerInfo.plate_number = this.registerInfo.plate_number.toUpperCase()
          const data = await makePostRequest(type, this.registerInfo)
          console.log(data)
          this.registerInfo = {}
          this.getPlates(type)
          this.$notify({ title: this.$t('notifications.register.success.title') ,text: this.$t('notifications.register.success.text'), type: "success" })
        }
        catch (err) {
          this.$notify({ title: this.$t('notifications.register.fail.title') ,text: err, type: "error" })
          console.log(err)
        }
        finally {
          this.closeRegisterPlatesDialog(type)
        }
      }
      else {
        this.$notify({ title: this.$t('notifications.register.fail.title'), text: this.$t('notifications.register.fail.text'), type: "error" })
      }
      this.loadingSubmit = false
    },

    // submit Plates function
    async submitPlate(item, type) {
      // console.log(this.editInfo)
      this.loadingSubmit = true
      try {
        console.log("body") 
        console.log(this.editInfo)
        const data = await makeEditRequest(
        `${type}/${item.plate_number}`, this.editInfo)
        console.log(data)
        this.getPlates(type)
        this.$notify({ title: this.$t ('notifications.edit.success.title') ,text: this.$t('notifications.edit.success.text'), type: "success" })
      }
      catch (err) {
        this.$notify({ title: this.$t('notifications.edit.fail.title') ,text: err, type: "error" })
      }
      finally {
        this.loadingSubmit = false
        this.closeEditPlatesDialog(type)
      }
    },

    // delete plate
    async deletePlate(id, type) {
      let response = confirm( this.$t('notifications.delete.confirmMessage.text'))
      if (response) {
        this.loadingDelete = true
        try {
          const data = await makeDeleteRequest(`${type}/${id}`)
          console.log(data)
          this.getPlates(type)
          this.$notify({ title: this.$t('notifications.delete.success.title') ,text: this.$t('notifications.delete.success.text'), type: "success" })
        }
        catch (err) {
          this.$notify({ title: this.$t('notifications.delete.fail.title') ,text: err, type: "error" })
        }
        finally {
          this.loadingDelete = false
          this.closeEditPlatesDialog(type)
        }
      }
    }
  },
  created() {
    this.getPlates("/known_plates");
    this.getPlates("/bad_plates");
  },
  updated() {

  }
};
</script>

<style></style>
