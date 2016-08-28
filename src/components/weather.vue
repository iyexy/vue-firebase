<template>
<loading v-if="loadingdata"></loading>
<div id="weatherpage" v-if="!loadingdata">
    <div class='current_observation'>
        <h4>{{currenttemplate.observation_location.city}}</h4>
        <h2>{{currenttemplate.temp_c}}℃</h2>
        <h5>{{currenttemplate.weather}}</h5>
        <img v-bind:src='temp.current_observation.icon_url' />
    </div>
    <div v-for='item in simpleforecast'>
        <p>{{item.date.year}}/{{item.date.month}}/{{item.date.day}}&nbsp;&nbsp;
            <span class="right">{{item.date.weekday}}</span></p>
        <hr/>
        <h4><img v-bind:src='item.icon_url'/><span>&nbsp;&nbsp;{{item.low.celsius}}℃ ~ {{item.high.celsius}}℃</span></h4>
        <p>{{txt_forecast[$index * 2].fcttext_metric}}</p>
        <p>夜间：{{txt_forecast[$index * 2 + 1].fcttext_metric}}</p>
    </div>
</div>
</template>
<script>
import loading from './loading'
import {forecast, simpleforecast} from '../db/weatherapi'
export default {
  name: 'item',
  components: {
    loading
  },
  data () {
    return {
      loadingdata: true,
      api: {},
      temp: {},
      currenttemplate: {}
    }
  },
  created: function () {
    this.$http.jsonp(forecast).then((response) => {
      this.api = response.json()
    })
    this.$http.jsonp(simpleforecast).then((response) => {
      this.temp = response.json()
      this.loadingdata = false
    })
  },
  computed: {
    txt_forecast: function () {
      return this.api.forecast.txt_forecast.forecastday
    },
    simpleforecast: function () {
      return this.api.forecast.simpleforecast.forecastday
    },
    currenttemplate: function () {
      return this.temp.current_observation
    }
  }
}
</script>
<style>
  #weatherpage {
  text-align: left;
  color: #2c3e50;
  font-family: Source Sans Pro, Helvetica, sans-serif;
  margin: 0 auto 60px;
}
hr {
  margin-top: -5px;
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: #e0e3e9 solid 1px;
}
.current_observation {
  text-align: center;
}
</style>
