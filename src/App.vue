<template>
<div class="topbar">
    <div class="logo"><a href="#">Const</a></div>
    <ul class="navbar">
    <li><a :href="'#/latest/'"><img src="../src/assets/location.png"><small>最新</small></a></li>
    <li><a :href="'#/star/'"><img src="../src/assets/star.png"><small>收藏</small></a></li>
    <li><a :href="'#/setting/'"><img src="../src/assets/settings.png"><small>设置</small></a></li>
</ul>
</div>
<div id="app">
    <router-view></router-view>
</div>
<addbtn></addbtn>
<chatbtn></chatbtn>
</template>
<script>
import addbtn from './components/addtopicbtn'
import chatbtn from './components/chatbtn'
export default {
  replace: false,
  components: {
    chatbtn,
    addbtn
  }
}
</script>
<style lang="scss">
@import "./layout/variables.scss";
html,body {
  @include box;
  width: 100%;
  height: 100%;
  background-color: $body-bg;
  font: {
    size: $font-size-base;
    family: Source Sans Pro, Helvetica, Arial;
  }
}
* {
  box-sizing: border-box;
  outline: 0 none!important;
}
@media (min-width: 768px) { 
  #app {
    max-width: 600px;
  }
  .changeNameBox {
    max-width: 65%;
  }
 }
@media (max-width: 767px) { 
  #app {
    max-width: 450px;
  }
}
#app {
  position: relative;
  display: -webkit-flex;
  display: flex;
  justify-content: center;
  -webkit-flex-direction: column;
  flex-direction: column;
  -webkit-flex-direction: column;
  padding: 80px 15px 15px;
  margin: 0 auto;
  text-align: center;
  -webkit-overflow-scrolling: touch; 
}
a {
  text-decoration: none;
}
.logo {
  a {
    color: #fff;
  }
}
.logo {
  height: $navbar-height;
  line-height: $navbar-height;      
  position: absolute;
  width: 80px;
  font: {
    size: 1.3rem;
    family: $logo-font-family;
    weight: bold;
  }
  text-align: center;
  background-color: $logo;
}
.logo::after {
    content: '';
    height: 0;
    display: inline-block;
    position: absolute;
    right: -50px;
    border: {
      left: solid 25px $logo;
      top: solid 25px transparent; 
      right:  25px solid transparent;
      bottom: 25px solid transparent;
    }
}
.topbar {
  @include box;
  width: 100%;
  height: $navbar-height;
  position: fixed;
  top: 0;
  background-color: #fff; 
  z-index: 999;
}
.navbar {
  margin: 0;
  padding: 0;
  height: 50px;
  right: 10px;
  position: absolute;
  text-align: center;
}
.navbar small {
  font-size: xx-small;
  color: $link-grey;
}
ul.navbar li {
list-style: none;
position: relative;
display: inline-block;
padding: 5px 0;
margin: 0 15px;
text-align: center;
line-height: 70px;
}
ul.navbar li img {
  width: 24px;
  height: 24px;
  left: 50%;
  margin-left: -12px;
  position: absolute;
}
.fade-transition {
  transition: opacity .3s ease-in;
}
.fade-enter, .fade-leave {
  opacity: 0;
}
</style>
