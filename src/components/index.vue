<template>
<ul class="navigation">
    <li><a :href="'#/index/location/'">location</a></li>
    <li><a :href="'#/index/global/'">global</a></li>
</ul>
<router-view></router-view>
</template>
<script>
export default {
  name: 'index'
}
</script>
<style scoped>
.navigation {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 30px;
    position: fixed;
    top: 50px;
    left: 0;
    line-height: 30px;
    background-color: gold;
    z-index: 9999;
}
.navigation li {
    display: inline-block;
    list-style: none;
    margin: 0 10px;
    padding: 0 15px;
    height: 100%;
}
li a {
    color: #000;
}
</style>
