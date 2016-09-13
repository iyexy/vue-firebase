<template>
<loading v-if="login"></loading>
<section id="chat" v-if="!login">
    <h2>最新内容 :p</h2>
    <div class="chatwrap">
        <div class='chat' v-for="chat in newposts | orderBy 'posttime' -1">
            <span class="avatar"><img v-bind:src="chat.avatarurl"></span>
            <small class="username">&nbsp;{{chat.name}}</small>
               <div class="contentwrap">
          <a class="topictitle" v-link="{ name: 'postitem', params: { item: chat.postid}}">{{chat.title}}</a>
                <small class="posttime">{{chat.posttime}}</small>
                <span class="count" v-show="chat.response === 0 ? false : true">{{chat.response}}</span>
            </div>
        </div>
    </div>
</section>
</template>
<script>
import loading from './loading'
import {router} from '../router'
import {onAuthStateChanged, databaseRef} from '../db/fbase'
export default {
  name: 'post',
  components: {
    loading
  },
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
    // chat content
    const ref = databaseRef().child('/newpost/topic/')
    ref.on('value', snapshot => {
      const newposts = snapshot.val()
      this.newposts = newposts
      this.login = false
    })
  },
  methods: {
    // post
    postcontent: function () {
      const ref = databaseRef().child('/newpost/topic/')
      const today = new Date()
      let month = today.getMonth() + 1
      const date = today.getDate()
      const hour = today.getHours()
      let minute = today.getMinutes()
      const checkTime = (i) => {
        if (i < 10) {
          i = '0' + i
        }
        return i
      }
      month = checkTime(month)
      minute = checkTime(minute)
      this.posttime = month + '/' + date + ' ' + hour + ':' + minute
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
      if (this.username !== '' && this.newpost !== '') {
        databaseRef().child('/newpost/topic/' + newPostKey).set(message)
        databaseRef().child('/user/post/' + this.uid + '/' + newPostKey).set(true)

        this.title = ''
        this.newpost = ''
        this.message = false
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
#chat {
  margin-bottom: 120px;
}
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
.username {
  color: #d7d7d7;
}
.chat > .username {
  margin-left: 30px;
  display: inline-block;
  margin-top: 5px;
}
.posttime {
  position: absolute;
  right: 2px;
  top: -18px;
  color: #ddd;
}
.chat {
  margin-bottom: 15px;
}
.chat div {
  position: relative;
  padding: 5px 35px;
  border-bottom: 1px #e0e3e9 solid;
  border-radius: none!important;
}
.chat p {
  font-size: 0.8rem;
  margin: 0;
}
.chat > .avatar {
  margin-right: 10px;
  position: absolute;
  left: 0;
}
.userinfo {
  margin: 50px 0 0;
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
.contentwrap {
  position: relative;
}
a.topictitle {
  color: #000;
  font-size: 1rem;
  font-weight: bold;
}
.count {
  display: inline-block;
  width: autp;
  height: 20px;
  padding: 0 10px;
  line-height: 20px;
  border-radius: 25px;
  position: absolute;
  right: 5px;
  top: 3px;
  color: #fff;
  text-align: center;
  font-size: small;
  background-color: #d7d7d7;
}
</style>