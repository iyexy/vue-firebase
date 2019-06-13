<template>
<div id="avatar" v-if='login'>
    <div class="userinfo">
        <img v-bind:src="avatar">
        <h4>{{username}}</h4>
    </div>
    <ul class="settinglist">
        <li><button class="nostyle-btn" v-on:click="changeUserName">修改用户名</button></li>
        <li class="changeNameBox" v-if='changeNameBox' transition="in">
            <button class="close" v-on:click="closeNameBox"> + </button>
            <small class="warning" v-if='isMessage'>{{warningMessage}}</small>
            <input type="text" name="username" autofocus class="change-btn text-center" placeholder="输入新的用户名" v-model="newName">
            <button class="change-btn" v-on:click='confirm'>确定</button>
        </li>
        <li><button class="nostyle-btn" v-on:click="changeAvatar">更换头像</button></li>
        <li class="changeNameBox" v-if="changeavatarBox" transition="in">
            <button class="close" v-on:click="closeAvatarBox"> + </button>
            <span id="avatarwrap">
            <span class="avatar-option" v-for='url in avatarurl'>
            <input type="radio" :id="'avatar' + [$index]" :value="url.url" v-model="picked">
            <label :for="'avatar' + [$index]" v-bind:style="{ backgroundImage: 'url(' + url.url + ')' }"></label>
            </span>
            </span>
            <button class="change-btn" v-on:click='changeUseravatar'>确定</button>
        </li>
        <li><a class="nostyle-btn" href="/usertopic/">我的话题</a></li>
        <li><button class="nostyle-btn" v-on:click="signout">退出</button></li>
    </ul>
</div>
</template>
<script>
import {auth, onAuthStateChanged, databaseRef, authSignOut} from '../db/fbase'
import {router} from '../router'
export default {
  name: 'setting',
  data () {
    return {
      username: '',
      avatar: '',
      login: false,
      newName: '',
      changeavatarBox: false,
      changeNameBox: false,
      warningMessage: '',
      confirmed: false,
      isMessage: false,
      uid: '',
      picked: '',
      defaultavatar: 'http://od62mnpbe.bkt.clouddn.com/default.png',
      avatarurl: [
        {url: 'http://od62mnpbe.bkt.clouddn.com/girl.png'},
        {url: 'http://od62mnpbe.bkt.clouddn.com/boy.png'},
        {url: 'http://od62mnpbe.bkt.clouddn.com/girl-2.png'},
        {url: 'http://od62mnpbe.bkt.clouddn.com/boy-1.png'}
      ]
    }
  },
  created: function () {
    onAuthStateChanged(user => {
      if (!user) {
        router.go({ path: '/login' })
      } else {
        const userEmName = user.email.slice(0, user.email.indexOf('@'))
        this.username = user.displayName || userEmName
        const id = user.uid
        this.uid = id
      }
      databaseRef('user/avatar/' + this.uid + '/avatarurl/').on('value', snapshot => {
        this.avatar = snapshot.val()
        if (this.avatar === null) {
          this.avatar = this.defaultavatar
        }
        this.login = true
      })
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
          this.newName = ''
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
    },
    changeUseravatar: function () {
      const ref = databaseRef('user/avatar/' + this.uid)
      if (this.picked !== '') {
        const avatarurl = {
          avatarurl: this.picked
        }
        ref.set(avatarurl)
      }
    },
    closeAvatarBox: function () {
      this.changeavatarBox = false
    },
    closeNameBox: function () {
      this.newName = ''
      this.isMessage = false
      this.changeNameBox = false
    },
    changeAvatar: function () {
      this.changeavatarBox = true
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../layout/variables.scss";
#avatar {
  @include box-center;  
}
.userinfo {
  position: relative;
  margin: 10px 0;
  color: $coralred;
  h4 {
    color: $coralred;
  }
}
ul.settinglist {
    @include box;
    li {
    list-style: none;
    color: $brand-primary;
    margin: 5px auto;
    line-height: 50px;
    position: relative;
}
}
.text-center {
    text-align: center;
}
.nostyle-btn {
    width: auto;
    height: 35px;
    font-size: inherit;
    border: none;
    color: $brand-primary;
    background-color: transparent;
}
.close {
  font-size: 2.5rem;
  color: #fff;
  border: none;
  position: absolute;
  right: 5px;
  padding: 0;
  margin-top: -10px;
  background-color: transparent;
  transform: rotate(45deg);
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
  background-color: $grey;
  border-radius: 5px;
  padding-top: 3px;
}
.changeNameBox::before {
    content:"";
    display: inline-block;
    position: absolute;
    margin: -27px 0 0 15px;
    border: {
      left: solid 15px transparent;
      top: solid 15px transparent; 
      right: solid 15px transparent;
      bottom: solid 15px $grey;
    }
  }
.warning {
  color: #fff;
  display: inherit;
  font-size: small;
}
#avatarwrap {
  display: inline-block;
  padding-top: 35px;
}
.avatar-option {
  position: relative;
  margin: 50px 10px;
  input {
  display:none;
}
 input[type='radio']:checked+label {
  border: 1px solid #fff;
  border-radius: 50%;
}
 label {
  display: inline-block;
  position: relative;
  width: 42px;
  height: 42px;
  background: {
    position: 0 0;
    size: 100% 100%;
    repeat: no-repeat; 
  }
}
}
.in-transition {
  transition: opacity .3s ease;
}
.in-enter, .in-leave {
  opacity: 0;
}
</style>