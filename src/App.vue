<template>
<div class="topbar">
    <span class="logo"><a href="#">Local</a></span>
</div>
<div id="app">
    <router-view></router-view>
</div>
<ul class="navbar">
    <li><a :href="'#/location/'"><h3>location</h3></a></li>
    <li><a :href="'#/weather/'"><h3>weather</h3></a></li>
    <li><a :href="'#/setting/'"><h3>setting</h3></a></li>
</ul>
</template>
<script>
export default {
  replace: false
}
</script>
<style>
* {
  box-sizing: border-box;
  outline: 0 none!important;
}
html,body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  font-size: 1em;
  font-family: Source Sans Pro, Helvetica, sans-serif;
  background-color: #f7f7f7;
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
}
.logo {
  font-size: 1.3em;
  line-height: 50px;
  position: absolute;
  left: 15px;
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
display: inline-block;
width: 30%;
line-height: 12px;
}
</style>
