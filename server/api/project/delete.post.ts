import { deleteProject } from '~~/server/db/project'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { project_id } = body || {}
  if (project_id === undefined || project_id === null || (Array.isArray(project_id) && project_id.length === 0)) {
    return { code: 400, message: '缺少 project_id' }
  }
  try {
    // project_id 可以是单个 number 或 number[]
    const result = await deleteProject(project_id)
    return { code: 0, data: result }
  } catch (e) {
    return { code: 500, message: '删除项目失败', error: String(e) }
  }
})
