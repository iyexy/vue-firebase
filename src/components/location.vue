<template>
<loading v-if="loadingdata"></loading>
<ul v-if="!loadingdata" class="itemlist">
    <li v-for="item in topic">
        <img v-bind:src="item.imgurl">
        <div class="itemcontent">
            <span class="itemtitle">
      <a v-link="{ name: 'itemview', params: { id: item.id}}">
      <small>{{item.post_time}}</small>&nbsp;{{item.title}}</a>
      </span>
            <p>{{item.content.slice(0,140)}}...</p>
        </div>
    </li>
</ul>
</template>
<script>
import loading from './loading'
import {databaseRef} from '../db/fbase'
export default {
  name: 'location',
  components: {
    loading
  },
  data () {
    return {
      topic: {},
      loadingdata: true
    }
  },
  created: function () {
    databaseRef('/topicItem/').on('value', snapshot => {
      this.topic = snapshot.val()
      this.loadingdata = false
    })
  }
}
</script>
<style scoped>
ul.itemlist {
display: -webkit-flexbox;
justify-content: center;
display: flexbox;
margin: 0 auto 60px auto;
padding: 0;
border: 15px #fff solid;
}
ul.itemlist li {
  list-style: none;
  position: relative;
  margin: 0;
  background-color: #fff;
  text-align: left;   
}
.itemtitle {
  position: relative;
  display: inline-block;
  height: 30px;
  padding: 0 0 0 5px;
  margin: 0;
  line-height: 30px;
  background-color: #2e3e50;
}
.itemtitle::after {
   content: '';
    position: absolute;
    display: inline-block;
    margin: 0;
    padding: 0;
    top: 0;
    right: -30px;
    border-left: solid 15px #2c3e50;
    border-top: solid 15px transparent; 
    border-right:  15px solid transparent;
    border-bottom: 15px solid transparent;
}
.itemcontent {
  margin: 0;
  padding: 0;
  overflow:hidden; 
  text-overflow:ellipsis;
}
img {
    width: 100%;
    height: auto;
}
</style>
