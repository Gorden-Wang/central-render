import Vue from 'vue'
declare module 'vue/types/vue' {
    interface Vue {
      $t: (key: string, ...args: any[]) => string
    }
  }
  
  interface Window {
    Components: any;
  }
  interface WindowEventMap {
    componentLoad: string;
  }
  