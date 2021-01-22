<template>
  <span 
    ref="icon"
    :class="['svg-icon','svg-wrap', colorClass]"
    :width="attrWidth"
    :style="attrStyle"
  ></span>
</template>

<script lang="ts">
import axios from 'axios'
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class SvgIcon extends Vue {
  @Prop({ required: true }) readonly url!: string
  @Prop({ default: true }) readonly scoped!: boolean
  @Prop({ type: [String, Number] }) readonly width?: string | number
  @Prop({ type: [String, Number] }) readonly height?: string | number
  @Prop({ type: [String, Number] }) readonly size?: string | number
  @Prop({ type: String }) readonly color?: string

  get colorClass(): string | undefined {
    const color = this.color
    const style = this.attrStyle

    if (color && !style) {
      return `klook-symbol-${color}`
    }
  }

  get attrWidth(): string | number | undefined{
    return this.width ? this.width : this.size
  }

  get attrHeight(): string | number | undefined {
    return this.height ? this.height : this.size
  }

  get attrStyle(): AnyObjectType | undefined {
    const color = this.color
    if (color && /#|rgba?/.test(color)) {
      return { color }
    }
  }


  mounted(): void {
    if (!this.url) {
      return
    }
    try {
      axios.get(this.url).then(res => {
        const doc = new DOMParser().parseFromString(res.data, 'text/html')
        let svg = doc.getElementsByTagName('svg')[0];
        this.width && svg.setAttribute("width",`100%`);
        svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
        (this.$refs.icon as Element).appendChild(svg)
        
      })
    }catch (e) {
      console.log('image load failed')
    }
  }
}
</script>

<style lang="scss">
.svg-wrap {
  position:relative;
  display: inline-block;
  width:22px;
  height: 22px;

  svg {
    position:absolute;
    fill: currentColor;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }
}
.klook-symbol-gray-900 {
  color: #333;
}
.klook-symbol-gray-800 {
  color: #666;
}
.klook-symbol-gray-888 {
  color: #888;
}
.klook-symbol-gray-700 {
  color: #999;
}
.klook-symbol-gray-600 {
  color: #b2b2b2;
}
.klook-symbol-gray-500 {
  color: #ccc;
}
.klook-symbol-white-500 {
  color: #fff;
}
.klook-symbol-primary-500 {
  color: #ff5722;
}
.klook-symbol-primary-600 {
  color: #f44f1b;
}
.klook-symbol-primary-800 {
  color: #d84315;
}
.klook-symbol-error-500 {
  color: #e64340;
}
.klook-symbol-error-600 {
  color: #db3532;
}
.klook-symbol-error-800 {
  color: #c72320;
}
.klook-symbol-warning-500 {
  color: #ff9d26;
}
.klook-symbol-warning-600 {
  color: #f58b1b;
}
.klook-symbol-warning-800 {
  color: #f07916;
}
.klook-symbol-success-500 {
  color: #16aa77;
}
.klook-symbol-success-600 {
  color: #0a9967;
}
.klook-symbol-success-800 {
  color: #0b8d60;
}
.klook-symbol-info-500 {
  color: #4985e6;
}
.klook-symbol-info-600 {
  color: #3b75d9;
}
.klook-symbol-info-800 {
  color: #2c61c9;
}
</style>
