<template lang="html">
  <Prdiv class="block"
         :svgActiveStyle="{
           stroke: '#bb1b45'
         }"
         :message="'Refreshing...'"
         :messageStyle="{
           color: '#e7557c',
           fontSize: '.9em'
         }"
         :onRefresh="onRefresh">
    <div class="p p3"/>
    <div class="p p5"/>
    <div class="p p2"/>
    <div class="p p4"/>
    <div class="p p5"/>
  </Prdiv>
</template>

<script>
import Prdiv from 'components/Prdiv';
export default {
  components: {Prdiv},
  methods: {
    onRefresh() {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, 3000)
      });
    }
  }
}
</script>

<style>
body {
  margin: 0;
}
</style>

<style scoped>
.block {
  height: 100vh;
  width: 100vw;
  background: #222;
  padding: 1em;
  box-sizing: border-box;
}

.p {
  background: #ccc;
  margin: 1em;
}

.p2 {
  height: 2em;
  width: 20%;
}

.p3 {
  height: 2em;
  width: 30%;
}

.p4 {
  height: 2em;
  width: 40%;
}

.p5 {
  height: 2em;
  width: 50%;
}
</style>
