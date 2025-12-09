module.exports = {
  generateValidUser: () => ({
    email: `test${Date.now()}@example.com`,
    username: `user${Date.now()}`,
    full_name: 'Test User',
    password: 'TestPass123!',
    disabled: false
  }),

  getInvalidUsers: () => [
    { email: 'invalid-email', username: 'user', password: '123', full_name: 'Test' },
    { email: 'test@test.com', username: '', password: 'password', full_name: 'Test' },
    { email: '', username: 'user', password: 'pass123', full_name: 'Test' },
    { email: 'test@test.com', username: 'ab', password: 'pass123', full_name: 'Test' }
  ]
};