<template>
<h3>>&nbsp;创建话题&nbsp;<</h3>
<div class="chatwrap">
    <div class="userinfo">
        <span v-show="useravatar">
        <img v-bind:src="avatarurl"></span>
        <small class="username">{{username}}</small>
    </div>
    <div class="postcontent">
        <input type="text" name="title" v-model="title" placeholder="标题">
        <textarea class="post_content" v-model="newpost" placeholder="编辑内容..."></textarea>
        <button class="addcontent" v-on:click='postcontent'>{{post}}</button>
        <span class="nullWarning" v-if='message'>* 标题和内容都是必要的</span>
    </div>
<div>
</template>
<script>
import {router} from '../router'
import {onAuthStateChanged, databaseRef} from '../db/fbase'
export default {
  name: 'addpost',
  data () {
    return {
      login: true,
      uid: '',
      useravatar: false,
      username: '',
      title: '',
      newpost: '',
      message: false,
      post: '去登录',
      newposts: '',
      count: {},
      avatarurl: {},
      defaultavatar: 'http://od62mnpbe.bkt.clouddn.com/default.png'
    }
  },
  created: function () {
    onAuthStateChanged(user => {
      if (user) {
        // user name
        this.username = user.displayName || user.email.slice(0, user.email.indexOf('@'))
        this.uid = user.uid
        // user avatar
        databaseRef('user/avatar/' + this.uid + '/avatarurl/').on('value', snapshot => {
          this.avatarurl = snapshot.val()
          if (this.avatarurl === null) {
            this.avatarurl = this.defaultavatar
          }
          this.useravatar = true
        })
        this.post = '发布'
      } else {
        this.useravatar = false
      }
    })
  },
  methods: {
    // post
    postcontent: function () {
      const ref = databaseRef().child('/newpost/topic/')
      const getTime = () => {
        const today = new Date()
        const date = today.getDate()
        const hour = today.getHours()
        let month = today.getMonth() + 1
        let minute = today.getMinutes()
        const checkTime = (i) => {
          if (i < 10) {
            i = '0' + i
          }
          return i
        }
        month = checkTime(month)
        minute = checkTime(minute)
        const time = month + '/' + date + ' ' + hour + ':' + minute
        return time
      }
      this.posttime = getTime()
      const newPostKey = ref.push().key
      const message = {
        name: this.username,
        title: this.title,
        postcontent: this.newpost,
        posttime: this.posttime,
        avatarurl: this.avatarurl,
        uid: this.uid,
        response: 0,
        postid: newPostKey
      }
      if (this.username !== '' && this.newpost !== '' && this.title !== '') {
        databaseRef().child('/newpost/topic/' + newPostKey).set(message)
        databaseRef().child('/user/post/' + this.uid + '/' + newPostKey).set(true)

        this.title = ''
        this.newpost = ''
        this.message = false
        router.go({ path: '/latest' })
      } else if (this.username === '') {
        router.go({ path: '/login' })
      } else {
        this.message = true
      }
    }
  }
}
</script>
<style scoped>
div.chatwrap {
  position: relative;
  list-style: none;
  margin: 0 0 60px 0;
  padding: 0;
  background-color: #fff;
  text-align: left;
  overflow-x: hidden;
  border: 10px solid #fff;
}
.userinfo {
  margin: 15px 0;
  padding: 0;
  position: relative;
}
.userinfo img {
  width: 32px;
  height: 32px;
}
.avatar {
  width: 32px;
  height: 32px;
  margin: 0;
  padding: 0;
  display: inline-block;
  color: #fff;
  line-height: 30px;
  text-align: center;
}
.avatar img {
  width: 32px;
  height: 32px;
}
.postcontent {
  width: 100%;
}
.post_content {
  width: 100%;
  min-height: 200px;
  background-color: #f7f7f7;
  margin: 0;
  padding: 10px;
  font-size: inherit;
  border: none;
}
.nullWarning {
  position: absolute;
  right: 3px;
  font-size: small;
  margin-top: -35px;
  color: rgb(255,0,60);
}
.addcontent {
  display: block;
  width: 120px;
  height: 30px;  
  border: none;
  margin: 10px 0;
  background-color: #00a388;
  color: #fff;
  border-radius: 3px;
}
input {
    width: 100%;
    height: 35px;
    outline: none;
    border: none;
    margin: 0 0 15px 0;
    border-radius: 5px;
    padding-left: 10px;
    font-size: inherit;
    background-color: #f7f7f7;
}
h3 {
  color: rgb(255,0,60);
}
</style>