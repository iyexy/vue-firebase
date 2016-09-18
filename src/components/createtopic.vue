<template>
<h3>>&nbsp;创建话题&nbsp;<</h3>
<div class="topicwrap">
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
      post: '登录后创建',
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
      const textareaTo = (str) => {
        str = str.replace(/\n/g, '<br/>')
        str = str.replace(/\s+/g, '&nbsp;')
        return str
      }
      this.posttime = new Date().getTime()
      this.newpost = textareaTo(this.newpost)
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
        const userpost = {
          title: this.title,
          posttime: this.posttime,
          url: newPostKey
        }
        databaseRef().child('/user/post/' + this.uid + '/' + newPostKey).set(userpost)

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
<style lang="scss" scoped>
@import "../layout/variables.scss";
.topicwrap {
  @include box-center;
  text-align: left;
  overflow-x: hidden;
  .username {
    color: $brand-primary;
  }
  .userinfo img {
  width: 32px;
  height: 32px;
}
}
.postcontent {
  width: 100%;
}
.post_content {
  width: 100%;
  min-height: 200px;
  margin: 0;
  padding: 10px;
  font-size: inherit;
  border: none;
  background-color: $body-bg;
}
.nullWarning {
  right: 5px;
  position: absolute;
  font-size: small;
  margin-top: -35px;
  color: $brand-warning;
}
.addcontent {
  @include btn-submit;
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
    background-color: $body-bg;
}
</style>