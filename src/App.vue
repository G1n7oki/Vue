<template>
  <div id="app">
    <Header />
    <Nav />
    <keep-alive>
      <router-view />
    </keep-alive>
    <Player />
  </div>
</template>

<script>
  import Header from 'components/header/Header'
  import Nav from 'components/nav/Nav'
  import Player from 'components/player/Player'

  export default {
    name: 'App',
    components: {
      Header,
      Nav,
      Player
    }
  }
</script>

<style lang="less" scoped>
</style>
