export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token') // Check if token exists
}
