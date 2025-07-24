import { addFirebaseAccount } from '~~/server/db/firebase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  try {
    const result = await addFirebaseAccount(body)
    return { code: 0, data: result }
  } catch (e) {
    throw createError({
      statusCode: 500,
      message: String(e)
    })
  }
})
