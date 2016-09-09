<template>
<loading v-if="login"></loading>
<div v-if="!login" class="itemlist" transition="fade">
    <div class="itemview">
        <img v-bind:src="topicitem.imgurl" />
        <div class="itemcontent">
            <span class="itemtitle"><a href="javascript:void(0)"><small>{{topicitem.post_time}}</small>&nbsp;{{topicitem.title}}</a></span>
            <p>{{topicitem.content}}</p>
        </div>
    </div>
    <div class="likebtn">
        <ul>
            <li class="share">
                <button class="btn">分享</button>
            </li>
            <li>
                <button class="btn" v-bind:style="{color: starcolor}" v-bind:disabled="starbtn" v-on:click="star">
                    {{starbtntext}}
                </button>
            </li>
        </ul>
    </div>
    <div class='comments' v-for='commentsitem in comments'>
        <span class="avatar"><img v-bind:src="commentsitem.avatarurl" /></span>
        <small class="username">&nbsp;{{commentsitem.name}}</small>
        <div>
            <p>{{commentsitem.message}}</p>
            <span class="posttime">{{commentsitem.posttime}}</span>
        </div>
    </div>
    <div class="userinfo">
        <span v-show="useravatar">
        <img v-bind:src="avatarurl"></span>
        <small class="username">&nbsp;{{username}}</small>
    </div>
    <span class="nullWarning" v-if='comment'>* 评论内容不能为空</span>
    <div class="addcomments">
        <textarea class="comments_content" v-model="newcomment"></textarea>
        <button class="addcomment" v-on:click='addcomment'>发表评论</button>
    </div>
</div>
</template>
<script>
import loading from './loading'
import {router} from '../router'
import {onAuthStateChanged, databaseRef} from '../db/fbase'
export default {
  name: 'list',
  components: {
    loading
  },
  data () {
    return {
      login: true,
      topicItem: {},
      username: '',
      comments: {},
      useravatar: false,
      commentsId: '',
      newcomment: '',
      posttime: '',
      comment: false,
      uid: '',
      startitle: '',
      starcolor: '',
      starbtntext: '收藏',
      starbtn: false,
      avatarurl: {},
      defaultavatar: 'http://od62mnpbe.bkt.clouddn.com/default.png'
    }
  },
  created: function () {
    databaseRef('/topicItem/').on('value', snapshot => {
      this.topicItem = snapshot.val()
    })
    onAuthStateChanged(user => {
      if (user) {
        // user name && user id
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
        // topic star
        const topic = databaseRef('/topicItem/' + this.$route.params.id + '/title/')
        topic.on('value', snapshot => {
          this.startitle = snapshot.val()
          databaseRef('alreadystar/' + this.uid + '/' + this.startitle).on('value', snapshot => {
            if (snapshot.val() !== null) {
              this.starbtntext = '已收藏'
              this.starcolor = 'gold'
              this.starbtn = true
            } else {
              this.starbtntext = '收藏'
              this.starcolor = ''
              this.starbtn = false
            }
          })
        })
      } else {
        this.useravatar = false
      }
    })
    const commentsId = this.$route.params.id
    const ref = databaseRef().child('/comments/' + commentsId)
    ref.on('value', snapshot => {
      this.login = false
      const comments = snapshot.val()
      this.comments = comments
    })
  },
  methods: {
    star: function () {
      if (this.uid === '') {
        router.go({ path: '/login' })
      } else {
        const star = databaseRef().child('userstar/' + this.uid)
        const add = {
          topicTitle: this.staritemtitle,
          topicTime: this.staritemtime,
          topicImg: this.staritemimg,
          topicUrl: window.location.href
        }
        star.push(add)
        const alreadyStar = databaseRef().child('alreadystar/' + this.uid + '/' + this.topicitem.title)
        alreadyStar.set(true)
      }
    },
    addcomment: function () {
      const commentsId = this.$route.params.id
      const ref = databaseRef().child('/comments/' + commentsId)
      const today = new Date()
      const year = today.getFullYear()
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
      this.posttime = year + '/' + month + '/' + date + ' ' + hour + ':' + minute
      const comment = {
        name: this.username,
        message: this.newcomment,
        posttime: this.posttime,
        avatarurl: this.avatarurl,
        uid: this.uid
      }
      if (this.username !== '' && this.newcomment !== '') {
        ref.push().set(comment)
        this.newcomment = ''
        this.comment = false
      } else if (this.username === '') {
        router.go({ path: '/login' })
      } else {
        this.comment = true
      }
    }
  },
  computed: {
    params: function () {
      return this.$route.params.id
    },
    topicitem: function () {
      return this.topicItem[this.params]
    },
    title: function () {
      return this.topicitem.title
    },
    staritemtitle: function () {
      return this.topicItem[this.params].title
    },
    staritemtime: function () {
      return this.topicItem[this.params].post_time
    },
    staritemimg: function () {
      return this.topicItem[this.params].imgurl
    }
  }
}
</script>
<style scoped>
div.itemlist {
  position: relative;
  list-style: none;
  margin: 0 0 60px 0;
  padding: 0;
  background-color: #fff;
  text-align: left;
  overflow-x: hidden;
  border: 15px solid #fff;
}
.itemtitle {
  position: relative;
  display: inline-block;
  height: 30px;
  padding: 0 0 0 5px;
  margin: 0;
  line-height: 30px;
  background-color: #2e3e50;
}
.itemtitle::after {
   content: '';
    position: absolute;
    display: inline-block;
    margin: 0;
    padding: 0;
    top: 0;
    right: -30px;
    border-left: solid 15px #2c3e50;
    border-top: solid 15px transparent; 
    border-right:  15px solid transparent;
    border-bottom: 15px solid transparent;
}
.username {
  color: rgb(255,0,60);
}
.itemcontent {
  margin: 0;
  padding: 0;
  overflow:hidden; 
  text-overflow:ellipsis;
}
.posttime {
  position: absolute;
  right: 2px;
  top: -20px;
  font-size: small;
  color: #ddd;
}
.commentswrap {
  width: 100%;
  height: auto;
  padding: 15px;
  border: 1px solid #e0e3e9;
}
.comments {
  margin-bottom: 10px;
}
.comments div {
  position: relative;
  padding: 10px;
  border: 1px #e0e3e9 solid;
  border-radius: 5px;
}
.comments p {
  font-size: 0.8rem;
  margin: 0;
}
div.itemview img {
    width: 100%;
    height: auto;
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
.avatar img {
  width: 32px;
  height: 32px;
}
.addcomments {
  width: 100%;
}
.comments_content {
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
.addcomment {
  display: block;
  width: 120px;
  height: 30px;  
  border: none;
  margin: 10px 0;
  background-color: #00a388;
  color: #fff;
  border-radius: 3px;
}
.likebtn {
  position: relative;
  right: 0px;
  width: auto;
  height: 30px;
  line-height: 30px;
  margin-bottom: 35px;
}
.likebtn ul li {
  float: right;
  width: 65px;
  text-align: center;
  margin: 0 0 0 5px;
  border-radius: 5px;
  background-color: #f7f7f7;
  display: inline-block;
}
.btn {
  width: inherit;
  height: 30px;
  display: inline-block;
  color: #00a388;
  border: none;
  font-size: small;
  background-color: transparent;
}
</style>
