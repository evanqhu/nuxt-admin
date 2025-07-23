/** 删除一个 Adsense 账号 */
export async function deleteAdsenseAccount(account_id: number | number[]) {
  return $fetch('/api/adsense/delete', {
    method: 'POST',
    body: {
      account_id
    }
  })
}

/** 新增一个 Adsense 账号 */
export async function addAdsenseAccount(data: IAdsenseAdd) {
  return $fetch('/api/adsense/add', {
    method: 'POST',
    body: data
  })
}

/** 编辑一个 Adsense 账号 */
export async function editAdsenseAccount(data: AdsenseItem) {
  return $fetch('/api/adsense/edit', {
    method: 'POST',
    body: data
  })
}
