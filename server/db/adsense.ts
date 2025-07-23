import { db } from './index'
import { adsenseAccounts } from './schema'
import { eq, desc, inArray } from 'drizzle-orm'

/** 查询所有 Adsense 账号 */
export async function getAllAdsenseAccounts() {
  return await db.select().from(adsenseAccounts).orderBy(desc(adsenseAccounts.account_id))
}

/** 新增一个 Adsense 账号 */
export async function addAdsenseAccount(adsenseData: IAdsenseAdd) {
  try {
    const [inserted] = await db.insert(adsenseAccounts).values(adsenseData)
    return inserted
  } catch (e) {
    // 这里可以自定义错误处理，比如判断 error.code 是否为唯一约束冲突
    throw new Error('插入失败，可能是 Adsense 账号名重复')
  }
}

/** 删除一个或多个 Adsense 账号 */
export async function deleteAdsenseAccount(account_id: number | number[]) {
  if (Array.isArray(account_id)) {
    return await db.delete(adsenseAccounts).where(inArray(adsenseAccounts.account_id, account_id))
  } else {
    return await db.delete(adsenseAccounts).where(eq(adsenseAccounts.account_id, account_id))
  }
}

/** 修改一个 Adsense 账号 */
export async function updateAdsenseAccount(account_id: number, data: Partial<IAdsenseAdd>) {
  return await db.update(adsenseAccounts).set(data).where(eq(adsenseAccounts.account_id, account_id))
}
