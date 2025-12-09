module.exports = {
  BASE_URL: process.env.BASE_URL || 'http://localhost:8000',
  
  // Dados de teste
  TEST_DATA: {
    ADMIN_USER: {
      username: 'admin',
      password: 'admin123',
      email: 'admin@example.com',
      full_name: 'Administrator'
    },
    TEST_USER: {
      username: 'testuser',
      password: 'TestPass123!',
      email: 'test@example.com',
      full_name: 'Test User'
    }
  },
  
  // Configurações de timeout
  TEST_TIMEOUT: 15000,
  API_TIMEOUT: 10000,
  
  // Validações
  VALIDATION: {
    PASSWORD_MIN_LENGTH: 8,
    USERNAME_MIN_LENGTH: 3,
    USERNAME_MAX_LENGTH: 50,
    EMAIL_MAX_LENGTH: 100
  }
};