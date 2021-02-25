<template>
  <ul class="wrapper">
    <li
      v-for="(item,index) in snsIcons"
      :key="index"
    >
      <a
        :href="item.link"
        data-track-event="Social Media|Social Media Clicked|Facebook"
        target="_blank"
      >
        <SvgIcon
          :url="item.image"
          class="sns-icon"
          :width="22"
          :height="22"
        />
      </a>
    </li>
  </ul>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import SvgIcon from '~/lib/svg-icon.vue'

const languageIconMap: Record<string, string> = {
  th: 'social-line',
  ko: 'social-kakaotalk'
}

@Component({
  components: {
    SvgIcon
  }
})
export default class SocialList extends Vue {
  @Prop({ default: () => {
    return {}
  } }) readonly klook!: AnyObjectType

  @Prop({ default: () => {
    return []
  } }) readonly snsIcons!: AnyObjectType

  get lang2icon(): string {
    return languageIconMap[this.klook.language] || 'social-wechat'
  }

  get showWechat(): boolean {
    return !['ja', 'ko', 'de', 'it', 'fr', 'ru', 'es'].includes(this.klook.language)
  }
}
</script>

<style lang="scss" scoped>
@import '~/src/lib/css/variables.scss';
.wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 214px;
  height: 42px;
  font-size: 14px;

  .sns-icon {
    // color: #888;
    font-size:22px;
  }

  &:lang(zh-Hans-CN) {
    width: 274px;
  }

  &:lang(ja),
  &:lang(ko),
  &:lang(de),
  &:lang(it),
  &:lang(fr),
  &:lang(ru),
  &:lang(es) {
    width: 160px;
  }

  a {
    display: inline-block;
    position: relative;
    color: #888;

    &:hover {
      color: #d5d5d5;

      .pop {
        display: block;
      }
    }
  }
}

.pop {
  display: none;
  position: absolute;
  top: -140px;
  left: -56px;
  width: 130px;
  height: 138px;

  .qr {
    display: inline-block;
  }
}
</style>
