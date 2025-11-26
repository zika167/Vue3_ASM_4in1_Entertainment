/**
 * Mock User Service
 * Dùng để test UI với dữ liệu giả
 * Simulate API calls với Promise và delay
 */

// Mock data - Danh sách users giả
const mockUsers = [
  {
    id: 1,
    username: 'mockuser',
    fullname: 'Mock User',
    email: 'mockuser@example.com',
    role: 'user',
    avatar: 'https://via.placeholder.com/150',
    isActive: true,
    createdAt: '2024-01-15',
    lastLogin: '2025-01-20'
  },
  {
    id: 2,
    username: 'admin',
    fullname: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    avatar: 'https://via.placeholder.com/150',
    isActive: true,
    createdAt: '2024-01-01',
    lastLogin: '2025-01-20'
  },
  {
    id: 3,
    username: 'john_doe',
    fullname: 'John Doe',
    email: 'john.doe@example.com',
    role: 'user',
    avatar: 'https://via.placeholder.com/150',
    isActive: true,
    createdAt: '2024-02-10',
    lastLogin: '2025-01-18'
  },
  {
    id: 4,
    username: 'jane_smith',
    fullname: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'user',
    avatar: 'https://via.placeholder.com/150',
    isActive: false,
    createdAt: '2024-03-05',
    lastLogin: '2024-12-20'
  },
  {
    id: 5,
    username: 'bob_wilson',
    fullname: 'Bob Wilson',
    email: 'bob.wilson@example.com',
    role: 'user',
    avatar: 'https://via.placeholder.com/150',
    isActive: true,
    createdAt: '2024-04-12',
    lastLogin: '2025-01-19'
  }
]

// Simulate network delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Mock User Service Class
 */
class MockUserService {
  /**
   * Get all users
   * @returns {Promise<Array>}
   */
  async getAllUsers() {
    await delay(800) // Simulate API delay
    return {
      success: true,
      data: [...mockUsers],
      total: mockUsers.length
    }
  }

  /**
   * Get user by ID
   * @param {number} id
   * @returns {Promise<Object>}
   */
  async getUserById(id) {
    await delay(500)
    const user = mockUsers.find(u => u.id === parseInt(id))
    
    if (!user) {
      return {
        success: false,
        error: 'User not found'
      }
    }
    
    return {
      success: true,
      data: { ...user }
    }
  }

  /**
   * Create new user
   * @param {Object} userData
   * @returns {Promise<Object>}
   */
  async createUser(userData) {
    await delay(1000)
    
    // Validate
    if (!userData.username || !userData.email) {
      return {
        success: false,
        error: 'Username and email are required'
      }
    }

    // Check duplicate username
    if (mockUsers.find(u => u.username === userData.username)) {
      return {
        success: false,
        error: 'Username already exists'
      }
    }

    // Check duplicate email
    if (mockUsers.find(u => u.email === userData.email)) {
      return {
        success: false,
        error: 'Email already exists'
      }
    }

    const newUser = {
      id: Math.max(...mockUsers.map(u => u.id)) + 1,
      username: userData.username,
      fullname: userData.fullname || '',
      email: userData.email,
      role: userData.role || 'user',
      avatar: userData.avatar || 'https://via.placeholder.com/150',
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: null
    }

    mockUsers.push(newUser)

    return {
      success: true,
      data: { ...newUser },
      message: 'User created successfully'
    }
  }

  /**
   * Update user
   * @param {number} id
   * @param {Object} userData
   * @returns {Promise<Object>}
   */
  async updateUser(id, userData) {
    await delay(800)
    
    const index = mockUsers.findIndex(u => u.id === parseInt(id))
    
    if (index === -1) {
      return {
        success: false,
        error: 'User not found'
      }
    }

    // Check duplicate username (exclude current user)
    if (userData.username && mockUsers.find(u => u.username === userData.username && u.id !== parseInt(id))) {
      return {
        success: false,
        error: 'Username already exists'
      }
    }

    // Check duplicate email (exclude current user)
    if (userData.email && mockUsers.find(u => u.email === userData.email && u.id !== parseInt(id))) {
      return {
        success: false,
        error: 'Email already exists'
      }
    }

    // Update user
    mockUsers[index] = {
      ...mockUsers[index],
      ...userData,
      id: parseInt(id) // Ensure ID doesn't change
    }

    return {
      success: true,
      data: { ...mockUsers[index] },
      message: 'User updated successfully'
    }
  }

  /**
   * Delete user
   * @param {number} id
   * @returns {Promise<Object>}
   */
  async deleteUser(id) {
    await delay(600)
    
    const index = mockUsers.findIndex(u => u.id === parseInt(id))
    
    if (index === -1) {
      return {
        success: false,
        error: 'User not found'
      }
    }

    // Don't allow deleting admin
    if (mockUsers[index].role === 'admin') {
      return {
        success: false,
        error: 'Cannot delete admin user'
      }
    }

    mockUsers.splice(index, 1)

    return {
      success: true,
      message: 'User deleted successfully'
    }
  }

  /**
   * Toggle user active status
   * @param {number} id
   * @returns {Promise<Object>}
   */
  async toggleUserStatus(id) {
    await delay(500)
    
    const user = mockUsers.find(u => u.id === parseInt(id))
    
    if (!user) {
      return {
        success: false,
        error: 'User not found'
      }
    }

    user.isActive = !user.isActive

    return {
      success: true,
      data: { ...user },
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`
    }
  }

  /**
   * Search users
   * @param {string} keyword
   * @returns {Promise<Object>}
   */
  async searchUsers(keyword) {
    await delay(600)
    
    if (!keyword) {
      return this.getAllUsers()
    }

    const searchTerm = keyword.toLowerCase()
    const results = mockUsers.filter(user => 
      user.username.toLowerCase().includes(searchTerm) ||
      user.fullname.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
    )

    return {
      success: true,
      data: results,
      total: results.length
    }
  }

  /**
   * Get users by role
   * @param {string} role
   * @returns {Promise<Object>}
   */
  async getUsersByRole(role) {
    await delay(500)
    
    const results = mockUsers.filter(user => user.role === role)

    return {
      success: true,
      data: results,
      total: results.length
    }
  }

  /**
   * Get statistics
   * @returns {Promise<Object>}
   */
  async getStatistics() {
    await delay(400)
    
    return {
      success: true,
      data: {
        totalUsers: mockUsers.length,
        activeUsers: mockUsers.filter(u => u.isActive).length,
        inactiveUsers: mockUsers.filter(u => !u.isActive).length,
        adminUsers: mockUsers.filter(u => u.role === 'admin').length,
        regularUsers: mockUsers.filter(u => u.role === 'user').length
      }
    }
  }
}

export default new MockUserService()
