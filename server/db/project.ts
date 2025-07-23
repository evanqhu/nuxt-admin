import { db } from './index'
import { projects } from './schema'
import { eq, desc } from 'drizzle-orm'

/** 查询所有项目 */
export async function getAllProjects() {
  return await db.select().from(projects).orderBy(desc(projects.project_id))
}

/** 新增一个项目 */
export async function addProject(projectData: {
  project_name: string
  frontend_developer?: string
  backend_developer?: string
  domain_options?: string[]
  ad_slot_options?: string[]
  repo?: string
  remark?: string
}) {
  try {
    const [inserted] = await db.insert(projects).values(projectData)
    return inserted
  } catch (e) {
    // 这里可以自定义错误处理，比如判断 error.code 是否为唯一约束冲突
    throw new Error('插入失败，可能是项目名重复')
  }
}

/** 修改一个项目 */
export async function updateProject(project_id: number, data: Partial<{
  project_name: string
  frontend_developer?: string
  backend_developer?: string
  domain_options?: string[]
  ad_slot_options?: string[]
  repo?: string
  remark?: string
}>) {
  return await db.update(projects).set(data).where(eq(projects.project_id, project_id))
}

/** 删除一个项目 */
export async function deleteProject(project_id: number) {
  return await db.delete(projects).where(eq(projects.project_id, project_id))
}
