
import Vue from 'vue';
import app from './app/index';

window.addEventListener('componentLoad', (e: AnyObjectType) => {
    const {
        id,
        data,
        name
    } = e.detail
    if (name !== 'header')  return
    const vm = new Vue({
        components: { app },
        render: h => {
          return h(
            'div',
            {
              class: `${id}`,
            },
            [
              h(app, {
                props: data,
              }),
            ],
          );
        },
      });
    vm.$mount(`${e.detail.id}`)
})
