const axios = require('axios');
const FormData = require('form-data');
const config = require('../config/config');

class ApiClient {
  constructor(baseUrl = config.BASE_URL) {
    this.client = axios.create({
      baseURL: baseUrl,
      timeout: config.TEST_TIMEOUT || 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    this.token = null;
  }

  /**
   * Define o token de autenticação
   * @param {string} token - Token JWT
   */
  setToken(token) {
    this.token = token;
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Remove o token de autenticação
   */
  clearToken() {
    this.token = null;
    delete this.client.defaults.headers.common['Authorization'];
  }

  /**
   * Autentica o usuário e obtém token JWT
   * @param {string} username - Nome de usuário
   * @param {string} password - Senha
   * @returns {Promise<Object>} Resposta da API
   */
  async authenticate(username, password) {
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      
      const response = await this.client.post('/token', formData, {
        headers: formData.getHeaders()
      });
      
      if (response.status === 200 && response.data.access_token) {
        this.setToken(response.data.access_token);
      }
      
      return {
        status: response.status,
        data: response.data,
        headers: response.headers
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Lista todos os usuários (requer autenticação)
   * @returns {Promise<Object>} Resposta da API
   */
  async getUsers() {
    try {
      const response = await this.client.get('/users/');
      return {
        status: response.status,
        data: response.data,
        headers: response.headers
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Cria um novo usuário
   * @param {Object} userData - Dados do usuário
   * @returns {Promise<Object>} Resposta da API
   */
  async createUser(userData) {
    try {
      const response = await this.client.post('/users/', userData);
      return {
        status: response.status,
        data: response.data,
        headers: response.headers
      };
    } catch (error) {
      return this.handleError(error);
    }
  }



  /**
   * Atualiza um usuário
   * @param {number} userId - ID do usuário
   * @param {Object} updateData - Dados para atualização
   * @returns {Promise<Object>} Resposta da API
   */
  async updateUser(userId, updateData) {
    try {
      const response = await this.client.put(`/users/${userId}`, updateData);
      return {
        status: response.status,
        data: response.data,
        headers: response.headers
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getUserMe() {
    try {
      const response = await this.client.get('/users/me/');
      return {
        status: response.status,
        data: response.data,
        headers: response.headers
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

 async getUserItems() {
    try {
      const response = await this.client.get('/users/me/items/');
      return {
        status: response.status,
        data: response.data,
        headers: response.headers
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

async getPostsWithParams(skip = 0, limit = 100) {
    try {
      const response = await this.client.get('/posts/', {
        params: { skip, limit }
      });
      return {
        status: response.status,
        data: response.data,
        headers: response.headers
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Deleta um usuário
   * @param {number} userId - ID do usuário
   * @returns {Promise<Object>} Resposta da API
   */
  async deleteUser(userId) {
    try {
      const response = await this.client.delete(`/users/${userId}`);
      return {
        status: response.status,
        data: response.data,
        headers: response.headers
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Cria um novo post
   * @param {Object} postData - Dados do post
   * @returns {Promise<Object>} Resposta da API
   */
  async createPost(postData) {
    try {
      const response = await this.client.post('/posts/', postData);
      return {
        status: response.status,
        data: response.data,
        headers: response.headers
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Lista todos os posts
   * @returns {Promise<Object>} Resposta da API
   */
  async getPosts() {
    try {
      const response = await this.client.get('/posts/');
      return {
        status: response.status,
        data: response.data,
        headers: response.headers
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Obtém um post específico
   * @param {number} postId - ID do post
   * @returns {Promise<Object>} Resposta da API
   */
  async getPost(postId) {
    try {
      const response = await this.client.get(`/posts/${postId}`);
      return {
        status: response.status,
        data: response.data,
        headers: response.headers
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Atualiza um post
   * @param {number} postId - ID do post
   * @param {Object} updateData - Dados para atualização
   * @returns {Promise<Object>} Resposta da API
   */
  async updatePost(postId, updateData) {
    try {
      const response = await this.client.put(`/posts/${postId}`, updateData);
      return {
        status: response.status,
        data: response.data,
        headers: response.headers
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Deleta um post
   * @param {number} postId - ID do post
   * @returns {Promise<Object>} Resposta da API
   */
  async deletePost(postId) {
    try {
      const response = await this.client.delete(`/posts/${postId}`);
      return {
        status: response.status,
        data: response.data,
        headers: response.headers
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Manipula erros da API
   * @param {Error} error - Erro do Axios
   * @returns {Object} Resposta padronizada
   */
  handleError(error) {
    if (error.response) {
      // A requisição foi feita e o servidor respondeu com um status de erro
      return {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
        error: true,
        message: error.message
      };
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      return {
        status: 0,
        data: null,
        headers: null,
        error: true,
        message: 'No response received from server'
      };
    } else {
      // Algo aconteceu na configuração da requisição
      return {
        status: 0,
        data: null,
        headers: null,
        error: true,
        message: error.message
      };
    }
  }

  /**
   * Testa a conexão com a API
   * @returns {Promise<Object>} Resposta do endpoint raiz
   */
  async testConnection() {
    try {
      const response = await this.client.get('/');
      return {
        status: response.status,
        data: response.data,
        headers: response.headers,
        error: false
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

module.exports = ApiClient;