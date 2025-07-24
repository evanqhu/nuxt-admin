/** 删除一个 Firebase 账号 */
export async function deleteFirebaseAccount(account_id: number | number[]) {
  return $fetch('/api/firebase/delete', {
    method: 'POST',
    body: {
      account_id
    }
  })
}

/** 新增一个 Firebase 账号 */
export async function addFirebaseAccount(data: IFirebaseAdd) {
  return $fetch('/api/firebase/add', {
    method: 'POST',
    body: data
  })
}

/** 编辑一个 Firebase 账号 */
export async function editFirebaseAccount(data: FirebaseItem) {
  return $fetch('/api/firebase/edit', {
    method: 'POST',
    body: data
  })
}
