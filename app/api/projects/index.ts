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
export async function editProject(data: ProjectItem) {
  return $fetch('/api/project/edit', {
    method: 'POST',
    body: data
  })
}
