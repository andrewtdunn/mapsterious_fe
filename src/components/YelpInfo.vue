<template lang="html">
  <section :class="['section__yelp',isFetching]">

      <slide-show :images="images" :speed="3000" :autoRotate="true"></slide-show>
      <span class="stars" v-html="rating"></span>
      <p class="review-snippet">{{snippet}}</p>
      <p class="reviewer">{{reviewer}}</p>
      <a class="num-reviews" :href="url" target="blank">{{numReviews}}</a>
      <hr>
      <!-- <img id="snippet_image" src="" alt="test" data-bind="attr: {src: snippet_image_url}"> -->
      <div class="contact-info">
          <span>{{displayPhone}}</span> | <span>{{address}}</span><span>{{crossStreets}}</span> | <span>{{city}}, {{state}}</span>
      </div>
      <p class="attribution">Powered by Yelp</p>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'
import SlideShow from './SlideShow'

export default {
  name: 'yelp-info',
  props: ['location'],
  computed: {
    ...mapGetters([
      'featuredLocation'
    ]),
    rating () {
      if (this.numStars < 1 || this.numStars > 5) {
        return ''
      } else {
        let wholeStars = parseInt(this.numStars, 10)
        let halfStars = (this.numStars % 1 > 0) ? 1 : 0
        let emptyStars = parseInt(5 - (wholeStars + halfStars), 10)
        let starString = ''
        for (let i = 0; i < wholeStars; i++) {
          starString += '<span class="icon-star-full"></span>'
        }
        for (let i = 0; i < halfStars; i++) {
          starString += '<span class="icon-star-half"></span>'
        }
        for (let i = 0; i < emptyStars; i++) {
          starString += '<span class="icon-star-empty"></span>'
        }
        return starString
      }
    },
    isFetching () {
      return (this.fetching) ? 'fetching' : ''
    }
  },
  components: { SlideShow },
  data () {
    return {
      snippet: '',
      reviewer: '',
      numReviews: '',
      displayPhone: '',
      address: '',
      crossStreets: '',
      imageSrc: '',
      images: [],
      city: '',
      state: '',
      numStars: 0,
      url: '',
      fetching: false
    }
  },
  methods: {
    getInfo (loc) {
      this.fetching = true
      axios.get(process.env.SERVER_URL + '/yelp/' + loc.yelp_id + '/JSON')
        .then((response) => {
          this.fetching = false
          let info = response.data
          this.snippet = info.review_list.reviews[0].text
          this.reviewer = info.review_list.reviews[0].user.name
          this.numReviews = info.review_count
          this.displayPhone = info.display_phone
          this.address = info.location.address1
          if (info.location.cross_streets.length > 0) {
            this.crossStreets = ' b/w ' + info.location.cross_streets
          }
          this.city = info.location.city
          this.state = info.location.state
          this.imageSrc = info.photos[1]
          this.images = info.photos
          this.url = info.url
          this.numStars = info.rating
        })
    }
  },
  created () {
    this.getInfo(this.featuredLocation)
  },
  watch: {
    featuredLocation (newLoc, oldLoc) {
      this.getInfo(newLoc)
    }
  }
}
</script>

<style lang="scss">
  @import "../assets/style/_base.scss";
  .section__yelp {
    font-family: 'Clear-Sans';
    @include fetching;

    hr {
        border: 0;
        height: 0; /* Firefox... */
        box-shadow: 0 0 1px 1px $offBlack;
        display: none;
        margin-bottom: 10px;
    }
    hr:after {  /* Not really supposed to work, but does */
        content: "\00a0";  /* Prevent margin collapse */
    }

    .location-image {
      height: 200px;
      width: auto;
      margin: 0 auto;
    }

    a {
      color: $offBlack;
    }

    .stars {
      @include three_d;
      color: $lightestGray;
      display: block;
      font-size: 24px;
      margin: 5px auto;
      margin-right: -10px;

      .icon-star-full,
      .icon-star-half,
      .icon-star-empty {
        margin-right: 10px;
      }
    }

    .review-snippet{
     font-size: 18px;
     font-style: italic;
     margin: 5px auto;

     @media (min-width:641px) {
       font-size: 18px;
     }

     &:before, &:after{
         content: '"';
     }
    }

    .reviewer{
         text-align: right;
         font-size: 18px;
         margin-top: 8px;
         margin-bottom: 4px;

         &:before{
             content: "- "
         }

         @media (min-width:641px) {
           font-size: 14px;
         }
    }

    .num-reviews{
         display: block;
         text-align: right;
         font-size: 16px;
         font-weight: bold;
         text-decoration: none;
         margin-bottom: 10px;
         cursor: pointer;

         @media (min-width:641px) {
           font-size: 12px;
           margin-bottom: 5px;
         }

         &:after{
             content: " reviews"
         }

         &:hover{
             text-decoration: underline;
         }
    }

    .contact-info{
         font-size: 18px;
         text-align: right;

         @media (min-width:641px) {
           font-size: 14px;
         }
    }
  }

</style>
