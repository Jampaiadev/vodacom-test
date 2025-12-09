// tests/setup.js
console.log('✅ Setup executado antes dos testes');

// Configurações globais se necessário
global.TEST_MODE = 'integration';

// Adicione qualquer setup necessário
beforeAll(() => {
  console.log('🚀 Iniciando testes...');
});

afterAll(() => {
  console.log('🏁 Testes finalizados');
});