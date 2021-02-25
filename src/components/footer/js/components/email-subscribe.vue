<template>
  <div class="wrapper">
    <div class="tip">
      <span>{{ email.title }}</span>
      <p v-html="`${email.subTitle}<a href='${email.conditions.url}'>${email.conditions.text}</a>`"></p>
    </div>
    <div class="input">
      <input
        v-model="emailString"
        type="text"
        :placeholder="email.input.placeholder"
        :disabled="disbaled"
        @keyup.enter="handleSubmit"
      />
      <button
        type="button"
        data-track-event="Email Subscription|Newsletter Subscribed"
        @click="handleSubmit"
      >
        {{ email.input.submit }}
      </button>
      <div
        v-show="loading"
        class="loading"
      ></div>
    </div>
    <div v-show="message.value">
      <span>{{ message.value }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { urlTemplate,emailCreateSubscribe } from '~/lib/util'
import axios from 'axios'

interface Message {
  type: string
  value: string
}

@Component
export default class EmailSubscribe extends Vue {

 @Prop({ default: () => {
    return {}
  } }) readonly email!: AnyObjectType

  emailString = ''
  disbaled = false
  loading = false
  message: Message = {
    type: 'success',
    value: ''
  }

  checkEmail(email: string): boolean {
    const reg = /^[a-zA-Z0-9_-]+(\.([a-zA-Z0-9_-])+)*@[a-zA-Z0-9_-]+[.][a-zA-Z0-9_-]+([.][a-zA-Z0-9_-]+)*$/

    return reg.test(email)
  }

  subscrib(email: string, cb: CallbackType): void {

    axios
      .post(urlTemplate(emailCreateSubscribe, { email }))
      .then((res: AnyObjectType) => {
        if (res.success) {
          cb(null)
        } else {
          cb(res.error)
        }
      })
      .catch((error: AnyObjectType) => {
        cb(error)
      })
  }

  handleSubmit(): void {
    const { emailString } = this

    this.message = {
      type: 'success',
      value: ''
    }

    if (!emailString) {
      return
    }

    if (!this.checkEmail(emailString)) {
      this.message = {
        type: 'error',
        value: this.$t('subscribe.error.email_invalid') as string
      }
      return
    }

    this.disbaled = true
    this.loading = true
    this.subscrib(emailString, (error: AnyObjectType) => {
      this.disbaled = false
      this.loading = false

      if (!error) {
        this.message = {
          type: 'success',
          value: this.$t('subscribe.success') as string
        }
      } else {
        this.message = {
          type: 'error',
          value: error.message
        }
      }
    })
  }
}
</script>

<style lang="scss" scoped>
@import '~/src/lib/css/variables.scss';
.wrapper {
  display: flex;
  position: relative;
  max-width: 950px;
}

.tip {
  text-align: right;
  margin-right: 18px;

  span {
    font-size: 14px;
    color: #fff;
  }

  p {
    display: inline-block;
    width: 480px;
    margin-top: 8px;
    line-height: 1.3;
    color: #999;
    font-size: 12px;
  }

  a {
    color: #999;
    text-decoration: underline;
  }
}

.input {
  display: flex;
  position: relative;

  input {
    width: 259px;
    height: 42px;
    padding: 7px 12px;
    border: 1px solid $color-gray2;
    border-radius: 2px 0 0 2px;
    outline: none;
    font-size: 14px;

    &:focus {
      border: 1px solid $color-main;
    }
  }

  button {
    width: 101px;
    height: 42px;
    background-color: $color-main;
    border: 1px solid $color-main;
    border-radius: 0 2px 2px 0;
    outline: none;
    color: #fff;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      opacity: 0.8;
    }
  }
}

.message {
  display: flex;
  align-items: center;
  position: absolute;
  right: 0;
  bottom: -24px;

  &:global(.success) {
    color: #fff;
  }

  &:global(.error) {
    color: red;
  }

  svg {
    margin-right: 5px;
  }
}

.loading {
  position: absolute;
  top: 9px;
  left: 225px;
  width: 24px;
  height: 24px;
  border-top: 3px solid $color-gray2;
  border-right: 3px solid $color-gray2;
  border-bottom: 3px solid $color-gray2;
  border-left: 3px solid $color-main;
  border-radius: 50%;
  animation: spin 1.1s infinite linear;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
