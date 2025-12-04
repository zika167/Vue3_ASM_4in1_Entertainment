/**
 * Normalize user data từ Backend
 * Chuyển đổi field names từ Backend format sang FE format
 */

export function normalizeUser(user) {
  if (!user) return null

  return {
    id: user.id,
    email: user.email,
    username: user.username || user.email, // Fallback to email if username không có
    fullname: user.fullName || user.fullname, // Backend uses fullName, FE uses fullname
    admin: user.admin || false,
    isActive: user.isActive !== undefined ? user.isActive : true,
    avatar: user.avatar,
    createdDate: user.createdDate,
    updatedDate: user.updatedDate
  }
}

export function normalizeUsers(users) {
  if (!Array.isArray(users)) return []
  return users.map(normalizeUser)
}

export function denormalizeUser(user) {
  if (!user) return null
  
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    fullName: user.fullname, // FE uses fullname, Backend expects fullName
    admin: user.admin || false,
    isActive: user.isActive !== undefined ? user.isActive : true,
    avatar: user.avatar
  }
}
