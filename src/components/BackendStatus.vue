<template>
  <div class="backend-status-container" v-if="online">
    <span class="backend-status-dot pulsation" style="background-color: green;" />
    <span style="color: green;">SudoSOS online</span>
  </div>
  <div class="backend-status-container" v-else>
    <span class="backend-status-dot" style="background-color: red;" />
    <span style="color: red;">SudoSOS offline</span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import APIHelper from '@/mixins/APIHelper';

const PING_INTERVAL = 10000; // ms

@Component
export default class BackendStatus extends Vue {
  private online: boolean = true;

  private pingInterval;

  mounted() {
    this.pingBackend();
    this.pingInterval = setInterval(this.pingBackend.bind(this), PING_INTERVAL);
  }

  pingBackend() {
    APIHelper.getResource('ping', null, {
      pragma: 'no-cache',
      'cache-control': 'no-cache',
    }).then((res) => {
      if (res === 'Pong!') {
        this.online = true;
        console.log('SudoSOS online!!!');
      } else {
        this.online = false;
        console.log('SudoSOS offline :(');
      }
    });
  }

  unmounted() {
    clearInterval(this.pingInterval);
  }
}
</script>

<style scoped lang="scss">
.backend-status-container {
  display: flex;

  span {
    display: inline-block;
    white-space: nowrap;
  }
}

.backend-status-dot {
  height: 15px;
  width: 15px;
  border-radius: 50%;
  margin-top: 6px;
  margin-left: 10px;
  margin-right: 7px;
}

.pulsation {
  animation: opacityPulse 5s ease-out;
  animation-iteration-count: infinite;
  opacity: 0;
}

@-webkit-keyframes opacityPulse {
  0% {opacity: 1.0;}
  50% {opacity: 1.0;}
  75% {opacity: 0.0;}
  100% {opacity: 1.0;}
}
</style>
