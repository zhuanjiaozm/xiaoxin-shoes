import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    list1: [],
    errorList1: [],
    web1Data: [],
    allDataToUpdatePrice: []
  },
  getters: {
    getList1: state => state.list1,
    getErrorList1: state => state.errorList1,
  },
  mutations: {
    setList1(state, list1) {
      state.list1 = list1
    },
    setErrorList1(state, errorList1) {
      state.errorList1 = errorList1
    },
    setWeb1Data(state, web1Data) {
      state.web1Data = web1Data
    },
    setAllDataToUpdatePrice(state, allDataToUpdatePrice) {
      state.allDataToUpdatePrice = allDataToUpdatePrice;
    }
  },
  actions: {},
  modules: {},
});
