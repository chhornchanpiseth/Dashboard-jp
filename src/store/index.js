import {formatPlateTimeDate} from "../Utilities/function"
import Vue from "vue";
import Vuex from "vuex";
import { getUser, makeGetRequest , makePostRequest} from "../Utilities/backend";


Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    sort: "",
    sortOrder: "",
    search: "",
    appLanguage: localStorage.getItem("appLanguage") || process.env.VUE_APP_I18N_LOCALE || 'es',
    limit: 5,
    plate_logs: {
      type: null,
      current_page: 1,
      total_page: 0
    },
    plateByDate: {
      type: null,
      current_page: 1,
      plates: null,
    },
    searchedPlateByDate: {
      type: null,
      current_page: 1,
      plates: [],
      total_plates: 0,
      typePlates: [],
      total_unknown: 0,
      total_known: 0,
      total_bad: 0,
    },
    currently_in: {
      type: null,
      current_page: 1,
      total_page: 0
    },
    user: {
      username: null,
      password: null,
      error: false,
    },
    location_kh_to_eng: {"អូតាសេក": "Ou Tasek", "វ៉ាយហ្សប": "White Shop"},
    vehicle_type_kh_to_eng: {"ឡាន": "Car", "ម៉ូតូ" :"Motorbike", "ឡានក្រុង" : "Bus"},
    status_kh_to_eng: {"ចេញ": "Out", "ចូល": "In"},
    reason_kh_to_eng: {"ចូលលេង":"Visit", "ឆ្លងកាត់":"Pass By", "ស្នាក់នៅ":"Stay"},
    organizationPlate: [
      {plateEN: "BANTEAY MEANCHEY", plateKH: "បន្ទាយមានជ័យ"},
      {plateEN: "BATTAMBANG", plateKH: "បាត់ដំបង"},
      {plateEN: "KAMPONG CHAM", plateKH: "កំពង់ចាម"},
      {plateEN: "KAMPONG CHHNANG", plateKH: "កំពង់ឆ្នាំង"},
      {plateEN: "KAMPONG SPEU", plateKH: "កំពង់ស្ពឺ"},
      {plateEN: "KAMPONG THOM", plateKH: "កំពង់ធំ"},
      {plateEN: "KAMPOT", plateKH: "កំពត"},
      {plateEN: "KANDAL", plateKH: "កណ្តាល"},
      {plateEN: "KEP", plateKH: "កែប"},
      {plateEN: "KOH KONG", plateKH: "កោះកុង"},
      {plateEN: "KRATIE", plateKH: "ក្រចេះ"},
      {plateEN: "MONDULKIRI", plateKH: "មណ្ឌលគីរី"},
      {plateEN: "ODDARMEANCHEY", plateKH: "ឧត្តរមានជ័យ"},
      {plateEN: "PAILIN", plateKH: "បៃលិន"},
      {plateEN: "PHNOM PENH", plateKH: "ភ្នំពេញ"},
      {plateEN: "PREAH SIHANOUK", plateKH: "ព្រះសីហនុ"},
      {plateEN: "PREAH VIHEAR", plateKH: "ព្រះវិហារ"},
      {plateEN: "PREY VENG", plateKH: "ព្រៃវែង"},
      {plateEN: "PURSAT", plateKH: "ពោធិ៍សាត់"},
      {plateEN: "RATANAKIRI", plateKH: "រតនគីរី"},
      {plateEN: "SIEM REAP", plateKH: "សៀមរាប"},
      {plateEN: "STUNG TRENG", plateKH: "ស្ទឹងត្រែង"},
      {plateEN: "SVAY RIENG", plateKH: "ស្វាយរៀង"},
      {plateEN: "TAKEO", plateKH: "តាកែវ"},
      {plateEN: "TBOUNG KHMUM", plateKH: "ត្បូងឃ្មុំ"},
      {plateEN: "CAMBODIA", plateKH: "កម្ពុជា"},      
    ],
    security: [
      "សម្អាត",
      "ហ៊ គឹមហី",
      "ង៉ាវ សាន",
      "ស្រី សុង",
      "ផន រ៉ាន់",
      "ផាន់ សុីណាត",
      "ងែត សុខា",
      "ផា សុភាព",
      "ម៉ៅ រដ្ថា",
      "ចិន្តា",
      "ហុីម សុខហៀង",
    ],
    location: [
      "Ou Tasek",
      "White Shop"
    ],
    imageURL: {
      "Ou Tasek(In)": "http://10.2.7.51",
      "Ou Tasek(Out)": "http://10.2.7.50",
      "White Shop(In)": "http://10.2.7.17",
      "White Shop(Out)": "http://10.2.7.52",
    }
  },
  getters: {
    getAppLanguage: (state) => state.appLanguage,
    getPlateByDate: (state) => {
      return state.plateByDate
    },
    // getPage: (state, collection) => {
    //   console.log(collection)
    //   return state[collection].current_page
    // }
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    setPlate(state, {data, collection}) {
      state[collection] = data
    },
    setPage(state, {page, collection}) {
      state[collection].current_page = page
    },
    setType(state, {type, collection}) {
      state[collection].type = type
    },
    setPlateByDate(state, data) {
      state.plateByDate.plates = data
    },
    setTotalPlateByDate(state, {data, type}) {
      state.plateByDate[data] = type ? state.plateByDate.plates.filter(plate => plate.type === type).length
      : state.plateByDate.plates.length
    }
  },
  actions: {
    async setUser({ commit }) {
      // console.log("Hello, world!");
      const user = await getUser();
      commit("SET_USER", user);
    },
    async setPlate(context, {search, collection}) {
      let query_url = `/${collection}?page=${context.state[collection].current_page}&limit=${context.state.limit}`
      if(context.state[collection].type) query_url += `&type=${context.state[collection].type}`
      if(search) query_url += `&search=${search}`
      if(context.state.sort=='date') context.state.sort = "time"
      if(context.state.sort) query_url += `&sortBy=${context.state.sort}:${context.state.sortOrder}`
      const data = await makeGetRequest(query_url)
      context.commit('setPlate', {data, collection})
      formatPlateTimeDate(context.state[collection].plates)
    },
    async setPlateByDate(context, body) {
      const data = await makePostRequest("/plate_logs/date", body)
      context.commit('setPlateByDate', data)
      context.commit('setTotalPlateByDate', {data: 'total_plates'})
      context.commit('setTotalPlateByDate', {data: 'total_known', type: 'known'})
      context.commit('setTotalPlateByDate', {data: 'total_unknown', type: 'unknown'})
      context.commit('setTotalPlateByDate', {data: 'total_bad', type: 'bad'})
      formatPlateTimeDate(context.state.plateByDate.plates)
    }
  },
  modules: {},
});
