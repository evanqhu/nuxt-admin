import { updateFirebaseAccount } from '~~/server/db/firebase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { account_id, ...data } = body || {}
  if (!account_id) {
    return { code: 400, message: '缺少 account_id' }
  }
  try {
    const result = await updateFirebaseAccount(account_id, data)
    return { code: 0, data: result }
  } catch (e) {
    return { code: 500, message: '编辑 Firebase 账号失败', error: String(e) }
  }
})
