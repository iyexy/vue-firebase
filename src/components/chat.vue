<template>
<loading v-if="login"></loading>
<section id="chat" v-if="!login">
    <h2>Live Chat :p</h2>
    <div class="chatwrap">
        <div class='chat' v-for='chat in chat'>
            <span class="avatar"><img v-bind:src="chat.avatarurl"></span>
            <small class="username">&nbsp;{{chat.name}}</small>
            <div>
                <p>{{chat.message}}</p>
                <small class="posttime">{{chat.posttime}}</small>
            </div>
        </div>
        <div class="userinfo">
            <span v-show="useravatar">
        <img v-bind:src="avatarurl"></span>
            <small class="username">&nbsp;{{username}}</small>
        </div>
        <span class="nullWarning" v-if='message'>* 内容不能为空</span>
        <div class="addmessages">
            <textarea class="messages_content" v-model="newmessage" placeholder="添加消息..."></textarea>
            <button class="addmessage" v-on:click='sendmessage'>{{send}}</button>
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
      newmessage: '',
      message: false,
      send: '去登录',
      chat: '',
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
        databaseRef('user/' + this.uid + '/avatarurl/').on('value', snapshot => {
          this.avatarurl = snapshot.val()
          if (this.avatarurl === null) {
            this.avatarurl = this.defaultavatar
          }
          this.useravatar = true
        })
        this.send = '发送'
      } else {
        this.useravatar = false
      }
    })
    // chat content
    const ref = databaseRef().child('/chat/')
    ref.on('value', snapshot => {
      const chat = snapshot.val()
      this.chat = chat
      this.login = false
    })
  },
  methods: {
    // sendmessage
    sendmessage: function () {
      const ref = databaseRef().child('/chat/')
      const today = new Date()
      let month = today.getMonth() + 1
      let date = today.getDate()
      const hour = today.getHours()
      let minute = today.getMinutes()
      const checkTime = (i) => {
        if (i < 10) {
          i = '0' + i
        }
        return i
      }
      date = checkTime(date)
      minute = checkTime(minute)
      this.posttime = month + '/' + date + ' ' + hour + ':' + minute
      const message = {
        name: this.username,
        message: this.newmessage,
        posttime: this.posttime,
        avatarurl: this.avatarurl,
        uid: this.uid
      }
      if (this.username !== '' && this.newmessage !== '') {
        ref.push().set(message)
        this.newmessage = ''
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
  margin-bottom: 60px;
}
div.chatwrap {
  position: relative;
  list-style: none;
  margin: 0 0 60px 0;
  padding: 0;
  background-color: #fff;
  text-align: left;
  overflow-x: hidden;
  border: 15px solid #fff;
}
.username {
  color: rgb(255,0,60);
}
.chat > .username {
  margin-left: 30px;
}
.posttime {
  position: absolute;
  right: 2px;
  top: -15px;
  color: #ddd;
}
.chat {
  margin-bottom: 15px;
}
.chat div {
  position: relative;
  padding: 5px 0;
  border-bottom: 1px #e0e3e9 solid;
  border-radius: none!important;
  padding-left: 35px;
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
  margin: 0;
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
.addmessages {
  width: 100%;
}
.messages_content {
  width: 100%;
  min-height: 100px;
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
  margin-top: -20px;
  color: rgb(255,0,60);
}
.addmessage {
  display: block;
  width: 120px;
  height: 30px;  
  border: none;
  margin: 10px 0;
  background-color: #00a388;
  color: #fff;
  border-radius: 3px;
}
</style>