<template lang="html">
    <aside :class="['aside__info_panel', backgrounded]" @click="onTap()">
      <article class="aside__detail" :class="featuredLocation.locationType">
          <hgroup>
              <h2 :class="checkLength(featuredLocation.label)" v-html="decode(featuredLocation.label)"></h2>
              <div class="nav__imageholder">
                <img :src="'https://s3-us-west-2.amazonaws.com/andrewdunn-pictures/thumbs/images/' + featuredLocation.icon"/>
              </div>
          </hgroup>
          <div :class="['content', isExpanded]">
            <yelp-info v-if="featuredLocation.locationType == 'food'"></yelp-info>
            <wikipedia-info v-else></wikipedia-info>
          </div>
      </article>

  </aside>
</template>

<script>
import YelpInfo from './YelpInfo'
import WikipediaInfo from './WikipediaInfo'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'info-panel',
  components: { YelpInfo, WikipediaInfo },
  computed: {
    ...mapGetters([
      'featuredLocation',
      'infoExpanded',
      'menuOpen'
    ]),
    isExpanded () {
      return (this.infoExpanded) ? 'expanded' : ''
    },
    backgrounded () {
      return (this.menuOpen) ? 'background' : ''
    }
  },
  methods: {
    ...mapMutations([
      'TOGGLE_INFO_EXPANDED'
    ]),
    checkLength (inputString) {
      const wordArray = inputString.split(' ')
      const longestWord = wordArray.reduce((a, b) => {
        return (b.length > a.length) ? b : a
      })
      if (longestWord.length > 12) {
        return 'aside--header-too_long'
      }
      if (longestWord.length > 10) {
        return 'aside--header-longest'
      } else if (longestWord.length > 8) {
        return 'aside--header-long'
      } else {
        return ''
      }
    },
    onTap () {
      this.TOGGLE_INFO_EXPANDED()
    },
    decode (URI) {
      return URI.replace('%26', '&')
    }
  }
}
</script>

<style lang="scss">
@import "../assets/style/_base.scss";

    .aside__info_panel{
        box-sizing: border-box;
        position: fixed;
        bottom: 10px;
        z-index: 1002;
        width: calc(100% - 20px);
        margin: 10px;
        transition: opacity .3s ease;

        &.background {
          opacity: 0;
        }

        @media (min-width:641px) {
          top: 5px;
          right: 5px;
          width: 320px;
        }

        .aside__detail{
            position:relative;
            background: $offWhite;
            background-image: url('../assets/style/grid.png');
            padding: 10px;
            max-width: 100%;
            box-sizing: border-box;
            border-width: 4px;
            border-style: solid;
            border-color: orange;
            overflow: hidden;

            hgroup {
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: flex-end;
              word-wrap:break-word;

              h2 {
                display: inline;
                font-size: 1.2em;

                &.aside--header-long {
                  @media (min-width:641px) {
                    font-size: 0.9em;
                  }
                }

                &.aside--header-longest {
                  @media (min-width:641px) {
                    font-size: 0.8em;
                  }
                }

                &.aside--header-too_long {
                  word-break: break-all;
                  hyphens: auto;
                  @media (min-width:641px) {
                    font-size: 0.8em;
                  }
                }

                @media (min-width:641px) {
                  font-size: 1.1em;
                }

              }
              .nav__imageholder {
                width: 100px;
                height: 100px;
                margin-left: 10px;
                display: flex;
                align-items: center;
                justify-content: center;

                img {
                  width: 100%;
                  height: 100%;
                  object-fit: contain;
                }

              }
            }

            .content {
              max-height: 0px;
              opacity: 0;
              transition: all .9s ease;

              @media (min-width:641px) {
                opacity: 1;
                max-height: 2000px;
              }

              &.expanded {
                max-height: 2000px;
                opacity: 1;
              }

              @media (min-width:641px) {
                display: block;
              }
            }

            &.food{
                border-color: $gold;
             }

            &.rec{
                border-color: $green;
            }

            &.school{
                border-color: $offRed;
            }

            h2 {
                @include three_d;
                font-size: 20px;
                padding-bottom: 0;
                margin-bottom: 0;
                letter-spacing: 3px;
                text-align: right;
            }

        }

        .attribution{
            font-style: italic;
            font-size: 12px;
            color: $lightGray;
            text-align: left;
            margin-top: 10px;
            display: none;

            &.expanded {
              display: block;
            }

            @media (min-width:641px) {
              display: block;
            }
        }

    }

</style>
