import Vue from 'vue';
import Component from 'vue-class-component';
import dinero from 'dinero.js';

@Component
export default class Formatters extends Vue {
  /*
    Function to make dinero usable in the template
  */
  dinero: Function = dinero;
}
