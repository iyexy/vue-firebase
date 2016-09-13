<template>
<h3>>&nbsp;收藏夹&nbsp;<</h3>
<h4 v-if="nothing">暂时没有收藏任何东西!!!</h4>
    <ul v-if="!nothing" class='staritem'>
      <li v-for='item in stars'>
        <a class="title" v-bind:href="item.topicUrl">{{item.topicTitle}}</a>
        <small>{{item.auth}}</small>
        <small>{{item.topicTime}}</small>
        <button class="cancel" v-on:click="cancelstar(item.postKey)">取消收藏</button>
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
      postKey: {},
      nothing: false,
      cancelTarget: ''
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
  },
  methods: {
    cancelstar: function (postKey) {
      const ref = databaseRef('user/alreadystar/' + this.uid + '/' + postKey)
      ref.on('value', snapshot => {
        const cancelTarget = snapshot.val()
        databaseRef('userstar/' + this.uid + '/' + cancelTarget).set(null)
      })
      databaseRef('user/alreadystar/' + this.uid + '/' + postKey)
      ref.on('value', snapshot => {
        databaseRef('user/alreadystar/' + this.uid + '/' + postKey).set(null)
      })
    }
  }
}
</script>
<style scoped>
h3 {
  color: rgb(255,0,60);
}
.staritem {
  width: 100%;
  height: 100%;
  overflow: auto;
  margin: 0;
  padding: 5px;
}
.staritem li {
  list-style: none;
  text-align: left;
  position: relative;
  width: auto;
  padding: 10px 0;
  border-bottom: solid 1px #ddd;
}
.staritem small {
  color: #d7d7d7;
}
.title {
  display: block;
  height: 100%;
  margin: 5px 0 ;
  color: #000;
}
.staritem img {
  float: left;
  width: 95px;
  height: 70px;
  margin: 0 10px 0 0;
  background-color: #f7f7f7;
}
h4 {
  color: #ddd;
}
.cancel {
  position: absolute;
  right: 0;
  border: none;
  color: #00a388;
  background-color: transparent;
}
</style>
