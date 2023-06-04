<template>
  <div class="nav-item active button" @click="$emit('click')">
    <div class="nav-link">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"/></svg>
    </div>
  </div>
</template>
<style scoped lang="scss">
.button {
  height: 62px;
  width: 62px;

  .nav-link {
    padding: 16px !important;
    height: 62px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  svg {
    width: 30px;
    height: 30px;
    fill: white;
  }
}
</style>
