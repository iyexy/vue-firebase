<template>
<h3>收藏夹</h3>
<h4 v-if="nothing">暂时没有收藏任何东西!!!</h4>
    <ul v-if="!nothing" class='staritem'>
      <li v-for="item in stars | orderBy 'topicTime' -1">
        <a class="title" v-bind:href="item.topicUrl">{{item.topicTitle}}</a>
        <small class="username">{{item.auth}}</small>
        <small>发布于{{item.topicTime | timeago}}</small>
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
<style lang="scss" scoped>
@import "../layout/variables.scss";
.staritem {
  @include box-center;
}
.staritem li {
  list-style: none;
  text-align: left;
  position: relative;
  width: auto;
  margin: 15px 0;
  small {
  color: $grey;
}
  small.username {
  color: $brand-primary;
}
}
.title {
  display: block;
  height: 100%;
  margin: 5px 0 ;
  color: $link-grey;
}
.cancel {
  position: absolute;
  right: 0;
  top: 10px;
  border: none;
  color: $brand-primary;
  background-color: transparent;
}
h4 {
  color: $grey;
}
</style>
