<template>
  <header class="wrapper">
    <div class="inner">
      <!-- left start -->
      <div class="left">
        <ul class="list">
          <!-- logo start -->
          <li class="logoBox">
            <a
              class="logo"
              :href="$href('/')"
            >
              <Logo></Logo>
            </a>
            <span class="logoTxt">{{ $t('blog') }}</span>
          </li>
          <!-- logo end -->
          <!-- 菜单面板 start -->
          <!-- 搜索 end -->
        </ul>
      </div>
      <div
        class="right"
        @hover="showPoptip"
      >
        <div
          class="selectDestination"
        >
          <div class="selectButton">
            {{ $t('select_destination') }}
            <div class="popper">
              <div class="popperArrow"></div>
              <div class="popperInner">
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- right end -->
    </div>
  </header>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Logo from './svg-logo.vue'

@Component({
  components: {
    Logo
  }
})
export default class Header extends Vue {

  isShowPoptip = false


  showPoptip(): void {
    this.isShowPoptip = true
  }
}
</script>

<style lang="scss" scoped>
@import '~/src/lib/css/variables.scss';
.wrapper {
  position: fixed;
  z-index: $zindex-header;
  width: 100%;
  background-color: #fff;
  border-bottom: 1px solid $color-gray2;
  box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.2);
}

.inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  height: 64px;
  padding: 0 24px;
}

.left {
  .list {
    display: flex;
    align-items: center;

    > li {
      > a,
      .link {
        display: flex;
        align-items: center;
        height: 24px;
        white-space: nowrap;
      }
    }

    > li + li {
      margin-left: 24px;
    }

    svg,
    .label {
      flex-shrink: 0;
    }

    .label {
      margin-left: 8px;
      font-size: 16px;
    }
  }
}

.logoBox{
  display: flex;
  align-items: center;
  .logo {
    display: inline-block;
    height: 24px;
    padding-right: 12px;
    border-right: 1px solid #000;
    img {
      width: auto;
      height: 100%;
    }
  }
  .logoTxt{
    border: 1px solid #000;
      border-radius: 13px;
      padding: 4px 10px;
      margin-left: 15px;
      font-size: 14px;
      cursor: pointer;
  }
}

.right {
  cursor: pointer;
  .areaSelector{
      font-size: 14px;
      // text-align: left;
    }
  .icon{
    width: 12px;
    height: 12px;
  }
  .list {
    display: flex;
    align-items: center;
    padding: 0;
    margin: 0;
    list-style: none;

    > li {
      margin-left: 28px;
    }
  }
  .selectDestination{
    position: relative;
    .selectButton{
      &:hover{
        .popper{
          display: block;
        }
      }
    }
    .popper{
      position: absolute;
      display: none;
      top: 30px;
      right: 0;
      padding: 16px;
      background-color: #fff;
      border-radius: 2px;
      box-shadow: 0 3px 6px 0 rgba(0,0,0,.12), 0 -1px 3px 0 rgba(0,0,0,.08);
      .popperArrow{
        left: inherit;
        right: 9px;
        margin-left: -7px;
        top: -20px;
        display: block;
        width: 100px;
        height: 40px;
        position: absolute;
      }
      .popperInner{
        overflow-y: auto;
        width: 500px;
        max-height: 580px;
        .areaSelector{
        }
      }
    }
  }
}

</style>
