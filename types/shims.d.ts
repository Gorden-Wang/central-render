declare module '*.png'

declare module '*.vue' {
  import Vue from 'vue'

  export default Vue
}

type AnyObjectType = {
  [key: string]: any
}

type CallbackType = (err: any) => void

interface Window {
  componentsData: AnyObjectType
}