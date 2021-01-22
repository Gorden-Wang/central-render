<template>
  <div class="default-footer">
    <div class="default-footer_top">
      <div class="default-footer_inner">
        <SocialList
          :klook="klook"
          :sns-icons="snsIcons"
        ></SocialList>
        <EmailSubscribe
          v-if="!klook.is_guest_checkout && klook.language !== 'ja'"
          
          :email="email"
        ></EmailSubscribe>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// import { Component, Vue, State } from 'nuxt-property-decorator'
import { Component, Vue, Prop } from 'vue-property-decorator'
import SocialList from './social-list.vue'
import EmailSubscribe from './email-subscribe.vue'

@Component({
  components: {
    SocialList,
    EmailSubscribe
  }
})
export default class DefaultFooter extends Vue {
  // @State klook!: Data.Klook
   @Prop({ default: () => {
     return {
     websiteConfig: {},
     utilConfig: {},
     language: ''
   }
   } }) readonly klook!: AnyObjectType

   @Prop({ default: () => {
    return []
  } }) readonly snsIcons!: AnyObjectType


   @Prop({ default: () => {
    return []
  } }) readonly email!: AnyObjectType

  changSiteModelVisible = false
}
</script>

<style lang="scss">
$prefix: '.default-footer';
$content-width: 1160px;
$color-gray: 'red';

#{$prefix} {
  min-width: 1280px;
  background-color: #333;
  font-size: 14px;
  color: $color-gray;
}

#{$prefix}_top {
  padding: 30px 0;
}

#{$prefix}_bottom {
  padding: 42px 0 11px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

#{$prefix}_beian {
  height: 46px;
  line-height: 46px;
  font-size: 12px;
  text-align: center;

  p {
    flex: 1;
  }

  a {
    color: $color-gray;
  }
}

#{$prefix}_inner {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: $content-width;
  margin-left: auto;
  margin-right: auto;
}

#{$prefix}_copyright {
  width: 220px;
  margin-bottom: 30px;
  line-height: 18px;
  font-size: 12px;

  a {
    color: $color-gray;
  }
}

#{$prefix}_business-license {
  display: block;
  margin-top: 12px;
}

#{$prefix}_change-website {
  display: block;
  margin-top: 12px;
  cursor: pointer;
}

#{$prefix}_dathongbao{
  margin-top: 12px;
  margin-bottom: 24px;
  .i_dathongbao{
    display: inline-block;
    width: 100px;
    height: 40px;
  }
}
#{$prefix}_mobile-entry {
  display: block;
  width: 158px;
  height: 40px;
  line-height: 40px;
  border: 1px solid #fff;
  border-radius: 5px;
  text-align: center;
  color: #fff;
}

#{$prefix}_links {
  font-size: 14px;

  span {
    line-height: 17px;
    color: #fff;
  }

  ul {
    margin-top: 20px;
  }

  li {
    margin-bottom: 8px;
  }

  a {
    color: $color-gray;
  }
}

#{$prefix}_other {
  width: 214px;
}

#{$prefix}_ask {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 42px;
  margin-bottom: 30px;
  border: 1px solid #888;
  color: $color-gray;
  font-size: 16px;

  &:hover {
    border-color: #fff;
    color: #fff;
  }
}

#{$prefix}_payment {
  ul {
    display: flex;
    flex-wrap: wrap;
    margin-top: 20px;
  }

  li {
    margin-right: 13px;
    margin-bottom: 18px;
  }
}

#{$prefix}_ko {
  width: $content-width;
  padding-top: 20px;
  padding-bottom: 30px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.8;
  font-size: 12px;
  text-align: center;

  a {
    color: #999;
    text-decoration: underline;
  }
}

#{$prefix}_hotline {
  font-size: 14px;
  color: #999999;
  margin-bottom: 24px;

  div:nth-child(1) {
    font-weight: 600;
    line-height: 17px;
    margin-bottom: 4px;
  }

  div:nth-child(2) {
    line-height: 17px;
    margin-bottom: 4px;
  }

  div:nth-child(3) {
    color: #ffffff;
    font-size: 22px;
    font-weight: 600;
    line-height: 26px;
  }
}
</style>
