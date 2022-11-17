<template>
  <div class="custom-scrollbar" @mousedown.capture="e => startDrag(e)" @mousemove.capture="e => drag(e)" @mouseleave="e => stopDrag(e)" @click.capture="e => stopDrag(e)" ref="scrollbar">
    <slot></slot>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class Scrollable extends Vue {
  private dragYStart = 0;
  private dragScrollStart = 0;
  private dragging: boolean = false;
  private hasDragged: boolean = false;

  startDrag(e: MouseEvent) {
    e.preventDefault();
    this.dragYStart = e.clientY;
    this.dragScrollStart = (this.$refs.scrollbar as HTMLElement).scrollTop;
    this.dragging = true;
  }

  drag(e: MouseEvent) {
    if(!this.dragging) return;

    const delta = e.clientY - this.dragYStart;
    (this.$refs.scrollbar as HTMLElement).scrollTop = this.dragScrollStart - delta;
    this.hasDragged = true;
  }

  stopDrag(e: MouseEvent) {
    if(!this.dragging) return;

    if(this.hasDragged) {
      e.stopImmediatePropagation();
      e.stopPropagation();
    }
    
    this.dragging = false;
    this.hasDragged = false;
  }
}
</script>
<style lang="scss" scoped>
@mixin scrollbar($prefix) {
  &::#{$prefix}-scrollbar {
    width: $scroll-bar-width;
  }
  &::#{$prefix}-scrollbar-thumb{
    border: 1px solid $gewis-red;
    min-height: $scroll-bar-width;
    background: white;
    border-radius: 5px;
  }
  &::#{$prefix}-scrollbar-track{
    width: $scroll-bar-width;
    background: $gewis-red;
  }
  /* Buttons */
  &::#{$prefix}-scrollbar-button:single-button {
    background-color: $gewis-red;

    display: block;
    background-size: 20px;
    background-repeat: no-repeat;
  }

  /* Up */
  &::#{$prefix}-scrollbar-button:single-button:vertical:decrement {
    height: 32px;
    width: $scroll-bar-width;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    background-position: center 10px;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='rgb(255, 255, 255)'><polygon points='50,00 0,50 100,50'/></svg>");
  }

  /* Down */
  &::#{$prefix}-scrollbar-button:single-button:vertical:increment {
    height: 32px;
    width: $scroll-bar-width;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    background-position: center 10px;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='rgb(255, 255, 255)'><polygon points='0,0 100,0 50,50'/></svg>");
  }
}

.custom-scrollbar {
  width: 100%;
  height: 100%;
  scrollbar-width: $scroll-bar-width;
  overflow-y: auto;

  @include scrollbar(-webkit);
  @include scrollbar(-moz);
}
</style>