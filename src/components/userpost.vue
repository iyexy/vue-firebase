<template>
<h3>>&nbsp;我的话题&nbsp;<</h3>
<h4 v-if="!nothing">未创建任何话题!!!</h4>
<loading v-if="loading"></loading>
<ul v-if="nothing" class="postitem">
    <li v-for="item in userpost | orderBy 'posttime' -1">
        <a href='#/latest/{{item.url}}' class="title">{{item.title}}</a>
        <small class="username">{{uid}}</small>
        <small>发布于{{item.posttime | timeago}}</small>
    </li>
</ul>
</template>
<script>
import loading from './loading'
import {onAuthStateChanged, databaseRef} from '../db/fbase'
export default {
  name: 'userpost',
  components: {
    loading
  },
  data () {
    return {
      userpost: {},
      nothing: true,
      uid: '',
      loading: true
    }
  },
  created: function () {
    onAuthStateChanged(user => {
      if (user) {
        this.uid = user.displayName
        this.username = user.name
        databaseRef('user/post/' + user.uid).on('value', snapshot => {
          this.userpost = snapshot.val()
          this.loading = false
          if (this.userpost === null) {
            this.nothing = false
          }
        })
      }
    })
  }
}
</script>
<style scoped>
h3 {
  color: rgb(255,0,60);
}
.postitem {
  width: 100%;
  height: 100%;
  overflow: auto;
  margin: 0;
  padding: 5px;
}
.postitem li {
  list-style: none;
  text-align: left;
  position: relative;
  width: auto;
  padding: 10px 0;
  border-bottom: solid 1px #ddd;
}
.postitem small {
  color: #d7d7d7;
}
.title {
  display: block;
  height: 100%;
  margin: 5px 0 ;
  color: #000;
}
h4 {
  color: #ddd;
}
.postitem small.username {
  color: #00a388;
}    
</style>