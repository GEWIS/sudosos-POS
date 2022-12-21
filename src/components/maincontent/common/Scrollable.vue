<template>
  <div 
    class="custom-scrollbar" 
    @mousedown.capture="e => startDrag(e)" 
    @mousemove.capture="e => drag(e)" 
    @mouseleave="e => stopDrag(e)" 
    @click.capture="e => stopDrag(e)" 
    ref="scrollbar">
    <slot></slot>
  </div>
</template>
<script lang="ts">
import { 
  Vue, Component 
} from 'vue-property-decorator';

/**
 * Component for a scrollable div. This component is used to make all the
 * children both draggable and add a custom styled scrollbar.
 */
@Component({
  components: {
  },
})
export default class Scrollable extends Vue {
  /**
   * The y position of the mouse when the drag started.
   */
  private dragYStart = 0;

  /** 
   * The scroll top of the scrollbar when the drag started.
   */
  private dragScrollStart = 0;

  /**
   * If the user is currently dragging.
   */
  private dragging: boolean = false;

  /**
   * If the user has dragged.
   */
  private hasDragged: boolean = false;

  /**
   * The momentum of the current dragging or what is left over of the momentum
   * after the dragging has stopped. If this value is higher than 0 it will
   * decay automatically.
   */
  private momentum: number = 0;

  /**
   * The last delta of the dragging.
   */
  private lastDelta: number = 0;

  $refs: {
    scrollbar: HTMLDivElement;
  };

  /**
   * Listens to when the user starts dragging. If the user starts dragging on
   * the scrollbar it will ignore this. Otherwise, it will prevent the default
   * behaviour of the mouse down event and start the dragging.
   * @param {MouseEvent} e The mouse event.
   */
  startDrag(e: MouseEvent) {
    const target = e.target as HTMLElement;

    if (e.offsetX > target.clientWidth) {
      return;
    }

    e.preventDefault();
    this.dragYStart = e.clientY;
    this.dragScrollStart = this.$refs.scrollbar.scrollTop;
    this.dragging = true;
    this.lastDelta = e.clientY - this.dragYStart;
  }

  /**
   * Listens to when the user is dragging. If the user is not dragging it will
   * ignore this. Otherwise, it will update the momentum value and scroll the
   * div by the calculated delta amount.
   * @param {MouseEvent} e The mouse event.
   */
  drag(e: MouseEvent) {
    if(!this.dragging) return;

    const delta = e.clientY - this.dragYStart;
    this.momentum = delta - this.lastDelta;
    this.lastDelta = delta;
    this.$refs.scrollbar.scrollTop = this.dragScrollStart - delta;
    this.hasDragged = true;
  }

  /**
   * Listens to when the user stops dragging. If the user is not dragging it
   * will ignore this. Otherwise, it will stop the dragging and if the momentum
   * was greater than 0 it will start the brake function. When the draggable
   * area is clicked it will only stop draggen if the user has actually dragged.
   * This is done to prevent the click event from being fired.
   * @param e 
   */
  stopDrag(e: MouseEvent) {
    if(!this.dragging) return;

    if(this.hasDragged) {
      e.stopImmediatePropagation();
      e.stopPropagation();
    }
    
    this.dragging = false;
    this.hasDragged = false;

    if(Math.abs(this.momentum) > 0) {
      this.brake();
    }
  }

  /**
   * The brake function. This function will decay the momentum value and scroll
   * the div by the calculated delta amount. If the momentum is greater than 0.1
   * it will call itself again after 10ms.
   */
  brake() {
    this.$refs.scrollbar.scrollTop -= this.momentum;
    this.momentum *= 0.8;

    if(Math.abs(this.momentum) > 0.1) {
      setTimeout(() => this.brake(), 10);
    }
    else {
      this.momentum = 0;
    }
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