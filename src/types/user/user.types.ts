export interface User {
  id: string
  name: string
  email: string
  username: string
  roles: Array<{ id: string; role_name: string }>
  image_path: string
}
