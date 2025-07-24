export type FirebaseInfo = {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
  measurementId: string
}

export type FirebaseItem = {
  account_id: number
  account_name: string
  account_info: FirebaseInfo
  remark?: string
}

export type IFirebaseAdd = Omit<FirebaseItem, 'account_id'>
