
import Vue from 'vue';
import app from './index';

window.addEventListener('componentLoad', (e: AnyObjectType) => {
    const {
        id,
        data,
    } = e.detail
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
