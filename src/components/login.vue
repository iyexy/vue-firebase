<template>
<div id='login'>
    <h4>JOIN US ! AND HAVE FUN</h4>
    <ul class="loginitem">
        <li>
            <label for='login-email'>Email Adress</label>
            <input type="text" name="email" v-model="email" autofocus>
            <label class="warning" v-if='wrongEmail'>{{warningEmail}}</label>
        </li>
        <li>
            <label for='login-password'>Password</label>
            <input type="password" name="password" v-model="password">
            <label class="warning" v-if='wrongPassword'>{{warningPassword}}</label>
        </li>
        <li v-if="toggleloginbtn">
            <button class="purebtn" v-on:click.stop='togglebtn'><small>注册账号</small></button>
            <button class="idp-button" v-on:click.stop="login" v-bind:class='pinkbtn'>Sign in</button>
        </li>
        <li v-if="!toggleloginbtn">
            <button class="idp-button" v-on:click.stop="createUser" v-bind:class='pinkbtn'>Create an account</button>
        </li>
        <li>
            <button class="idp-button" v-on:click.stop="google"><span class="googleico">G</span>Sign in with Google</button>
        </li>
    </ul>
</div>
</template>
<script>
import {router} from '../router'
import {onAuthStateChanged, googleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword} from '../db/fbase'
export default {
  data () {
    return {
      email: '',
      password: '',
      wrongEmail: false,
      wrongPassword: false,
      toggleloginbtn: true,
      pinkbtn: 'pinkbtn',
      warningEmail: '* 请输入正确的邮箱地址',
      warningPassword: '* 密码至少是6个字符'
    }
  },
  created: function () {
    onAuthStateChanged(user => {
      if (!user) {
        router.go({ path: '/login' })
      } else {
        router.go({ path: '/setting' })
      }
    })
  },
  methods: {
     // signInWithEmailAndPassword
    login: function () {
      signInWithEmailAndPassword(this.email, this.password).catch((error) => {
        console.log(error.code + '  ' + error.message)
        switch (error.code) {
          case 'auth/invalid-email':
            this.wrongEmail = true
            break
          case 'auth/user-not-found':
            this.warningEmail = '* 此邮箱未注册'
            this.wrongEmail = true
            break
          case 'auth/wrong-password':
            this.warningPassword = '* 邮箱地址或密码错误'
            this.wrongEmail = false
            this.wrongPassword = true
            break
          case 'auth/network-request-failed':
            this.warningPassword = '* 网络请求失败 请稍后重试'
            this.wrongPassword = true
            break
          default:
            this.wrongPassword = false
        }
      })
    },
    // createUserWithEmailAndPassword
    createUser: function () {
      createUserWithEmailAndPassword(this.email, this.password).catch((error) => {
        // console.log(error.code + '  ' + error.message)
        if (error.code === 'auth/invalid-email') {
          this.warningEmail = '* 请输入正确的邮箱地址'
          this.wrongEmail = true
        } else if (error.code === 'auth/weak-password') {
          this.warningPassword = '* 密码至少是6个字符'
          this.wrongEmail = false
          this.wrongPassword = true
        } else {
          this.warningEmail = '* 发生了一些错误 请稍后重试'
          this.wrongPassword = false
        }
      })
    },
    // createUserWithGoogleAuthProviser
    google: function () {
      googleAuthProvider()
    },
    // toggle signin button & signup button
    togglebtn: function () {
      this.toggleloginbtn = false
    }
  }
}
</script>
<style scoped>
#login {
  margin: 0 auto 60px auto;
  width: 100%;
  height: auto;
}
#login h4:first-child {
  color: rgb(255,0,60);
}
.idp-button {
    width: 100%;
    height: 35px;
    min-width: 280px;
    background-color: #00a388;
    border: none;
    color: #fff;
    border-radius: 5px;
    font-size: inherit;
}
.pinkbtn {
  background-color: rgb(255,0,60)!important;
}
ul.loginitem {
    padding: 0;
    margin: 0 auto;
}
ul.loginitem li {
    width: 100%;
    height: auto;
    list-style: none;
    color: #fff;
    margin: 22px 0;
    line-height: 60px;
}
.purebtn {
  float: right;
  background-color: transparent;
  border: none;
  outline: 0 none!important;
}
small {
  color: #00a388;
  margin: 0;
  padding: 0;
  line-height: 10px;
}
button.purebtn:after {
  clear: both;
}
ul.loginitem li input {
    width: 100%;
    height: 35px;
    outline: none;
    border: none;
    border-radius: 5px;
    padding-left: 15px;
    font-size: inherit;
}
ul.loginitem label {
    height: auto;
    text-align: left;
    float: left;
    margin: -20px auto;
    padding: 0;
    color: #00a388;
}
ul.loginitem li {
  clear: both;
}
.warning {
  color: rgb(255,0,60)!important;
  font-size: 0.8em;
}
.googleico {
  width: 25px;
  height: 25px;
  text-transform: uppercase;
  background-color: rgb(255,0,60);
  border-radius: 50%;
  line-height: 25px;
  margin-right: 10px;
  display: inline-block;
  font-weight: bold;
  font-family: Arial;
}
</style>