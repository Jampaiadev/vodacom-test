const ApiClient = require('../utils/apiClient');
const testData = require('../utils/testData');

describe('Posts API Tests', () => {
  let apiClient;
  let user1Client;
  let user2Client;
  let user1PostId;
  let user2PostId;

  beforeAll(async () => {
    // Criar dois usuários para testes de autorização
    user1Client = new ApiClient();
    user2Client = new ApiClient();
    
    const user1 = testData.generateValidUser();
    const user2 = testData.generateValidUser();
    
    await user1Client.createUser(user1);
    await user2Client.createUser(user2);
    
    await user1Client.authenticate(user1.username, user1.password);
    await user2Client.authenticate(user2.username, user2.password);
  });

  beforeEach(() => {
    apiClient = new ApiClient();
  });

  afterEach(() => {
    apiClient.clearToken();
  });

  // 1. GET /posts/ sem autenticação
  test('GET /posts/ without token returns 401', async () => {
    const response = await apiClient.getPosts();
    expect(response.status).toBe(401);
    expect(response.data).toHaveProperty('detail');
  });

  // 2. GET /posts/ com autenticação
  test('GET /posts/ with authentication', async () => {
    const response = await user1Client.getPosts();
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });

  // 3. GET /posts/ com query params
  test('GET /posts/ with skip and limit parameters', async () => {
    // Primeiro cria alguns posts
    const post1 = { title: 'Post 1', content: 'Content 1', public: true };
    const post2 = { title: 'Post 2', content: 'Content 2', public: true };
    
    await user1Client.createPost(post1);
    await user1Client.createPost(post2);
    
    // Testa com parâmetros
    const response = await user1Client.getPostsWithParams(0, 1);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    
    // Deve retornar no máximo 1 post
    expect(response.data.length).toBeLessThanOrEqual(1);
  });

  // 4. POST /posts/ sem autenticação
  test('POST /posts/ without token returns 401', async () => {
    const postData = { title: 'Test', content: 'Content', public: true };
    const response = await apiClient.createPost(postData);
    
    expect(response.status).toBe(401);
  });

  // 5. POST /posts/ com autenticação
  test('POST /posts/ creates post successfully', async () => {
    const postData = { 
      title: 'My First Post', 
      content: 'This is my post content', 
      public: true 
    };
    
    const response = await user1Client.createPost(postData);
    
    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('id');
    expect(response.data.title).toBe(postData.title);
    expect(response.data.content).toBe(postData.content);
    expect(response.data.public).toBe(postData.public);
    expect(response.data).toHaveProperty('owner_id');
    expect(response.data).toHaveProperty('created_at');
    
    user1PostId = response.data.id;
  });

  // 6. POST /posts/ com dados inválidos
  test('POST /posts/ with invalid data returns 422', async () => {
    const invalidPosts = [
      { title: '', content: 'Content', public: true }, // título vazio
      { title: 'Title', content: '', public: true },   // conteúdo vazio
      { title: 'A'.repeat(256), content: 'Content', public: true }, // título muito longo
      { }, // objeto vazio
      { title: 'Title', content: 'Content' } // sem campo public
    ];
    
    for (const postData of invalidPosts) {
      const response = await user1Client.createPost(postData);
      expect(response.status).toBe(422);
    }
  });

  // 7. GET /posts/{id} - post específico
  test('GET /posts/{id} returns specific post', async () => {
    // Cria um post primeiro
    const postData = { title: 'Test Post', content: 'Test Content', public: true };
    const createResponse = await user1Client.createPost(postData);
    const postId = createResponse.data.id;
    
    const response = await user1Client.getPost(postId);
    
    expect(response.status).toBe(200);
    expect(response.data.id).toBe(postId);
    expect(response.data.title).toBe(postData.title);
    expect(response.data.content).toBe(postData.content);
  });

  // 8. GET /posts/{id} - post não existe
  test('GET /posts/{id} with non-existent ID returns 404', async () => {
    const response = await user1Client.getPost(999999);
    expect(response.status).toBe(404);
  });

  // 9. PUT /posts/{id} - atualizar post próprio
  test('PUT /posts/{id} updates own post', async () => {
    // Cria post
    const postData = { title: 'Original', content: 'Original content', public: true };
    const createResponse = await user1Client.createPost(postData);
    const postId = createResponse.data.id;
    
    // Atualiza
    const updateData = { title: 'Updated', content: 'Updated content', public: false };
    const response = await user1Client.updatePost(postId, updateData);
    
    expect(response.status).toBe(200);
    expect(response.data.title).toBe(updateData.title);
    expect(response.data.content).toBe(updateData.content);
    expect(response.data.public).toBe(updateData.public);
    expect(response.data.id).toBe(postId); // ID não muda
  });

  // 10. PUT /posts/{id} - tentar atualizar post de outro usuário
  test('PUT /posts/{id} cannot update other user\'s post', async () => {
    // User2 cria um post
    const postData = { title: 'User2 Post', content: 'User2 content', public: true };
    const createResponse = await user2Client.createPost(postData);
    user2PostId = createResponse.data.id;
    
    // User1 tenta atualizar post do User2
    const updateData = { title: 'Hacked', content: 'Hacked content', public: false };
    const response = await user1Client.updatePost(user2PostId, updateData);
    
    // Deve retornar 403 Forbidden ou 404 Not Found
    expect([403, 404]).toContain(response.status);
  });

  // 11. DELETE /posts/{id} - deletar post próprio
  test('DELETE /posts/{id} deletes own post', async () => {
    // Cria post
    const postData = { title: 'To Delete', content: 'Delete me', public: true };
    const createResponse = await user1Client.createPost(postData);
    const postId = createResponse.data.id;
    
    // Deleta
    const deleteResponse = await user1Client.deletePost(postId);
    expect(deleteResponse.status).toBe(204);
    
    // Verifica que foi deletado
    const getResponse = await user1Client.getPost(postId);
    expect(getResponse.status).toBe(404);
  });

  // 12. DELETE /posts/{id} - tentar deletar post de outro usuário
  test('DELETE /posts/{id} cannot delete other user\'s post', async () => {
    // User2 cria post (se ainda não criou)
    if (!user2PostId) {
      const postData = { title: 'User2 Protected', content: 'Protected content', public: true };
      const createResponse = await user2Client.createPost(postData);
      user2PostId = createResponse.data.id;
    }
    
    // User1 tenta deletar post do User2
    const response = await user1Client.deletePost(user2PostId);
    
    // Deve retornar 403 Forbidden ou 404 Not Found
    expect([403, 404]).toContain(response.status);
  });

  // 13. POST com SQL Injection
  test('SQL Injection in post content', async () => {
    const sqlPayloads = [
      { title: 'Test', content: "'; DROP TABLE posts;--", public: true },
      { title: 'Test', content: "' OR '1'='1", public: true },
      { title: 'Test', content: "1' UNION SELECT * FROM users --", public: true }
    ];
    
    for (const payload of sqlPayloads) {
      const response = await user1Client.createPost(payload);
      // Deve rejeitar ou sanitizar
      expect([400, 422, 500]).toContain(response.status);
    }
  });

  // 14. Campos obrigatórios no POST
  test('Missing required fields in POST', async () => {
    const requiredFields = ['title', 'content', 'public'];
    
    for (const field of requiredFields) {
      const postData = { title: 'Test', content: 'Test', public: true };
      delete postData[field];
      
      const response = await user1Client.createPost(postData);
      expect(response.status).toBe(422);
    }
  });

  // 15. Posts públicos vs privados (se aplicável)
  test('Post visibility - public vs private', async () => {
    // Cria post público
    const publicPost = { title: 'Public Post', content: 'Everyone can see', public: true };
    const publicResponse = await user1Client.createPost(publicPost);
    expect(publicResponse.status).toBe(201);
    
    // Cria post privado
    const privatePost = { title: 'Private Post', content: 'Only me', public: false };
    const privateResponse = await user1Client.createPost(privatePost);
    expect(privateResponse.status).toBe(201);
    
    // Ambos devem aparecer na lista do dono
    const user1Posts = await user1Client.getPosts();
    expect(user1Posts.data.length).toBeGreaterThanOrEqual(2);
  });
});