<template>
<div class="topbar">
    <div class="logo"><a href="#">Local</a></div>
</div>
<div id="app">
    <router-view></router-view>
</div>
<ul class="navbar">
    <li><a :href="'#/index/'"><img src="../src/assets/location.png"><small>location</small></a></li>
    <li><a :href="'#/weather/'"><img src="../src/assets/sky.png"><small>weather</small></a></li>
    <li><a :href="'#/star/'"><img src="../src/assets/star.png"><small>favorite</small></a></li>
    <li><a :href="'#/setting/'"><img src="../src/assets/settings.png"><small>setting</small></a></li>
</ul>
</template>
<script>
export default {
  replace: false
}
</script>
<style>
html,body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  font-size: 16px;
  font-family: Source Sans Pro, Helvetica, sans-serif;
  background-color: #f7f7f7;
}
* {
  box-sizing: border-box;
  outline: 0 none!important;
}
@media (min-width: 768px) { 
  #app {
    max-width: 600px;
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
  color: #fff;
  text-decoration: none;
  outline: none;
  font-family: Arial;
}
.logo {
  height: 50px;
  font-size: 1.5rem;
  line-height: 50px;      
  position: absolute;
  width: 100px;
  font-family: Tahoma,Arial;
  font-weight: bold;
  padding: 0 0 0 20px;
  background-color: #2c3e50;
}
.logo::after {
    content: '';
    height: 0;
    display: inline-block;
    position: absolute;
    right: -50px;
    margin: 0;
    padding: 0;
    border-left: solid 25px #2c3e50;
    border-top: solid 25px transparent; 
    border-right:  25px solid transparent;
    border-bottom: 25px solid transparent;
}

.topbar {
  width: 100%;
  height: 50px;
  position: absolute;
  top: 0;
  margin: 0;
  padding: 0;
  background-color: #00a388; 
  z-index: 999;
}
.navbar {
  position: fixed;
  bottom: 0;
  width: 100%;
  margin: 0;
  padding: 0;
  height: 50px;
  text-align: center;
  background-color: #00a388;
}
ul.navbar li {
list-style: none;
position: relative;
display: inline-block;
width: 23%;
padding: 5px 0;
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
