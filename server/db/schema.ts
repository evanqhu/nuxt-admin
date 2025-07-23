/** 数据库表结构 */
import { mysqlTable, int, varchar, text, json } from 'drizzle-orm/mysql-core'

/** projects 表 */
export const projects = mysqlTable('projects', {
  // 项目主键，自增
  project_id: int('project_id').primaryKey().autoincrement(),
  // 项目名称
  project_name: varchar('project_name', { length: 255 }).notNull().unique(),
  // 前端开发负责人
  frontend_developer: varchar('frontend_developer', { length: 255 }),
  // 后端开发负责人
  backend_developer: varchar('backend_developer', { length: 255 }),
  // 域名选项，JSON 格式
  domain_options: json('domain_options'),
  // 广告位选项，JSON 格式
  ad_slot_options: json('ad_slot_options'),
  // 仓库地址
  repo: varchar('repo', { length: 255 }),
  // 备注
  remark: text('remark')
})

/** adsense_accounts 表 */
export const adsenseAccounts = mysqlTable('adsense_accounts', {
  // Adsense 账号主键，自增
  account_id: int('account_id').primaryKey().autoincrement(),
  // 账号名称
  account_name: varchar('account_name', { length: 255 }).notNull().unique(),
  // 客户端 ID
  client_id: varchar('client_id', { length: 255 }),
  // ads.txt 内容
  ads_txt: text('ads_txt'),
  // 备注
  remark: text('remark')
})

/** firebase_accounts 表 */
export const firebaseAccounts = mysqlTable('firebase_accounts', {
  // Firebase 账号主键，自增
  account_id: int('account_id').primaryKey().autoincrement(),
  // 账号名称
  account_name: varchar('account_name', { length: 255 }).notNull().unique(),
  // 账号信息，JSON 格式
  account_info: json('account_info'),
  // 备注
  remark: text('remark')
})

/** domains 表（总表） */
export const domains = mysqlTable('domains', {
  // 域名主键，自增
  domain_id: int('domain_id').primaryKey().autoincrement(),
  // 域名
  domain: varchar('domain', { length: 255 }).notNull().unique(),
  // 域名信息，JSON 格式
  domain_info: json('domain_info'),
  // 广告位信息，JSON 格式
  ad_slots: json('ad_slots'),
  // 备注
  remark: text('remark'),

  // 所属项目 ID，外键
  project_id: int('project_id').notNull().references(() => projects.project_id),
  // 关联的 Adsense 账号 ID，外键
  adsense_account_id: int('adsense_account_id').references(() => adsenseAccounts.account_id),
  // 关联的 Firebase 账号 ID，外键
  firebase_account_id: int('firebase_account_id').references(() => firebaseAccounts.account_id)
})
