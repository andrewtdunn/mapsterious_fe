<template lang="html">
  <section :class="['section__wiki', isFetching]">
      <div v-if="pageThumb">
        <slide-show :images="[imageSrc]" :autoRotate="false"></slide-show>
      </div>
      <p v-html="extract" class="extract"></p>
      <p class="attribution">Powered by Wikipedia</p>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'
import jsonpAdapter from 'axios-jsonp'
import SlideShow from './SlideShow'

export default {
  name: 'wikipedia-info',
  computed: {
    ...mapGetters([
      'featuredLocation'
    ]),
    isFetching () {
      return this.fetching ? 'fetching' : ''
    }
  },
  components: { SlideShow },
  methods: {
    navigateToWiki (location) {
      // open wikiPage
    },
    countWords (str) {
      return str.split(/\s+/).length
    },
    shorten (str) {
      return str.replace(/\s+/g, ' ').split(/(?=\s)/gi).slice(0, this.EXTRACT_WORDS_LENGTH).join('') + ' ..... <a href="https://en.wikipedia.org/?curid=' + this.featuredLocation.wiki_id + '" target="blank" class="link__wiki">more</a>'
    },
    getInfo (newLoc) {
      this.fetching = true
      var self = this
      var url = 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&pageids=' + newLoc.wiki_id + '&callback=?'
      axios({url: url, adapter: jsonpAdapter}).then((res) => {
        var longExtract = res.data.query.pages[newLoc.wiki_id].extract
        if (this.countWords(longExtract) > this.EXTRACT_WORDS_LENGTH) {
          longExtract = self.shorten(longExtract)
        }
        this.extract = longExtract
      })
      var imagesUrl = 'http://en.wikipedia.org/w/api.php?action=query&titles=' + newLoc.label + '&prop=pageimages&format=json&pithumbsize=300&callback=?'
      axios({url: imagesUrl, adapter: jsonpAdapter}).then((res) => {
        self.fetching = false
        if (res.data.query.pages[newLoc.wiki_id] != null &&
            res.data.query.pages[newLoc.wiki_id].thumbnail != null) {
          self.pageThumb = true
          self.imageSrc = res.data.query.pages[newLoc.wiki_id].thumbnail.source
        } else {
          self.pageThumb = false
        }
      })
    }
  },
  data () {
    return {
      extract: '',
      EXTRACT_WORDS_LENGTH: 50,
      pageThumb: false,
      imageSrc: '',
      fetching: false
    }
  },
  watch: {
    featuredLocation (newLoc, oldLoc) {
      this.pageThumb = false
      this.getInfo(newLoc)
    }
  },
  created () {
    this.getInfo(this.featuredLocation)
  }

}
</script>

<style lang="scss">
@import "../assets/style/_base.scss";

.section__wiki{
    display:block;
    font-size: 14px;
    @include fetching;

    .extract {
      text-align: justify;
      font-family: 'Clear-Sans';
      font-size: 20px;
      margin-top: 5px;

      @media (min-width:641px) {
        font-size: 16px
      }
    }
    .link__wiki{
        display: inline;
        text-align: right;
        font-weight: bold;
        color: black;
        text-decoration: none;
        margin-left: 10px;
        cursor: pointer;
        &:hover {
            text-decoration: underline;
        }
    }
}
</style>
