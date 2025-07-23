import { getAllAdsenseAccounts } from '~~/server/db/adsense'

export default defineEventHandler(async () => {
  try {
    const data = await getAllAdsenseAccounts()
    return data
  } catch (e) {
    throw createError({
      statusCode: 500,
      statusMessage: '查询 Adsense 账号列表失败',
      data: String(e)
    })
  }
})
