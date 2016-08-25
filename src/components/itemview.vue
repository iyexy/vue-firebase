<template>
<loading v-if="login"></loading>
<div v-if="!login" class="itemlist">
    <div class="itemview">
        <img v-bind:src="topicitem.imgurl" />
        <div class="itemcontent">
            <span class="itemtitle"><a href="javascript:void(0)"><small>{{topicitem.post_time}}</small>&nbsp;{{topicitem.title}}</a></span>
            <p>{{topicitem.content}}</p>
        </div>
    </div>
    <div class='comments' v-for='commentsitem in comments'>
        <h3 class="avarate">{{commentsitem.name.slice(0, 1)}}</h3>
        <span class="itemtitle">&nbsp;{{commentsitem.name}}</span>
        <p>{{commentsitem.message}}</p>
        <span class="posttime">{{commentsitem.posttime}}</span>
    </div>
    <div class="userinfo">
        <h3 class="avarate" v-bind:style="{backgroundColor: bgcolor}" v-show="useravarate">{{avarate}}</h3>
        <span class="itemtitle">&nbsp;{{username}}</span>
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
      bgcolor: '#2c3e80',
      comments: {},
      avarate: '',
      useravarate: false,
      commentsId: '',
      newcomment: '',
      posttime: '',
      comment: false
    }
  },
  created: function () {
    const commentsId = this.$route.params.id
    const ref = databaseRef().child('/comments/' + commentsId)
    databaseRef('/topicItem/').on('value', snapshot => {
      this.topicItem = snapshot.val()
    })
    onAuthStateChanged(user => {
      if (user) {
        this.username = user.displayName || user.email.slice(0, user.email.indexOf('@'))
        this.avarate = this.username.slice(0, 1)
        this.useravarate = true
      } else {
        this.useravarate = false
      }
    })
    ref.on('value', snapshot => {
      this.login = false
      const comments = snapshot.val()
      this.comments = comments
    })
  },
  methods: {
    addcomment: function () {
      const commentsId = this.$route.params.id
      const ref = databaseRef().child('/comments/' + commentsId)
      const today = new Date()
      let month = today.getMonth() + 1
      const date = today.getDate()
      const year = today.getFullYear()
      const checkTime = (i) => {
        if (i < 10) {
          i = '0' + i
        }
        return i
      }
      month = checkTime(month)
      this.posttime = year + '/' + month + '/' + date
      const comment = {
        name: this.username,
        message: this.newcomment,
        posttime: this.posttime
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
    }
  }
}
  </script>
<style scoped>
div.itemlist {
  list-style: none;
  margin: 0 0 60px 0;
  padding: 0;
  background-color: gold;
  text-align: left;
  overflow-x: hidden;
}
.itemtitle {
  color: rgb(255,0,60);
}
.itemcontent {
  margin: 0;
  padding: 2px 0px;
  overflow:hidden; 
  text-overflow:ellipsis;
}
.posttime {
  color: rgb(255,0,60);
  float: right;
  margin: 10px 0;
}
.comments {
  margin-bottom: 15px;
}
.comments p {
  margin: 0;
}
div.itemview img {
    width: 100%;
    height: auto;
}
.userinfo {
  margin: 80px 0 0 0;
  line-height: 45px;
}
.avarate {
  width: 35px;
  height: 35px;
  margin: 15px 0;
  padding: 0;
  display: inline-block;
  border-radius: 50%;
  color: #fff;
  line-height: 37px;
  text-align: center;
  background-color: rgb(255,0,60);
  text-transform: uppercase;
}
.addcomments {
  width: 100%;
}
.comments_content {
  max-width: 600px;
  width: 100%;
  min-height: 100px;
  background-color: gold;
  border: 1px solid #fff;
  margin: 0;
  padding: 5px;
  font-size: 1em;
  box-sizing: border-box;
}
.nullWarning {
  position: absolute;
  right: 15px;
  margin-top: -25px;
  color: #2c3e80;
}
.addcomment {
  display: block;
  width: 120px;
  height: 30px;  
  border: none;
  margin: 10px 0;
  background-color: #2c3e80;
  color: #fff;
  border-radius: 3px;
}
</style>
