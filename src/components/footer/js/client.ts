
import Vue from 'vue';
import app from './app/index';

window.addEventListener('componentLoad', (e: AnyObjectType) => {
    const {
        id,
        data,
        name,
    } = e.detail
    if (name !== 'footer')  return
    const vm = new Vue({
        components: { app },
        render: h => {
          const res = h(
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
          console.log(res)
          return res
        },
      });
    vm.$mount(`${e.detail.id}`)
})
