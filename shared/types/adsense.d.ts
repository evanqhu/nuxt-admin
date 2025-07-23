export type AdsenseItem = {
  account_id: number
  account_name: string
  client_id: string
  ads_txt: string
  remark?: string
}

/** 新增 Adsense 账号时的类型，去掉 account_id */
export type IAdsenseAdd = Omit<AdsenseItem, 'account_id'>
