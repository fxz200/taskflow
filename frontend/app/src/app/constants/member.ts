export interface Member {
  id: string
  name: string
  role: number
  icon: number
  email: string
}

interface Roles {
  id: number
  label: string
}

export const ROLES: Roles[] = [
  { id: 1, label: 'PM' },
  { id: 2, label: 'RD/Backend' },
  { id: 3, label: 'RD/Frontend' },
  { id: 4, label: 'QA' },
]

interface AvatarList {
  id: number
  src?: string
  isDefault?: boolean
}

export const AVATAR_LIST: AvatarList[] = [
  { id: 0, isDefault: true },
  { id: 1, src: '/img/avatar_1.jpg' },
  { id: 2, src: '/img/avatar_2.jpg' },
  { id: 3, src: '/img/avatar_3.jpg' },
  { id: 4, src: '/img/avatar_4.jpg' },
  { id: 5, src: '/img/avatar_5.jpg' },
  { id: 6, src: '/img/avatar_6.jpg' },
  { id: 7, src: '/img/avatar_7.jpg' },
  { id: 8, src: '/img/avatar_8.jpg' },
  { id: 9, src: '/img/avatar_9.jpg' },
  { id: 10, src: '/img/avatar_10.jpg' },
  { id: 11, src: '/img/avatar_11.jpg' },
  { id: 12, src: '/img/avatar_12.jpg' },
  { id: 13, src: '/img/avatar_13.jpg' },
  { id: 14, src: '/img/avatar_14.jpg' },
]
