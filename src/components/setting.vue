<template>
<div id="avarate" v-if='login'>
    <div class="userinfo">
        <h1 class="avarate">{{avarate}}</h1>
        <h3>{{username}}</h3>
    </div>
    <ul class="settinglist">
    <li></li>
    <li  v-if="!changeNameBox"><button class="nostyle-btn" v-on:click="changeUserName">修改用户名</button>
    </li>
    <li class="changeNameBox" v-if='changeNameBox'>
     <small class="warning" v-if='isMessage'>{{warningMessage}}</small>
    <input type="text" name="username" autofocus class="change-btn text-center" placeholder="输入新的用户名" v-model="newName">
    <button class="change-btn" v-on:click='confirm'>确定</button>
    </li>
    <li>收藏</li>
    <li><button class="nostyle-btn" v-on:click="signout">退出</button></li>
    </ul>
</div>
</template>
<script>
import {auth, onAuthStateChanged, authSignOut} from '../db/fbase'
import {router} from '../router'
export default {
  name: 'setting',
  data () {
    return {
      username: '',
      avarate: 'X',
      login: false,
      newName: '',
      changeNameBox: false,
      warningMessage: '',
      confirmed: false,
      isMessage: false
    }
  },
  created: function () {
    onAuthStateChanged(user => {
      if (!user) {
        router.go({ path: '/login' })
      } else {
        this.login = true
        const userEmName = user.email.slice(0, user.email.indexOf('@'))
        this.username = user.displayName || userEmName
        const avarate = this.username.slice(0, 1)
        this.avarate = avarate
      }
    })
  },
  methods: {
    signout: function () {
      authSignOut()
    },
    confirm: function () {
      const user = auth.currentUser
      if (this.newName !== '') {
        user.updateProfile({
          displayName: this.newName
        }).then(() => {
          this.username = user.displayName
          this.avarate = this.username.slice(0, 1)
          this.newName = ''
          this.changeNameBox = false
          this.isMessage = false
        }, (error) => {
          console.log(error.code + error.massage)
          this.warningMessage = '* 发生了一些错误，请重试！'
          this.isMessage = true
        })
      } else {
        this.warningMessage = '* 用户名不能为空！'
        this.isMessage = true
      }
    },
    changeUserName: function () {
      this.changeNameBox = true
    }
  }
}
</script>
<style scoped>
#avarate {
  margin: 0 auto 60px auto;
  max-width: 300px;
}
.userinfo {
  position: relative;
  margin: 10px 0 10px 0;
  line-height: 45px;
  color: #00a388;
}
.userinfo .avarate {
  width: 65px;
  height: 65px;
  margin: 15px 0;
  padding: 0 1px 0 0;
  display: inline-block;
  border-radius: 50%;
  color: #fff;
  line-height: 67px;
  text-align: center;
  background-color: rgb(255,0,60);
  text-transform: uppercase;
}
ul.settinglist {
    padding: 0;
    margin: 0;
}
ul.settinglist li {
    min-width: 280px;
    list-style: none;
    color: #00a388;
    font-size: 1.1rem;
    margin: 15px auto;
    line-height: 60px;
    /*border-bottom: 1px solid #42b983;*/
}
.text-center {
    text-align: center;
}
.nostyle-btn {
    width: 100%;
    height: 35px;
    font-size: inherit;
    border: none;
    color: #00a388;
    background-color: transparent;
}
.change-btn {
    width: 80%;
    height: 40px;
    color: #fff;
    font-size: inherit;
    border: none;
    background-color: transparent;
}
input.change-btn {
    border-bottom: 1px solid #fff;
    border-radius: 0!important;
}
.changeNameBox {
  background-color: rgb(255,0,60);
  border-radius: 5px;
  padding-top: 3px;
}
.changeNameBox::before {
    content:"";
    display: inline-block;
    position: absolute;
    margin-top: -27px;
    margin-left: 15px;
    border-left: solid 15px transparent;
    border-top: solid 15px transparent; 
    border-right:  15px solid transparent;
    border-bottom: 12px solid rgb(255,0,60);
  }
  .warning {
  color: #fff;
  display: inherit;
  font-size: small;
}
</style>