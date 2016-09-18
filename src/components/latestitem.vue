<template>
<loading v-if="login"></loading>
<div v-if="!login" class="postwrap">
    <div class='newpost'>
        <div class="contentwrap">
        <span class="avatar"><img v-bind:src="newpost.avatarurl"></span>
            <a class="topictitle" href="javascript:void(0)">{{newpost.title}}</a>
            <small class="username">&nbsp;{{newpost.name}}</small>
            <small class="posttime">{{newpost.posttime | timeago}}</small>
            <div class="center">{{{content}}}</div>
        </div>
    </div>
        <ul class="likebtn">
            <li>
                <button class="btn" v-bind:style="{color: starcolor}" v-bind:disabled="starbtn" v-on:click="star">
                    {{starbtntext}}
                </button>
            </li>
            <li class="share">
                <button class="btn">分享</button>
            </li>
        </ul>
    <div class="chatwrap">
        <div class='chat' v-for='chat in chat'>
            <span class="avatar"><img v-bind:src="chat.avatarurl"></span>
            <small class="username">&nbsp;{{chat.name}}</small>
            <div>
                <p>{{{chat.message | noblank}}}</p>
                <small class="posttime">{{chat.posttime | timeago}}</small>
            </div>
        </div>
        <div class="userinfo">
            <span v-show="useravatar">
        <img v-bind:src="avatarurl"></span>
            <small class="username">&nbsp;{{username}}</small>
        </div>
        <span class="nullWarning" v-if='message'>* 内容不能为空</span>
        <div class="addmessages">
            <textarea class="messages_content" v-model="newmessage" placeholder="添加评论..."></textarea>
            <button class="addmessage" v-on:click='addcomment'>{{send}}</button>
        </div>
    </div>
</div>
</template>
<script>
import marked from 'marked'
import {router} from '../router'
import loading from './loading'
import {onAuthStateChanged, databaseRef} from '../db/fbase'
export default {
  name: 'postitem',
  components: {
    loading
  },
  data () {
    return {
      newpost: {},
      uid: '',
      psotid: '',
      useravatar: false,
      username: '',
      newmessage: '',
      message: false,
      avatarurl: {},
      postKey: '',
      send: '登录后回复',
      chat: '',
      starcolor: '',
      starbtntext: '收藏',
      starbtn: false,
      login: true,
      count: '',
      light: {},
      defaultavatar: 'http://od62mnpbe.bkt.clouddn.com/default.png'
    }
  },
  created: function () {
    marked.setOptions({
      renderer: new marked.Renderer(),
      gfm: true,
      tables: true,
      breaks: false,
      pedantic: false,
      sanitize: false,
      smartLists: true,
      smartypants: false
    })
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
        this.send = '发表评论'
        databaseRef('/user/alreadystar/' + this.uid + '/' + this.postKey).on('value', snapshot => {
          if (snapshot.val() !== null) {
            this.starbtntext = '已收藏'
            this.starcolor = '#ffeb3b'
            this.starbtn = true
          } else {
            this.starbtntext = '收藏'
            this.starcolor = ''
            this.starbtn = false
          }
        })
      } else {
        this.useravatar = false
      }
    })
    const url = window.location.href
    const itemurl = url.split('/')
    this.postKey = itemurl[itemurl.length - 1]
    databaseRef('/newpost/topic/' + this.postKey).on('value', snapshot => {
      this.newpost = snapshot.val()
    })
    const ref = databaseRef().child('/newpost/comments/' + this.postKey)
    ref.on('value', snapshot => {
      const chat = snapshot.val()
      this.chat = chat
      this.login = false
    })
    databaseRef('/newpost/topic/' + this.postKey + '/response/').on('value', snapshot => {
      this.count = snapshot.val()
    })
  },
  computed: {
    content: function () {
      const toTextarea = (str) => {
        str = str.replace('<br>', '\n')
        str = str.replace('&nbsp;', ' ')
        return str
      }
      let content = toTextarea(this.newpost.postcontent)
      content = marked(content)
      return content
    }
  },
  methods: {
    star: function () {
      if (this.uid === '') {
        router.go({ path: '/login' })
      } else {
        const star = databaseRef().child('userstar/' + this.uid)
        const newStarKey = star.push().key
        const add = {
          topicTitle: this.newpost.title,
          topicTime: this.newpost.posttime,
          auth: this.newpost.name,
          topicUrl: window.location.href,
          postKey: this.postKey
        }
        databaseRef().child('userstar/' + this.uid + '/' + newStarKey).set(add)
        const alreadyStar = databaseRef('/user/alreadystar/' + this.uid + '/' + this.newpost.postid)
        alreadyStar.set(newStarKey)
      }
    },
    // addcomment
    addcomment: function () {
      const ref = databaseRef().child('/newpost/comments/' + this.postKey)
      const textareaTo = (str) => {
        str = str.replace(/\n/g, '<br/>')
        str = str.replace(/\s+/g, '&nbsp;')
        return str
      }
      const posttime = new Date().getTime()
      const newmessage = textareaTo(this.newmessage)
      const message = {
        name: this.username,
        message: newmessage,
        posttime: posttime,
        avatarurl: this.avatarurl,
        uid: this.uid
      }
      if (this.username !== '' && this.newmessage !== '') {
        ref.push().set(message)
        const count = this.count + 1
        databaseRef('/newpost/topic/' + this.postKey + '/response/').set(count)
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
div.postwrap {
  position: relative;
  list-style: none;
  margin: 0 0 60px 0;
  padding: 0;
  background-color: #fff;
  text-align: left;
  overflow-x: hidden;
  border: 5px solid #fff;
}
.username {
  color: #00a388;
  display: inline-block;
  margin-left: -5px;
}
.newpost > .username {
  margin-left: 30px;
  display: inline-block;
  margin-top: 5px;
}
.posttime {
  margin-left: 5px;
  color: #ddd;
}
.newpost {
  margin-bottom: 15px;
}
.newpost div.contentwrap {
  position: relative;
  padding: 5px;
}
.newpost p {
  margin: 0;
}
.contentwrap > .avatar {
  float: right;
  margin: 0 0 10px 10px;
}
a.topictitle {
  margin: 5px 0;
  display: block;
  color: #000;
  font-weight: bold;
}
.chat {
  margin-bottom: 15px;
}
.chat div {
  position: relative;
  padding: 5px 0;
  padding-left: 35px;
}
.chatwrap {
  margin-top: 80px;
}
.chat p {
  font-size: 0.8rem;
  margin: 0;
}
.chat .username {
  margin-left: 30px;
}
.chat .posttime {
  position: absolute;
  margin-left: 35px;
  top: -15px;
  color: #ddd;
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
ul.likebtn {
  position: absolute;
  margin: 0;
  padding: 0;
  right: 10px;
}
ul.likebtn li {
  margin: 0 5px;
  padding: 0;
  background-color: transparent;
  display: inline-block;
}
.btn {
  width: inherit;
  height: inherit;
  color: #00a388;
  border: none;
  margin: 0;
  padding: 0;
  font-size: small;
  background-color: transparent;
}
</style>
