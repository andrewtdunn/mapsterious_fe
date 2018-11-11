<template lang="html">
  <div class="map-app" @click="closePanels()">
    <GmapMap
      ref="mapRef"
      :center="center"
      :zoom="MIN_ZOOM"
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
        :icon="icon(loc)"
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
      MIN_ZOOM: 2,
      center: {lat: 41.850033, lng: -87.6500523},
      mapOptions: {disableDefaultUI: true},
      imageBucket: 'https://s3-us-west-2.amazonaws.com/andrewdunn-pictures/thumbs/images/',
      staticImageBucket: 'https://s3-us-west-2.amazonaws.com/andrewdunn-pictures/static/'
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
    setCenter (latLng) {
      this.mapRef.setCenter(latLng)
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
    },
    icon (loc) {
      if (!this.mapRef || this.zoomedOut) {
        let markerColor
        switch (loc.locationType) {
          case 'food':
            markerColor = 'gold'
            break
          case 'school':
            markerColor = 'red'
            break
          case 'rec':
            markerColor = 'green'
            break
        }
        return {url: `${this.staticImageBucket}${markerColor}_sq.png`}
      } else {
        return {url: this.imageBucket + loc.icon}
      }
    },
    icon_size (loc) {
      if (this.google.maps) {
        return this.google.maps.Size(10, 10)
      }
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
    },
    zoomedOut (newVal, oldVal) {
      console.log('newZoom', newVal)
      if (newVal) {
        this.setZoom(this.MIN_ZOOM)
        this.setCenter(this.center)
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
      'searchTerm',
      'zoomedOut'
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
