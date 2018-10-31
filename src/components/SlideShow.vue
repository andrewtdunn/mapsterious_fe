<template lang="html">
  <div class="slide-show-holder">
    <div class="background">

    </div>
    <div class="slide-show">
      <img class="slide"
           v-for="(image, n) in images"
           :src="image"
           v-bind:key="n"
           v-if="currentSlide === n"
           />
    </div>
  </div>

</template>

<script>
export default {
  name: 'slide-show',
  props: ['images', 'speed', 'autoRotate'],
  data () {
    return {
      currentIndex: 0
    }
  },
  computed: {
    currentSlide () {
      return this.currentIndex % 3
    }
  },
  methods: {
    startSlides () {
      if (!this.autoRotate) {
        return
      }
      var self = this
      this.interval = setInterval(function () {
        self.currentIndex++
      }, this.speed)
    }
  },
  created () {
    if (!this.autoRotate) {
      return
    }

    clearInterval(this.interval)
    this.startSlides()
  }
}
</script>

<style lang="scss">
  @import "../assets/style/_base.scss";

  .slide-show-holder {
    position: relative;
    min-height: 200px;
    .background {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 200px;
      background-color: $blackOverlay;
    }
    .slide-show {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 200px;
      vertical-align: middle;
      display: table-cell;
      padding: 0;

      .slide {
        display: inline-block;
        height: 100%;
        width: 100%;
        object-fit: contain;
        margin: 0 auto;
        max-width: 100%;
      }
    }
  }

</style>
