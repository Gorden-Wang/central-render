import { VueConstructor } from 'vue'
import { Vue } from 'vue-property-decorator'
import './css/index.scss'

const plugin = {
    install(vue: VueConstructor) {
        vue.prototype.$t = (str: string) => str
        vue.prototype.$href = (str: string) => str
    }
}
Vue.use(plugin)

export { default } from '~/components/footer/main.vue'

