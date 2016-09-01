<template>
<h2>收藏夹</h2>
<h4 v-if="nothing">暂时没有收藏任何东西!!!</h4>
    <ul v-if="!nothing" class='staritem'>
      <li v-for='item in stars'>
        <a v-bind:href="item.topicUrl">
        <img v-bind:src="item.topicImg" />
        <h3 class="title">{{item.topicTitle}}</h3></a>
        <span>&nbsp;{{item.topicTime}}</span>
        </li>
    </ul>
</template>
<script>
import loading from './loading'
import {router} from '../router'
import {onAuthStateChanged, databaseRef} from '../db/fbase'
export default {
  name: 'star',
  components: {
    loading
  },
  data () {
    return {
      stars: {},
      login: true,
      uid: '',
      nothing: false
    }
  },
  created: function () {
    onAuthStateChanged(user => {
      if (user) {
        this.uid = user.uid
        const ref = databaseRef('/userstar/' + this.uid)
        ref.on('value', snapshot => {
          if (snapshot.val() === null) {
            this.nothing = true
          } else {
            this.stars = snapshot.val()
          }
        })
      } else {
        router.go({ path: '/login' })
      }
    })
  }
}
</script>
<style scoped>
.staritem {
  width: 100%;
  height: 100%;
  overflow: auto;
  padding-bottom: 60px;
  margin: 0 auto;
}
.staritem li {
  list-style: none;
  text-align: left;
  width: auto;
  height: 75px;
  margin: 5px;
}
.staritem .title {
  color: rgb(255,0,60);
}
.staritem img {
  float: left;
  width: 75px;
  height: 75px;
  margin: 0 15px 0 0;
  background-color: #f7f7f7;
}
h4 {
  color: #ddd;
}
</style>
