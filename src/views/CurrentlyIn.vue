<template>
  <v-container class="folder text-center">
    <PlateDisplay
      :totalPlates='totalPlates'
      :knownPlates='totalKnown'
      :unknownPlates="totalUnknown"
      :badPlates='totalBad'
      @changeType='changeType'
        >
      <template v-slot:title>
        <span class="display-1 font-weight-light">
          {{$t("currently")}}
        </span>
      </template>    
    </PlateDisplay>
    <Datatable
      :items="plates"
      :headers="[
        { text: $t('license_plate'), sortable: false, value: 'id' },
        { text: $t('location'), value: 'location' },
        { text: $t('date'), value: 'date' },
        { text: $t('time'), sortable: false, value: 'timing' },

        { text: $t('image'), sortable: false, value: 'image' },
        { text: $t('type'), value: 'type' },
        { text: $t('others'), value: 'origin' },
      ]"
      :title="$t('currently')"
      @editedDatatableItem="editedDatatableItem"
      @deletedDatatableItem="deletedDatatableItem"
      @changeLimit="changeLimit"
      @searchPlate="searchPlate"
      @sortPlate="sortPlate"
      @sortPlateDesc="sortPlateDesc"
      :loading="loadingDataTable"
      collection="currently_in"
    ></Datatable>
    <notifications position="top right" />
  </v-container>
</template>

<script>
import Datatable from "../components/datatables/Datatable";
import PlateDisplay from "../components/PlateDisplay.vue"

export default {
  components: {
    Datatable,
    PlateDisplay
  },

  data() {
    return {
      type: null,
      loadingDataTable: false,
    };
  },
  methods: {
    async getAllCurrentInPlate(type = null, reloadPaginate, search) {
      this.loadingDataTable = true
      if(reloadPaginate) this.$store.commit('setPage', {page: 1  , collection: 'currently_in'})
      this.$store.commit('setType', {type: type, collection: 'currently_in'})
      await this.$store.dispatch('setPlate', {search, collection:'currently_in'})
      this.loadingDataTable = false
    },

    changeType(type) {
      this.type = type
      this.getAllCurrentInPlate(type, true, this.$store.state.search)
    },
    changeLimit() {
      this.$store.state.limit = parseInt(this.$store.state.limit, 10)
      this.getAllCurrentInPlate(this.type)
    },
    // show edited information
    editedDatatableItem(type, error){ 
      if (type ==='success') {
        this.$notify({ title: this.$t('notifications.edit.success.title') ,text: this.$t('notifications.edit.success.text'), type: "success" })
      } 
      else {
        this.$notify({ title: this.$t('notifications.edit.fail.title') ,text: error, type: "error" })
      }
      this.getAllCurrentInPlate()
    },
    // show deleted information
    deletedDatatableItem(type, error){ 
      this.loadingDataTable = true
      if (type ==='success') {
        this.$notify({ title: this.$t('notifications.delete.success.title') ,text: this.$t('notifications.delete.success.text'), type: "success" })
      } 
      else {
        this.$notify({ title: this.$t('notifications.delete.fail.title') ,text: error, type: "error" })
      }
      this.getAllCurrentInPlate()
    },
    searchPlate(search, reloadPaginate = true) {
        this.getAllCurrentInPlate(undefined, reloadPaginate, this.$store.state.search)
    },
    sortPlateDesc(sortOrder){
      this.$store.state.sortOrder = (sortOrder[0]) ? "desc" : "asc"
      console.log(this.$store.state.sortOrder, sortOrder[0])
      if(sortOrder) this.searchPlate(this.$store.state.search, true)
    },
    sortPlate(sort) {
      console.log(sort[0])
      this.$store.state.sort = sort[0]
      this.searchPlate(this.$store.state.search, true)
    },
  },
  computed: {
    plates() {return this.$store.state.currently_in.plates},

    totalPlates() {return this.$store.state.currently_in.total_plates},
    
    totalKnown() {return this.$store.state.currently_in.total_known},
    
    totalUnknown() {return this.$store.state.currently_in.total_unknown},
    
    totalBad() {return this.$store.state.currently_in.total_bad}
  },
  created() {
    this.$store.state.search = ""
    this.getAllCurrentInPlate();

    // listen for event "newPlate" then refresh page when receive
    this.sockets.subscribe("newPlate", (data) => {
      console.log(data);
      this.getAllCurrentInPlate();
    });
  },
  
  beforeDestroy() {
    this.sockets.unsubscribe("newPlate");
  },
  mounted() {},
};
</script>
