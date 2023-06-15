import emitter from 'tiny-emitter/instance';

export default {
  $on: emitter.on,
  $once: emitter.once,
  $off: emitter.off,
  $emit: emitter.emit,
};
