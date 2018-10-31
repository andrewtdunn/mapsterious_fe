import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    locations: [],
    filteredLocations: [],
    featuredLocation: {},
    clickSource: '',
    filterTypes: [ 'food', 'school', 'rec' ],
    filters: [],
    searchTerm: '',
    menuOpen: false,
    infoExpanded: false,
    initialized: false
  },
  mutations: {
    'SET_STORE' (state, locations) {
      state.locations = locations
      state.filteredLocations = locations
      state.initialized = true
    },
    'SET_FEATURED_LOCATION' (state, featuredLocation) {
      state.featuredLocation = featuredLocation
    },
    'SET_VISIBLE_LOCATIONS' (state, locs) {
      state.locations.forEach(function (location) {
        if (locs.indexOf(location) > -1) {
          location.visible = true
        } else {
          location.visible = false
        }
      })
    },
    'SET_ALL_VISIBLE' (state) {
      state.locations.forEach(function (location) {
        location.visible = true
      })
    },
    'SET_CLICK_SOURCE' (state, clickSource) {
      state.clickSource = clickSource
    },
    'SET_SEARCHTERM' (state, searchTerm) {
      state.searchTerm = searchTerm.toLowerCase().trim()
    },
    'SET_FILTER' (state, locationType) {
      if (locationType === 'no filter') {
        this.commit('REMOVE_FILTERS')
        return
      }
      state.filteredLocations = state.locations.filter(function (location) {
        return location.locationType === locationType
      })
    },
    'REMOVE_FILTERS' (state) {
      state.filteredLocations = state.locations
    },
    'TOGGLE_MENU' (state) {
      state.menuOpen = !state.menuOpen
    },
    'CLOSE_MENU' (state) {
      state.menuOpen = false
    },
    'OPEN_MENU' (state) {
      state.menuOpen = true
    },
    'TOGGLE_INFO_EXPANDED' (state) {
      state.infoExpanded = !state.infoExpanded
    },
    'CLOSE_INFO' (state) {
      state.infoExpanded = false
    },
    'OPEN_INFO' (state) {
      state.infoExpanded = true
    },
    'SET_INITIALIZED' (state) {
      state.initialized = true
    }
  },
  actions: {
    initStore ({commit}) {
      axios.get(process.env.SERVER_URL + '/locations/JSON')
        .then((response) => {
          let locations = response.data.mapLocations
          for (var i = 0; i < locations.length; i++) {
            locations[i].visible = true
            locations[i].filtered = false
            locations[i].animation = 0
            locations[i].opacity = 1
          }
          commit('SET_STORE', locations)
        })
    }
  },
  getters: {
    locations (state) {
      return state.filteredLocations
    },
    featuredLocation (state) {
      return state.featuredLocation
    },
    clickSource (state) {
      return state.clickSource
    },
    filterTypes (state) {
      return state.filterTypes
    },
    searchTerm (state) {
      return state.searchTerm
    },
    menuOpen (state) {
      return state.menuOpen
    },
    infoExpanded (state) {
      return state.infoExpanded
    },
    initialized (state) {
      return state.initialized
    }

  }
})
