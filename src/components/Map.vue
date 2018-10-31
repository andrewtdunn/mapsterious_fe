<template lang="html">
  <div class="map-app" @click="closePanels()">
    <GmapMap
      ref="mapRef"
      :center="center"
      :zoom="NORMAL_ZOOM_DISTANCE"
      map-type-id="satellite"
      style="width: 100%; height: 100%;"
      :options="mapOptions"
    >
      <GmapMarker
        :key="'marker-'+ loc.id"
        :ref="'marker-'+ loc.id"
        v-for="loc in locations"
        :position="loc.position"
        :clickable="true"
        :draggable="false"
        :animation="loc.animation"
        :opacity="loc.opacity"

        :visible="loc.visible && checkSearch(loc.menuLabel.toLowerCase().trim(),loc.label.toLowerCase().trim())"
        :icon="'https://s3-us-west-2.amazonaws.com/andrewdunn-pictures/thumbs/images/' + loc.icon"
        @click="onClick(loc)"
      />
    </GmapMap>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import EasingAnimator from '../js/helpers/easing_animator'
import getZoom from '../js/helpers/get_zoom'
import {gmapApi} from 'vue2-google-maps'

var APP_LOG_LIFECYCLE_EVENTS = false

export default {
  name: 'map-app',
  components: {},
  data () {
    return {
      title: 'ft greene map',
      NORMAL_ZOOM_DISTANCE: 16,
      ZOOM_IN_DISTANCE: 18,
      center: {lat: 40.688885, lng: -73.977042},
      mapOptions: {disableDefaultUI: true}
    }
  },
  methods: {
    ...mapMutations([
      'SET_FEATURED_LOCATION',
      'SET_ALL_VISIBLE',
      'SET_VISIBLE_LOCATIONS',
      'SET_CLICK_SOURCE',
      'CLOSE_INFO',
      'CLOSE_MENU',
      'OPEN_INFO'
    ]),
    getCenter () {
      var centerObj = {
        'lat': this.mapRef.center.lat(),
        'lng': this.mapRef.center.lng()
      }
      return centerObj
    },
    setZoom (level) {
      this.mapRef.setZoom(level)
    },
    onClick (loc) {
      this.SET_FEATURED_LOCATION(loc)
      this.SET_CLICK_SOURCE('map')
    },
    checkSearch (menuLabel, label) {
      if (this.searchTerm === '') {
        return true
      } else {
        return (menuLabel.indexOf(this.searchTerm) !== -1 || label.indexOf(this.searchTerm) !== -1)
      }
    },
    closePanels () {
      this.CLOSE_INFO()
      this.CLOSE_MENU()
    }
  },
  watch: {
    featuredLocation (newLoc, oldLoc) {
      if (this.clickSource === 'map') {
        newLoc.animation = 1
        setTimeout(function () {
          newLoc.animation = null
        }, 700)
      } else {
        var center = this.getCenter()
        var newPosition = newLoc.position
        this.SET_VISIBLE_LOCATIONS([oldLoc, newLoc])
        var zoomOutLevel = getZoom(center, newPosition)
        this.setZoom(zoomOutLevel)
        let newPt = { lat: newLoc.position.lat, lng: newLoc.position.lng }
        var self = this
        setTimeout(function () {
          self.easingAnimator.easeProp(center, newPt)
        }, 700)
        setTimeout(function () {
          newLoc.animation = this.google.maps.Animation.BOUNCE
          setTimeout(function () {
            newLoc.animation = null
            self.setZoom(self.ZOOM_IN_DISTANCE)
            self.SET_ALL_VISIBLE()
          }, 700)
          setTimeout(function () {
            self.OPEN_INFO()
          }, 2000)
        }, 1500)
      }
    }
  },
  beforeUpdate () {
    if (APP_LOG_LIFECYCLE_EVENTS) {
      console.log('Before Update')
    }
  },
  computed: {
    ...mapGetters([
      'locations',
      'featuredLocation',
      'clickSource',
      'searchTerm'
    ]),
    markers () {
      return this.mapRef.markers
    },
    google () {
      return gmapApi
    }
  },
  mounted: function () {
    this.$refs.mapRef.$mapPromise.then((mapRef) => {
      this.mapRef = mapRef
      this.easingAnimator = EasingAnimator.makeFromCallback(function (latLng) { mapRef.setCenter(latLng) })
    })
  }
}
</script>

<style lang="scss">

  .map-app {
    position:fixed;
    width:100%;
    height:100%;
    top:0px;
    left:0px;
    z-index:1000;
  }
</style>
