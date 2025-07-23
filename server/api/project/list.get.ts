import { getAllProjects } from '~~/server/db/project'

export default defineEventHandler(async () => {
  try {
    const data = await getAllProjects()
    return data
  } catch (e) {
    throw createError({
      statusCode: 500,
      statusMessage: '查询项目失败',
      data: String(e)
    })
  }
})
