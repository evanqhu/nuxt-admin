import { db } from './index'
import { projects } from './schema'
import { eq, desc, inArray } from 'drizzle-orm'

/** 查询所有项目 */
export async function getAllProjects() {
  return await db.select().from(projects).orderBy(desc(projects.project_id))
}

/** 新增一个项目 */
export async function addProject(projectData: IProjectAdd) {
  try {
    const [inserted] = await db.insert(projects).values(projectData)
    return inserted
  } catch (e) {
    // 这里可以自定义错误处理，比如判断 error.code 是否为唯一约束冲突
    throw new Error('插入失败，可能是项目名重复')
  }
}

/** 删除一个或多个项目 */
export async function deleteProject(project_id: number | number[]) {
  if (Array.isArray(project_id)) {
    return await db.delete(projects).where(inArray(projects.project_id, project_id))
  } else {
    return await db.delete(projects).where(eq(projects.project_id, project_id))
  }
}

/** 修改一个项目 */
export async function updateProject(project_id: number, data: Partial<IProjectAdd>) {
  return await db.update(projects).set(data).where(eq(projects.project_id, project_id))
}
