/** 项目列表项 */
export type ProjectItem = {
  project_id: number
  project_name: string
  frontend_developer?: string
  backend_developer?: string
  domain_options?: string[]
  ad_slot_options?: string[]
  repo?: string
  remark?: string
}

/** 新增项目时的类型，去掉 project_id */
export type IProjectAdd = Omit<ProjectItem, 'project_id'>
