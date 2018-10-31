<template lang="html">
  <div :class="['nav__map', isMenuOpen]">
      <div class="navholder">
        <div class="nav__adminbtns">
          <div class="nav__adminbtn" @click="linkAdmin()">Admin</div>
          <div class="nav__menuTypeBtn" @click="changeMenuType">
            <span :class="[getMenuButtonType, 'nav__buttonIcons']"></span>
          </div>
        </div>
        <div class="nav__select-filters">
          <select class="nav__select-filters-inner select-button-inner" @change="filterByType()" v-model="sortFilter">
            <option value="no filter" selected="selected">no filter</option>
            <option v-for="(filter, n) in filterTypes" v-bind:key="n">{{filter}}</option>
          </select>
          <div class="icon-filter nav__buttonIcons"></div>
          <div :class="isFilterActive + ' icon-cross-holder'" @click="sortFilter='no filter'">
            <div class="icon-cross"></div>
          </div>
        </div>
        <div class="nav__input">
          <input class="nav__input-inner" v-model="searchTerm" autofocus />
          <div class="icon-search nav__buttonIcons"></div>
          <div :class="isSearchActive + ' icon-cross-holder'" @click="searchTerm = ''">
            <div class="icon-cross"></div>
          </div>
        </div>

        <ul v-if="showIconButtons" :class="[isInitialized(),'list-grid']">
            <li v-for="(loc, n) in locations" v-bind:key="n" :class="[loc.locationType, isFeatured(loc)]" :model="loc" @click="onClick(loc)" v-if="checkSearch(loc.menuLabel.toLowerCase(),loc.label.toLowerCase())">
              <div class="image-holder">
                <img :src="'https://s3-us-west-2.amazonaws.com/andrewdunn-pictures/thumbs/images/' + loc.icon" />
              </div>
            </li>
        </ul>
        <ul v-else :class="isInitialized()">
            <li v-for="(loc, n) in locations" v-bind:key="n" :class="[loc.locationType,checkLength(loc.menuLabel), isFeatured(loc)]" :model="loc" @click="onClick(loc)" v-if="checkSearch(loc.menuLabel.toLowerCase(),loc.label.toLowerCase())">{{loc.menuLabel}}</li>
        </ul>

      </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'nav-panel',
  data () {
    return {
      searchTerm: '',
      sortFilter: 'no filter',
      showIconButtons: true
    }
  },
  methods: {
    ...mapMutations([
      'SET_FEATURED_LOCATION',
      'SET_CLICK_SOURCE',
      'SET_FILTER',
      'SET_SEARCHTERM',
      'CLOSE_INFO',
      'CLOSE_MENU'
    ]),
    onClick (loc) {
      this.SET_FEATURED_LOCATION(loc)
      this.SET_CLICK_SOURCE('nav')
      this.CLOSE_INFO()
      this.CLOSE_MENU()
    },
    filterByType () {
      this.SET_FILTER(this.sortFilter)
    },
    checkSearch (menuLabel, label) {
      if (this.searchTerm === '') {
        return true
      } else {
        return (label.indexOf(this.searchTerm.toLowerCase().trim()) !== -1 || menuLabel.indexOf(this.searchTerm.toLowerCase().trim()) !== -1)
      }
    },
    linkAdmin () {
      window.location.href = process.env.SERVER_URL
    },
    checkLength (inputString) {
      const wordArray = inputString.split(' ')
      const longestWord = wordArray.reduce((a, b) => {
        return (b.length > a.length) ? b : a
      })
      if (longestWord.length > 12) {
        return 'nav--header-too_long'
      }
    },
    isFeatured (loc) {
      return (loc === this.featuredLocation) ? 'active' : ''
    },
    isInitialized () {
      return (this.initialized) ? 'ready' : ''
    },
    changeMenuType () {
      this.showIconButtons = !this.showIconButtons
    }
  },
  watch: {
    searchTerm (newTerm, oldTerm) {
      this.SET_SEARCHTERM(newTerm)
    },
    sortFilter (newTerm, oldTerm) {
      this.SET_FILTER(newTerm)
    }
  },
  computed: {
    ...mapGetters([
      'featuredLocation',
      'locations',
      'filterTypes',
      'menuOpen',
      'initialized'
    ]),
    isFilterActive () {
      if (this.sortFilter !== 'no filter') {
        return 'active'
      } else {
        return ''
      }
    },
    isSearchActive () {
      if (this.searchTerm !== '') {
        return 'active'
      } else {
        return ''
      }
    },
    isMenuOpen () {
      return (this.menuOpen) ? 'expanded' : ''
    },
    isMenuIcons () {
      return (this.showIconButtons) ? 'imageType' : 'textType'
    },
    getMenuButtonType () {
      return (this.showIconButtons) ? 'icon-image' : 'icon-text-color'
    },
    listType () {
      return (this.showIconButtons) ? 'list-grid' : ''
    }

  }
}
</script>

<style lang="scss">
@import "../assets/style/_base.scss";

