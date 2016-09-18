<template>
<loading v-if="login"></loading>
<section id="chat" v-if="!login">
    <h3>最新内容 :p</h3>
    <div class="latestwrap">
        <div class='topic' v-for="item in newposts | orderBy 'posttime' -1">
            <span class="avatar"><img v-bind:src="item.avatarurl"></span>
            <small class="username">&nbsp;{{item.name}}</small>
            <div class="contentwrap">
                <a class="topictitle" v-link="{ name: 'latestitem', params: { item: item.postid}}">{{item.title}}</a>
                <small class="posttime">{{item.posttime | timeago}}</small>
                <span class="count" v-show="item.response === 0 ? false : true">{{item.response}}</span>
            </div>
        </div>
    </div>
</section>
</template>
<script>
import loading from './loading'
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
      post: '登录后回复',
      newposts: '',
      count: {},
      avatarurl: {},
      time: {},
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
    // topic content
    const ref = databaseRef().child('/newpost/topic/')
    ref.on('value', snapshot => {
      const newposts = snapshot.val()
      this.newposts = newposts
      this.login = false
    })
  }
}
</script>
<style lang="scss" scoped>
@import "../layout/variables.scss";
.latestwrap {
  @include box-center;
  text-align: left;
  overflow-x: hidden;
}
.contentwrap {
  position: relative;
  padding: 5px 35px;
  border: {
    bottom: 1px #e0e3e9 solid;
    radius: none!important;
  }
}
.posttime {
  position: absolute;
  right: 2px;
  top: -20px;
  color: $grey;
}
.topic {
  margin-bottom: 15px;
  p {
  font-size: 0.8rem;
  margin: 0;
}
.username {
  margin-left: 30px;
  display: inline-block;
  margin-top: 5px;
  color: $brand-primary;
}
}
.avatar {
  position: absolute;
  left: 10px;
  img {
  @include avatar;
}
}
a.topictitle {
  color: #000;
  font-size: 1rem;
  font-weight: bold;
}
.count {
  display: inline-block;
  width: auto;
  height: 20px;
  padding: 0 10px;
  line-height: 21px;
  border-radius: 25px;
  position: absolute;
  right: 5px;
  top: 3px;
  color: #fff;
  text-align: center;
  font-size: small;
  background-color: $logo;
}
</style>