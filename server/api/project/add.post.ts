import { addProject } from '~~/server/db/project'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  try {
    const result = await addProject(body)
    return { code: 0, data: result }
  } catch (e) {
    throw createError({
      statusCode: 500,
      message: String(e)
    })
  }
})
