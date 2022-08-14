import Vue from 'vue';
import Component from 'vue-class-component';
import dinero from 'dinero.js';

@Component
export default class Formatters extends Vue {
  /*
    Function to make dinero usable in the template
  */
  dinero: Function = dinero;

  static dateFromObj(date: Date) {
    let d = date;
    const offset = d.getTimezoneOffset();
    d = new Date(d.getTime() - (offset * 60 * 1000));
    return d.toISOString().split('T')[0];
  }

  static timeFromObj(date: Date) {
    let d = date;
    const offset = d.getTimezoneOffset();
    d = new Date(d.getTime() - (offset * 60 * 1000));
    return d.toISOString().split('T')[1].split('.')[0];
  }
}
