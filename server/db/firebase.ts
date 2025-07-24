import { db } from './index'
import { firebaseAccounts } from './schema'
import { eq, desc, inArray } from 'drizzle-orm'

/** 查询所有 Firebase 账号 */
export async function getAllFirebaseAccounts() {
  return await db.select().from(firebaseAccounts).orderBy(desc(firebaseAccounts.account_id))
}

/** 新增一个 Firebase 账号 */
export async function addFirebaseAccount(firebaseData: IFirebaseAdd) {
  try {
    const [inserted] = await db.insert(firebaseAccounts).values(firebaseData)
    return inserted
  } catch (e) {
    // 这里可以自定义错误处理，比如判断 error.code 是否为唯一约束冲突
    throw new Error('插入失败，可能是 Firebase 账号名重复')
  }
}

/** 删除一个或多个 Firebase 账号 */
export async function deleteFirebaseAccount(account_id: number | number[]) {
  if (Array.isArray(account_id)) {
    return await db.delete(firebaseAccounts).where(inArray(firebaseAccounts.account_id, account_id))
  } else {
    return await db.delete(firebaseAccounts).where(eq(firebaseAccounts.account_id, account_id))
  }
}

/** 修改一个 Firebase 账号 */
export async function updateFirebaseAccount(account_id: number, data: Partial<IFirebaseAdd>) {
  return await db.update(firebaseAccounts).set(data).where(eq(firebaseAccounts.account_id, account_id))
}
