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
    location_jp_to_eng: {"オタセク": "Ou Tasek", "ウィズ": "White Shop"},
    vehicle_type_jp_to_eng: {"車": "Car", "オートバイ" :"Motorbike", "バス" : "Bus"},
    status_jp_to_eng: {"出口": "Out", "ログイン": "In"},
    // reason_jp_to_eng: {"お":"a", "ね":"b", "む":"c"},
    // reason_jp_to_eng: {"お":"a", "ね":"a", "む":"a","あ":"b","い":"a","a":"d","え":"f","か":"g","き":"a","く":"a","け":"a","こ":"a","を":"a", "さ":"a","す":"f","せ":"f","そ":"f","た-と":"f","の":"f","は":"f","ひ":"f","ふ":"f","ほ":"f","ま-も":"f","や":"f","ゆ":"f","ら":"f","り":"f","る":"f"},
    kana_text : ['お', "ね","む","あ","い","う","え","か","き","く","け","こ","を" , "さ","す","せ","そ","た-と","の","は","ひ","ふ","ほ","ま-も","や","ゆ","ら","り","る"] ,
    places_name: [
      '宮城' ,
      '良野' , 
      '大宮' , 
      '鹿児島',
      '土浦' ,
      '福山' ,
      '崎馬',
      "静岡",
      "福岡",
      "福島",
      "岐阜",
      "群馬",
      "広島",
      "金沢",
      "北見",
      "高知",
      "新潟市",
      "帯広",
      "大分",
      "徳島",
      "富山",
      "宇都宮",
      "岡山",
      "札幌",
      "仙台",
      "沼津",
      "千葉",
      "山梨",
      "多摩",
      "大阪",
      "横浜",
      "前橋",
      "練馬",
      "和歌山",
      "神戸",
      "宮崎",
      "埼玉",
      "熊谷",
      "品川",
      "奈良",
      "足立",
      "京都",
      "なにわ",
      "姫路",
      "川崎",
      "野田",
      "長野"
    ],
    // organizationPlate: [
    //   {plateEN: "BANTEAY MEANCHEY", plateKH: "បន្ទាយមានជ័យ"},
    //   {plateEN: "BATTAMBANG", plateKH: "បាត់ដំបង"},
    //   {plateEN: "KAMPONG CHAM", plateKH: "កំពង់ចាម"},
    //   {plateEN: "KAMPONG CHHNANG", plateKH: "កំពង់ឆ្នាំង"},
    //   {plateEN: "KAMPONG SPEU", plateKH: "កំពង់ស្ពឺ"},
    //   {plateEN: "KAMPONG THOM", plateKH: "កំពង់ធំ"},
    //   {plateEN: "KAMPOT", plateKH: "កំពត"},
    //   {plateEN: "KANDAL", plateKH: "កណ្តាល"},
    //   {plateEN: "KEP", plateKH: "កែប"},
    //   {plateEN: "KOH KONG", plateKH: "កោះកុង"},
    //   {plateEN: "KRATIE", plateKH: "ក្រចេះ"},
    //   {plateEN: "MONDULKIRI", plateKH: "មណ្ឌលគីរី"},
    //   {plateEN: "ODDARMEANCHEY", plateKH: "ឧត្តរមានជ័យ"},
    //   {plateEN: "PAILIN", plateKH: "បៃលិន"},
    //   {plateEN: "PHNOM PENH", plateKH: "ភ្នំពេញ"},
    //   {plateEN: "PREAH SIHANOUK", plateKH: "ព្រះសីហនុ"},
    //   {plateEN: "PREAH VIHEAR", plateKH: "ព្រះវិហារ"},
    //   {plateEN: "PREY VENG", plateKH: "ព្រៃវែង"},
    //   {plateEN: "PURSAT", plateKH: "ពោធិ៍សាត់"},
    //   {plateEN: "RATANAKIRI", plateKH: "រតនគីរី"},
    //   {plateEN: "SIEM REAP", plateKH: "សៀមរាប"},
    //   {plateEN: "STUNG TRENG", plateKH: "ស្ទឹងត្រែង"},
    //   {plateEN: "SVAY RIENG", plateKH: "ស្វាយរៀង"},
    //   {plateEN: "TAKEO", plateKH: "តាកែវ"},
    //   {plateEN: "TBOUNG KHMUM", plateKH: "ត្បូងឃ្មុំ"},
    //   {plateEN: "CAMBODIA", plateKH: "កម្ពុជា"},      
    // ],
    organizationPlate: [
      {plateEN: "宮城", plateKH: "Miyagi"},
      {plateEN: "良野", plateKH: "Yoshino"},
      {plateEN: "大宮", plateKH: "Omiya"},
      {plateEN: "鹿児島", plateKH: "Kagoshima"},
      {plateEN: "土浦", plateKH: "Tsuchiura"},
      {plateEN: "福山", plateKH: "Fukuyama"},
      {plateEN: "崎馬", plateKH: "Sakima"},
      {plateEN: "静岡", plateKH: "Shizuoka"},
      {plateEN: "福岡", plateKH: "Fukuoka"},
      {plateEN: "福島", plateKH: "Fukushima"},
      {plateEN: "岐阜", plateKH: "Gifu"},
      {plateEN: "群馬", plateKH: "Gunma"},
      {plateEN: "広島", plateKH: "Hiroshima"},
      {plateEN: "金沢", plateKH: "Kanazawa"},
      {plateEN: "北見", plateKH: "Kitami"},
      {plateEN: "高知", plateKH: "Kochi"},
      {plateEN: "新潟市", plateKH: "Niigata City"},
      {plateEN: "帯広", plateKH: "Obihiro"},
      {plateEN: "大分", plateKH: "Oita"},
      {plateEN: "徳島", plateKH: "Tokushima"},
      {plateEN: "富山", plateKH: "Toyama"},
      {plateEN: "宇都宮", plateKH: "Utsunomiya"},
      {plateEN: "岡山", plateKH: "Okayama"},
      {plateEN: "札幌", plateKH: "Sapporo"},
      {plateEN: "仙台", plateKH: "Sendai"},
      {plateEN: "沼津", plateKH: "Numazu"},    
      {plateEN: "千葉", plateKH: "Chiba"},
      {plateEN: "山梨", plateKH: "Yamanashi"},
      {plateEN: "多摩", plateKH: "Tama"},
      {plateEN: "大阪", plateKH: "Osaka"},
      {plateEN: "横浜", plateKH: "Yokohama"},
      {plateEN: "前橋", plateKH: "Maebashi"},
      {plateEN: "練馬", plateKH: "Nerima"},
      {plateEN: "和歌山", plateKH: "Wakayama"},
      {plateEN: "神戸", plateKH: "Kobe"},
      {plateEN: "宮崎", plateKH: "Miyazaki"},    
      {plateEN: "埼玉", plateKH: "Saitama"},
      {plateEN: "熊谷", plateKH: "Kumagaya"},
      {plateEN: "品川", plateKH: "Shinagawa"},
      {plateEN: "奈良", plateKH: "Nara"},
      {plateEN: "足立", plateKH: "Adachi"},    
      {plateEN: "京都", plateKH: "Kyoto"},
      {plateEN: "なにわ", plateKH: "Naniwa"},
      {plateEN: "姫路", plateKH: "Himeji"},
      {plateEN: "川崎", plateKH: "Kawasaki"},
      {plateEN: "野田", plateKH: "Noda"},
      {plateEN: "長野", plateKH: "Nagano"},
       
    ],
    security: [
      // "សម្អាត",
      // "ហ៊ គឹមហី",
      // "ង៉ាវ សាន",
      // "ស្រី សុង",
      // "ផន រ៉ាន់",
      // "ផាន់ សុីណាត",
      // "ងែត សុខា",
      // "ផា សុភាព",
      // "ម៉ៅ រដ្ថា",
      // "ចិន្តា",
      // "ហុីម សុខហៀង",
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
      console.log("DATA FROM SET PLATE", data)
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
