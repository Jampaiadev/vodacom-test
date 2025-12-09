const ApiClient = require('../utils/apiClient');
const testData = require('../utils/testData');

describe('Users API Tests - Casos Críticos', () => {
  let apiClient;
  let createdUserId;

  beforeEach(() => {
    apiClient = new ApiClient();
  });

  afterEach(() => {
    apiClient.clearToken();
  });

  // 1. Autenticação - GET sem token
  test('GET /users/ without token returns 401', async () => {
    const response = await apiClient.getUsers();
    expect(response.status).toBe(401);
  });

  // 2. Criação básica
  test('POST /users/ cria usuário válido', async () => {
    const userData = testData.generateValidUser();
    const response = await apiClient.createUser(userData);
    
    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('id');
    createdUserId = response.data.id;
  });

  // 3. SQL Injection - CRÍTICO


  // 4. Campos muito longos
  test('Extreme field lengths', async () => {
    const cases = [
      {
        email: 'a'.repeat(100) + '@test.com',
        username: 'normal',
        password: 'Valid123!',
        full_name: 'Test'
      },
      {
        email: 'test@test.com',
        username: 'a'.repeat(100),
        password: 'Valid123!',
        full_name: 'Test'
      }
    ];

    for (const userData of cases) {
      const response = await apiClient.createUser(userData);
      expect([400, 422]).toContain(response.status);
    }
  });

  // 5. Usuário duplicado
  test('Duplicate user prevention', async () => {
    const userData = testData.generateValidUser();
    
    const first = await apiClient.createUser(userData);
    expect(first.status).toBe(201);
    
    const second = await apiClient.createUser(userData);
    expect([400, 409, 422]).toContain(second.status);
  });

  // 6. Campos obrigatórios faltando
  test('Missing required fields', async () => {
    const userData = testData.generateValidUser();
    
    // Testa cada campo obrigatório
    const fields = ['email', 'username', 'password', 'full_name'];
    
    for (const field of fields) {
      const invalidUser = { ...userData };
      delete invalidUser[field];
      
      const response = await apiClient.createUser(invalidUser);
      expect(response.status).toBe(422);
    }
  });

  // 7. Login válido
  test('Valid login returns JWT', async () => {
    const userData = testData.generateValidUser();
    await apiClient.createUser(userData);
    
    const response = await apiClient.authenticate(userData.username, userData.password);
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('access_token');
  });

  // 8. Login inválido
  test('Invalid login returns 401', async () => {
    const userData = testData.generateValidUser();
    await apiClient.createUser(userData);
    
    const response = await apiClient.authenticate(userData.username, 'wrongpass');
    expect(response.status).toBe(401);
  });

  // 9. Acesso com token válido
  test('Access with valid token', async () => {
    const userData = testData.generateValidUser();
    await apiClient.createUser(userData);
    await apiClient.authenticate(userData.username, userData.password);
    
    const response = await apiClient.getUsers();
    expect(response.status).toBe(200);
  });

  // 10. Token inválido
  test('Invalid token rejected', async () => {
    apiClient.setToken('invalid.token.here');
    const response = await apiClient.getUsers();
    expect(response.status).toBe(401);
  });

  // 11. Busca usuário por ID




  // 13. Dados inválidos - Teste 3 do array
  test('Invalid data returns 422', async () => {
    const invalidUsers = testData.getInvalidUsers();
    
    for (const userData of invalidUsers) {
      const response = await apiClient.createUser(userData);
      expect(response.status).toBe(422);
    }
  });
});