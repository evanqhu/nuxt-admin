import { getAllFirebaseAccounts } from '~~/server/db/firebase'

export default defineEventHandler(async () => {
  try {
    const data = await getAllFirebaseAccounts()
    return data
  } catch (e) {
    throw createError({
      statusCode: 500,
      statusMessage: '查询 Firebase 账号列表失败',
      data: String(e)
    })
  }
})