.nav__map {
    position: absolute;
    top: 0px;
    left: -250px;
    height: 100vh;
    z-index: 2000;
    font-family: EurostileLT-BoldExtendedTwo;
    transition: left .4s ease-in;
    overflow-y: hidden;

    &.expanded {
      left: 10px;
    }
    @media (min-width:641px) {
      left: 10px;
    }

    .navholder {

      input {
        display: block;
        margin-top: 10px;
      }
      ul {
        margin-inline-start: 0px;
        margin-left: 0px;
        margin-block-start: 0px;
        padding-inline-start: 0px;
        margin-top: 118px;
        height: 100%;
        overflow: scroll;
        position: relative;
        height: calc(100vh - 154px;);
        opacity: 0;
        top: -800;
        transition: all 1s ease;
        width: 240px;

        &.list-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          grid-column-gap: 10px;
          grid-row-gap: 10px;
          grid-auto-rows: min-content;

          li {
            width: 100%;
            height: 80px;
            text-align: center;
            padding: 0px;
            margin-top: 0px;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-flow: column;

            &:before {
              display: block;
              margin-top: -8px;
              margin-right: -4px;
              margin-bottom: 2px;
            }

            .image-holder {
              display: block;
              width: 50px;
              height: 50px;
              img {
                height: 100%;
                width: 100%;
                object-fit: contain;
              }
            }
          }
        }

        &.ready {
          opacity: 1;
          top: 0px;
        }

        li {
          &.nav--header-too_long {
            word-break: break-all;
            hyphens: auto;
          }
          &:first-of-type {
            margin-top: 0px;
          }

          &:last-of-type {
            margin-bottom: 100px;
          }
        }
      }
      li,
      .nav__adminbtn,
      .nav__select-filters,
      input.nav__input,
      .nav__menuTypeBtn {
          @include three_d;
          box-sizing: border-box;
          letter-spacing: 2px;
          background-color: $offWhite;
          background-image: url('../assets/style/grid.png');
          margin-top: 10px;
          width: 240px;
          font-size: 20px;
          border: 2px solid gray;
          padding: 10px 10px;
          cursor: pointer;
          list-style: none;
          font-size: 0.9em;
          line-height: 1.3em;
          text-align: left;
          margin-left: 0px;
          transition: background-color .3s ease;
          border-radius: 0px;

          &:hover{
            background: $overState;
          }

          &:before {
            text-shadow: none;
          }

          &.active{
            background: $overState;
            &:before {
              @include lightup;
            }

          }

          &.food{
              //border-color: purple;
              &:before{
                  color: $gold;
              }
          }

          &.school{
              //border-color: $basicBlue;
              &:before{
                  color: $offRed;
              }

          }

          &.rec{
             // border-color: green;
              &:before{
                  color: $green;
              }

          }

          &.rec,
          &.school,
          &.food{
              &:before{
                  content: "■ ";
                  font-family:"Arial";

              }
          }

      }
      .nav__input {
        margin-top: 64px;

        .nav__input-inner {
          @include three_d;
          box-sizing: border-box;
          width: 80%;
          height: 50px;
          padding: 5px;
          font-size: 16px;
        }
      }
      .nav__select-filters,
      .nav__input{
        padding: 0px;
        position: relative;
        border: none;

        .select-button-inner,
        .nav__input-inner {
          position: absolute;
          top: 0px;
          left: 0px;
          z-index: 100;
          margin-top: 0px;
          background: $offWhite;
          background-image: url('../assets/style/grid.png');
          border: 2px solid gray;
          outline: none;
          padding-left: 30px;
          height: 45px;
        }
        .nav__buttonIcons {
          color: $iconGray;
          position: absolute;
          top: 15px;
          left: 11px;
          z-index: 200;
          width: 30px;
          pointer-events: none;
          text-shadow: none;
        }
        .icon-search {
          top: 17px;
          left: 3px;
        }
        .nav__select-filters-inner {
          padding: 10px;
          border: 2px solid gray;
          width: 80%;
          padding-left: 30px;
          font-size: 15px;
          &:hover {
            cursor: pointer;
          }
        }
      }

      input.nav__input {
        margin-top: 65px;
        outline: none;
        &:focus {
          outline: none;
        }
      }

      .icon-cross-holder{
        box-sizing: border-box;
        position: absolute;
        left: 80%;
        width: 20%;
        height: 45px;
        background-color: $almostOffWhite;
        border: 2px solid gray;
        border-left: none;
        transition: background-color .2s ease-in;
        &:hover {
          cursor: default;
        }

        &.active {
          background-color: $offRed;
          &:hover {
            cursor: pointer;
            background-color: $deepRed;
          }
        }

        .icon-cross {
          position: absolute;
          text-shadow: none;
          font-size: 18px;
          color: $offWhite;
          left: 14px;
          top: 12px;
        }
      }

      .nav__adminbtns,
      .nav__select-filters-inner {
        @include three_d;
        -webkit-appearance: none;
        outline: none;
        border-radius: 0;
      }

      .nav__adminbtn{
        width: 80%;
      }

      .nav__adminbtns{
        box-sizing: border-box;
        display: flex;
        width: 100%;
      }

      .nav__menuTypeBtn {
        width: 20%;
        margin-left: 2px;
        text-shadow: none;
        text-align: center;
        padding: 0px;
        position: relative;

        span {
          position: absolute;
          top: 8px;
          left: 12px;
          font-size: 20px;
          color: $deepPurple;
        }

        &:hover {
          span {
            filter: brightness(1.5);
          }
        }
      }
    }
}
</style>
