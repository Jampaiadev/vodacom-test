const ApiClient = require('../utils/apiClient');
const testData = require('../utils/testData');

describe('Authentication Tests', () => {
  let apiClient;

  beforeEach(() => {
    apiClient = new ApiClient();
  });

  afterEach(() => {
    apiClient.clearToken();
  });

  // 1. Login válido
  test('POST /token with valid credentials', async () => {
    // Cria usuário primeiro
    const userData = testData.generateValidUser();
    await apiClient.createUser(userData);
    
    // Faz login
    const response = await apiClient.authenticate(userData.username, userData.password);
    
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('access_token');
    expect(response.data).toHaveProperty('token_type', 'bearer');
    expect(apiClient.token).toBe(response.data.access_token);
  });

  // 2. Login com senha inválida
  test('POST /token with wrong password', async () => {
    const userData = testData.generateValidUser();
    await apiClient.createUser(userData);
    
    const response = await apiClient.authenticate(userData.username, 'wrongpassword');
    
    expect(response.status).toBe(401);
    expect(apiClient.token).toBeNull();
  });

  // 3. Login com usuário inexistente
  test('POST /token with non-existent user', async () => {
    const response = await apiClient.authenticate('nonexistent', 'anypassword');
    
    expect(response.status).toBe(401);
  });

  // 4. Login sem username
  test('POST /token without username', async () => {
    const response = await apiClient.authenticate('', 'password123');
    
    expect(response.status).toBe(422);
  });

  // 5. Login sem password
  test('POST /token without password', async () => {
    const response = await apiClient.authenticate('username', '');
    
    expect(response.status).toBe(422);
  });

  // 6. GET /users/me/ com token válido
  test('GET /users/me/ with valid token', async () => {
    const userData = testData.generateValidUser();
    await apiClient.createUser(userData);
    await apiClient.authenticate(userData.username, userData.password);
    
    // Mock da função getUserMe (precisa ser implementada no ApiClient)
    // Vou adicionar essa função abaixo
    const response = await apiClient.getUserMe();
    
    expect(response.status).toBe(200);
    expect(response.data.email).toBe(userData.email);
    expect(response.data.username).toBe(userData.username);
  });

  // 7. GET /users/me/ sem token
  test('GET /users/me/ without token', async () => {
    const response = await apiClient.getUserMe();
    
    expect(response.status).toBe(401);
  });

  // 8. GET /users/me/ com token inválido
  test('GET /users/me/ with invalid token', async () => {
    apiClient.setToken('invalid.token.here');
    
    const response = await apiClient.getUserMe();
    
    expect(response.status).toBe(401);
  });

  // 9. Token permite acesso a outros endpoints protegidos
  test('Token works for other protected endpoints', async () => {
    const userData = testData.generateValidUser();
    await apiClient.createUser(userData);
    await apiClient.authenticate(userData.username, userData.password);
    
    const response = await apiClient.getUsers();
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });

  // 10. Formato do token
  test('Token has correct format', async () => {
    const userData = testData.generateValidUser();
    await apiClient.createUser(userData);
    const authResponse = await apiClient.authenticate(userData.username, userData.password);
    
    const token = authResponse.data.access_token;
    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3); // JWT tem 3 partes
  });

  test('GET /users/me/items/ with valid token', async () => {
    const userData = testData.generateValidUser();
    await apiClient.createUser(userData);
    await apiClient.authenticate(userData.username, userData.password);
    
    const response = await apiClient.getUserItems();
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    
    // Verifica estrutura dos items
    if (response.data.length > 0) {
      const item = response.data[0];
      expect(item).toHaveProperty('item_id');
      expect(item).toHaveProperty('owner');
    }
  });

  // 12. GET /users/me/items/ sem token
  test('GET /users/me/items/ without token', async () => {
    apiClient.clearToken(); // Garante sem token
    const response = await apiClient.getUserItems();
    
    expect(response.status).toBe(401);
    expect(response.data).toHaveProperty('detail', 'Not authenticated');
  });

  // 13. GET /users/me/items/ com token inválido
  test('GET /users/me/items/ with invalid token', async () => {
    apiClient.setToken('invalid.token.here');
    const response = await apiClient.getUserItems();
    
    expect(response.status).toBe(401);
  });



});