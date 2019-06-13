<template>
<router-link class="chat" to="/chat"><img src="../assets/livechat.png"></a>
</template>
<script>
export default {
  name: 'chatbtn'
}
</script>
<style scoped>
.chat {
    width: 25px;
    height: 25px;
    position: fixed;
    bottom: 35px;
    right: 10px;
    border-radius: 50%;
    border: none;
}
.chat img {
  width: 25px;
  height: 25px;
  transform: rotateY(180deg);
}
</style>