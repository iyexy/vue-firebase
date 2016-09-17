<template>
<a class="chat" href="#/chat"><img src="../assets/livechat.png"></a>
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
    bottom: 60px;
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