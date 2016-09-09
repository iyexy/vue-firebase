<template>
<a class="chat" href="#/index/chat"><img src="../assets/livechat.png"></a>
</template>
<script>
export default {
  name: 'chatbtn'
}
</script>
<style scoped>
.chat {
    position: fixed;
    bottom: 65px;
    right: 15px;
    border-radius: 50%;
    border: none;
}
.chat img {
  transform: rotateY(180deg);
}
</style>