<template lang="html">
  <div :class="'menu__button'" @click="onClick()">
    <span class="icon-menu"></span>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {

  name: 'menu-button',
  methods: {
    ...mapMutations([
      'TOGGLE_MENU',
      'CLOSE_INFO'
    ]),
    onClick () {
      console.log('click')
      this.TOGGLE_MENU()
      this.CLOSE_INFO()
    },
    getOpen () {
      return (this.menuOpen) ? '' : ''
    }
  }
}
</script>

<style lang="scss">
  @import "../assets/style/_base.scss";

  .menu__button {
    position: fixed;
    top: 10px;
    right: 10px;
    width: 50px;
    height: 50px;
    background-color: $offWhite;
    color: $lightGray;
    border: 2px solid $lightGray;
    border-radius: 2px;
    z-index: 1000;

    @media (min-width:641px) {
      display: none;
    }

    .icon-menu {
      position: absolute;
      top: 15px;
      left: 15px;
      font-size: 20px;
    }
  }
</style>
