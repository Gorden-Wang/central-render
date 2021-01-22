type anyObject = {
  [key: string]: string
}
export function urlTemplate(url: string, params: anyObject): string {
    return url.replace(/:([a-z]+)/gi, (_m, p1) => {
      if (!params[p1]) {
        throw new Error(`url parameter not find: ${url}`)
      }
  
      return params[p1]
    })
}

export const emailCreateSubscribe = '/v1/websrv/subscribe/:email/create';// POST 关联订阅邮件