<template>
<h3>>&nbsp;收藏夹&nbsp;<</h3>
<h4 v-if="nothing">暂时没有收藏任何东西!!!</h4>
    <ul v-if="!nothing" class='staritem'>
      <li v-for='item in stars'>
        <a class="title" v-bind:href="item.topicUrl">
        <img v-bind:src="item.topicImg" />
        <p>{{item.topicTitle}}</p>
        <span>&nbsp;{{item.topicTime}}</span>
        </a>
       <button class="cancel" v-on:click="cancelstar">取消收藏</button>
      </li>
    </ul>
</template><script>
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
  },
  methods: {
    cancelstar: function () {
    }
  }
}
</script>
<style scoped>
.staritem {
  width: 100%;
  height: 100%;
  overflow: auto;
  margin: 0;
  padding: 0 0 60px 0;
}
.staritem li {
  list-style: none;
  text-align: left;
  position: relative;
  width: auto;
  height: 80px;
  border-bottom: solid 1px #ddd;
}
.title {
  display: block;
  height: 100%;
}
.title p {
  color: rgb(255,0,60);
}
.title span {
  color: #ddd;
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
  margin-top: -90px;
  line-height: 90px;
  border: none;
  color: #00a388;
  background-color: transparent;
}
</style>
