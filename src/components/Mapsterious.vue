<template lang="html">
  <div class="mapsterious">
    <map-app></map-app>
    <nav-panel></nav-panel>
    <info-panel v-if="showFeatured"></info-panel>
    <menu-button></menu-button>
  </div>
</template>

<script>
import MapApp from './Map'
import NavPanel from './Navigation'
import InfoPanel from './InfoPanel'
import MenuButton from './MenuButton'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'mapsterious',
  components: { MapApp, NavPanel, InfoPanel, MenuButton },
  data () {
    return {}
  },
  computed: {
    ...mapGetters([
      'featuredLocation'
    ]),
    showFeatured () {
      return this.featuredLocation.id !== undefined
    }
  },
  methods: {
    ...mapActions([
      'initStore'
    ])
  },
  created: function () {
    this.initStore()
  }
}
</script>

<style lang="scss">
  @import "../assets/style/_base.scss";
</style>
