import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const state = {
  sideWidth: '54px',
  currentPage: '1',
  foundActiveName: '0',
  inforActiveName:'0',
  bannerActiveName:'1',
  visitedViews: [],
  groupActiveName: '1'
}
const mutations = {
  ADD_VISITED_VIEWS: (state, view) => {
    if (state.visitedViews.some(v => v.path === view.path)) return
    if (state.visitedViews.some(elem => {  //处理添加与修改在同一个页面的title一样的问题
        return elem.name == view.meta.title
      })) {
      state.visitedViews.map((element, index) => {
        if (element.name == view.meta.title) {
          state.visitedViews.splice(index, 1, {
            name: view.meta.title,
            path: view.path,
          })
        }
      })
    } else {
      state.visitedViews.push({
        name: view.meta.title,
        path: view.path,
      })
    }


  },
}
const actions = {
  addVisitedViews({
    commit
  }, view) {
    commit('ADD_VISITED_VIEWS', view)
  },
}
const store = new Vuex.Store({
  state,
  mutations,
  actions
})


export default store
