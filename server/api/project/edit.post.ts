import { updateProject } from '~~/server/db/project'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { project_id, ...data } = body || {}
  if (!project_id) {
    return { code: 400, message: '缺少 project_id' }
  }
  try {
    const result = await updateProject(project_id, data)
    return { code: 0, data: result }
  } catch (e) {
    return { code: 500, message: '编辑项目失败', error: String(e) }
  }
})
