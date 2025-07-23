export interface IProjectAdd {
  project_name: string
  frontend_developer?: string
  backend_developer?: string
  domain_options?: string[]
  ad_slot_options?: string[]
  repo?: string
  remark?: string
}

export interface IProjectEdit extends IProjectAdd {
  project_id: number
}

/** 删除一个项目 */
export async function deleteProject(project_id: number | number[]) {
  return $fetch('/api/project/delete', {
    method: 'POST',
    body: {
      project_id
    }
  })
}

/** 新增一个项目 */
export async function addProject(data: IProjectAdd) {
  return $fetch('/api/project/add', {
    method: 'POST',
    body: data
  })
}

/** 编辑一个项目 */
export async function editProject(data: IProjectEdit) {
  return $fetch('/api/project/edit', {
    method: 'POST',
    body: data
  })
}
