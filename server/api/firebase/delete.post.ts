import { deleteFirebaseAccount } from '~~/server/db/firebase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { account_id } = body || {}
  if (account_id === undefined || account_id === null || (Array.isArray(account_id) && account_id.length === 0)) {
    return { code: 400, message: '缺少 account_id' }
  }
  try {
    // account_id 可以是单个 number 或 number[]
    const result = await deleteFirebaseAccount(account_id)
    return { code: 0, data: result }
  } catch (e) {
    return { code: 500, message: '删除 Firebase 账号失败', error: String(e) }
  }
})
