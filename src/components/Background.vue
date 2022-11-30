<template>
    <div v-if="isChristmas()" class="background">
      <!--      <img src="@/assets/img/base-gewis-logo.png" alt="logo" />-->
      <div class="snowflake" v-for="i in 12" :key="i"><div class="falling">❅</div></div>
    </div>
</template>
<script lang="ts">
import { Vue } from 'vue-property-decorator';
import Component from 'vue-class-component';

@Component({
  components: {},
})
export default class Background extends Vue {
  isChristmas() {
    const month = new Date().getMonth();
    const day = new Date().getDate();
    return (month == 10 && day >= 15) || (month == 11);
  }
}
</script>

<style scoped lang="scss">
.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
}

.snowflake {
  color: darken(lightblue, 10%);
  font-size: 50px;
  font-family: Arial, sans-serif;
  //text-shadow: 0 0 3px darken(lightblue, 20%);
  opacity: .5;
}

@keyframes snowflakes-fall{
  0%{
    transform:translate3d(0,-100px,0);
  }
  100%{
    transform:translate3d(0,100vh,0);
  }
}
@keyframes snowflakes-shake{
  0%,
  100%{
    transform:translate3d(0,0,0)
  }
  50%{
    transform:translate3d(80px,0,0)
  }
}
.falling {
  transform:translate3d(0,-100px,0);
  animation-name:snowflakes-fall;
  animation-duration:10s;
  animation-timing-function:linear;
  animation-iteration-count:infinite;
  will-change: transform;
}
.snowflake{
  position:fixed;
  -webkit-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none;
  cursor:default;
  animation-name:snowflakes-shake;
  animation-duration:3s;
  animation-timing-function:ease-in-out;
  animation-iteration-count:infinite;
  will-change: transform;
}
.snowflake:nth-of-type(0){
  left:1%;
  animation-delay:0s;
  .falling {
    animation-delay:0s;
  }
}
.snowflake:nth-of-type(1){
  left:10%;
  animation-delay:1s;
  .falling {
    animation-delay:1s;
  }
}
.snowflake:nth-of-type(2){
  left:20%;
  animation-delay:.5s;
  .falling {
    animation-delay:6s;
  }
}
.snowflake:nth-of-type(3){
  left:30%;
  animation-delay:2s;
  .falling {
    animation-delay:4s;
  }
}
.snowflake:nth-of-type(4){
  left:40%;
  animation-delay:2s;
  .falling {
    animation-delay:2s;
  }
}
.snowflake:nth-of-type(5){
  left:50%;
  animation-delay:3s;
  .falling {
    animation-delay:8s;
  }
}
.snowflake:nth-of-type(6){
  left:60%;
  animation-delay:2s;
  .falling {
    animation-delay:6s;
  }
}
.snowflake:nth-of-type(7){
  left:70%;
  animation-delay:1s;
  .falling {
    animation-delay:2.5s;
  }
}
.snowflake:nth-of-type(8){
  left:80%;
  animation-delay:0s;
  .falling {
    animation-delay:1s;
  }
}
.snowflake:nth-of-type(9){
  left:90%;
  animation-delay:1.5s;
  .falling {
    animation-delay:3s;
  }
}
.snowflake:nth-of-type(10){
  left:25%;
  animation-delay:0s;
  .falling {
    animation-delay:2s;
  }
}
.snowflake:nth-of-type(11){
  left:65%;
  animation-delay:2.5s;
  .falling {
    animation-delay:4s;
  }
}
</style>
