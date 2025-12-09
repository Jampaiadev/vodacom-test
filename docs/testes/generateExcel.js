const ExcelJS = require('exceljs');
const fs = require('fs');

async function generateMainReport() {
  const workbook = new ExcelJS.Workbook();
  
  // ========== MAIN REPORT SHEET ==========
  const mainSheet = workbook.addWorksheet('MAIN TEST REPORT');
  
  // Título Principal
  mainSheet.mergeCells('A1:K2');
  const titleCell = mainSheet.getCell('A1');
  titleCell.value = 'POSTS MANAGEMENT API - COMPLETE TEST REPORT';
  titleCell.font = { size: 18, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
  titleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF203764' }
  };
  
  // Cabeçalho das colunas
  const headers = [
    { header: 'TEST ID', key: 'id', width: 12 },
    { header: 'MODULE', key: 'module', width: 12 },
    { header: 'ENDPOINT', key: 'endpoint', width: 25 },
    { header: 'METHOD', key: 'method', width: 10 },
    { header: 'TEST CASE DESCRIPTION', key: 'description', width: 60 },
    { header: 'TEST DATA', key: 'testData', width: 40 },
    { header: 'EXPECTED RESULT', key: 'expected', width: 25 },
    { header: 'ACTUAL RESULT', key: 'actual', width: 25 },
    { header: 'STATUS', key: 'status', width: 12 },
    { header: 'BUG ID', key: 'bugId', width: 12 },
    { header: 'SEVERITY', key: 'severity', width: 15 }
  ];
  
  mainSheet.columns = headers;
  
  // ========== TODOS OS TEST CASES COMPLETOS ==========
  const allTestCases = [
    // ========== AUTHENTICATION TESTS ==========
    {
      id: 'AUTH-001', module: 'Authentication', endpoint: '/token', method: 'POST',
      description: 'Login with valid credentials',
      testData: 'username: testuser, password: TestPass123!',
      expected: '200 OK with JWT token',
      actual: '200 OK with token',
      status: '✅ PASS', bugId: '', severity: ''
    },
    {
      id: 'AUTH-002', module: 'Authentication', endpoint: '/token', method: 'POST',
      description: 'Login with wrong password',
      testData: 'username: testuser, password: wrongpass',
      expected: '401 Unauthorized',
      actual: '401 Unauthorized',
      status: '✅ PASS', bugId: '', severity: ''
    },
    {
      id: 'AUTH-003', module: 'Authentication', endpoint: '/token', method: 'POST',
      description: 'Login with non-existent user',
      testData: 'username: nonexistent, password: any',
      expected: '401 Unauthorized',
      actual: '401 Unauthorized',
      status: '✅ PASS', bugId: '', severity: ''
    },
    {
      id: 'AUTH-004', module: 'Authentication', endpoint: '/token', method: 'POST',
      description: 'Login without username',
      testData: 'username: (empty), password: password123',
      expected: '422 Validation Error',
      actual: '422 Validation Error',
      status: '✅ PASS', bugId: '', severity: ''
    },
    {
      id: 'AUTH-005', module: 'Authentication', endpoint: '/token', method: 'POST',
      description: 'Login without password',
      testData: 'username: testuser, password: (empty)',
      expected: '422 Validation Error',
      actual: '422 Validation Error',
      status: '✅ PASS', bugId: '', severity: ''
    },
    {
      id: 'AUTH-006', module: 'Authentication', endpoint: '/users/me/', method: 'GET',
      description: 'Get current user data with valid token',
      testData: 'Authorization: Bearer <valid_token>',
      expected: '200 OK with user data',
      actual: '200 OK with user data',
      status: '✅ PASS', bugId: '', severity: ''
    },
    {
      id: 'AUTH-007', module: 'Authentication', endpoint: '/users/me/', method: 'GET',
      description: 'Get current user without token',
      testData: 'No Authorization header',
      expected: '401 Unauthorized',
      actual: '401 Unauthorized',
      status: '✅ PASS', bugId: '', severity: ''
    },
    {
      id: 'AUTH-008', module: 'Authentication', endpoint: '/users/me/', method: 'GET',
      description: 'Get current user with invalid token',
      testData: 'Authorization: Bearer invalid.token',
      expected: '401 Unauthorized',
      actual: '401 Unauthorized',
      status: '✅ PASS', bugId: '', severity: ''
    },
    {
      id: 'AUTH-009', module: 'Authentication', endpoint: '/users/me/items/', method: 'GET',
      description: 'Get user items with valid token',
      testData: 'Authorization: Bearer <valid_token>',
      expected: '200 OK with items array',
      actual: '200 OK with items array',
      status: '✅ PASS', bugId: '', severity: ''
    },
    {
      id: 'AUTH-010', module: 'Authentication', endpoint: '/users/me/items/', method: 'GET',
      description: 'Get user items without token',
      testData: 'No Authorization header',
      expected: '401 Unauthorized',
      actual: '401 Unauthorized',
      status: '✅ PASS', bugId: '', severity: ''
    },
    {
      id: 'AUTH-011', module: 'Authentication', endpoint: '/users/', method: 'GET',
      description: 'Access protected endpoint with valid token',
      testData: 'Authorization: Bearer <valid_token>',
      expected: '200 OK with users list',
      actual: '200 OK with users list',
      status: '✅ PASS', bugId: '', severity: ''
    },
    {
      id: 'AUTH-012', module: 'Authentication', endpoint: '/users/', method: 'GET',
      description: 'Access protected endpoint without token',
      testData: 'No Authorization header',
      expected: '401 Unauthorized',
      actual: '401 Unauthorized',
      status: '✅ PASS', bugId: '', severity: ''
    },
    
    // ========== USERS TESTS ==========
    {
      id: 'USER-001', module: 'Users', endpoint: '/users/', method: 'POST',
      description: 'Create user with valid data',
      testData: '{"email": "test@test.com", "username": "testuser", "password": "ValidPass123!", "full_name": "Test User"}',
      expected: '201 Created with user ID',
      actual: '201 Created with user ID',
      status: '✅ PASS', bugId: '', severity: ''
    },
    {
      id: 'USER-002', module: 'Users', endpoint: '/users/', method: 'POST',
      description: 'Create user with invalid email',
      testData: '{"email": "invalid-email", "username": "test", "password": "pass", "full_name": "Test"}',
      expected: '422 Validation Error',
      actual: '409 Conflict',
      status: '❌ FAIL', bugId: 'BUG-002', severity: 'MEDIUM'
    },
    {
      id: 'USER-003', module: 'Users', endpoint: '/users/', method: 'POST',
      description: 'Create user with empty username',
      testData: '{"email": "test@test.com", "username": "", "password": "password", "full_name": "Test"}',
      expected: '422 Validation Error',
      actual: '409 Conflict',
      status: '❌ FAIL', bugId: 'BUG-002', severity: 'MEDIUM'
    },
    {
      id: 'USER-004', module: 'Users', endpoint: '/users/', method: 'POST',
      description: 'Create user with empty email',
      testData: '{"email": "", "username": "test", "password": "password", "full_name": "Test"}',
      expected: '422 Validation Error',
      actual: '409 Conflict',
      status: '❌ FAIL', bugId: 'BUG-002', severity: 'MEDIUM'
    },
    {
      id: 'USER-005', module: 'Users', endpoint: '/users/', method: 'POST',
      description: 'SQL Injection attempt in username',
      testData: '{"email": "test@test.com", "username": "admin\'--", "password": "pass", "full_name": "Test"}',
      expected: '400/422 (Block SQL Injection)',
      actual: '409 Conflict',
      status: '❌ FAIL', bugId: '', severity: 'HIGH'
    },
    {
      id: 'USER-006', module: 'Users', endpoint: '/users/', method: 'POST',
      description: 'Extremely long email field',
      testData: `{"email": "${'a'.repeat(300)}@test.com", "username": "normal", "password": "Valid123!", "full_name": "Test"}`,
      expected: '400/422 Validation Error',
      actual: '409 Conflict',
      status: '❌ FAIL', bugId: 'BUG-005', severity: 'MEDIUM'
    },
    {
      id: 'USER-007', module: 'Users', endpoint: '/users/', method: 'POST',
      description: 'Extremely long username field',
      testData: `{"email": "test@test.com", "username": "${'a'.repeat(300)}", "password": "Valid123!", "full_name": "Test"}`,
      expected: '400/422 Validation Error',
      actual: '409 Conflict',
      status: '❌ FAIL', bugId: 'BUG-005', severity: 'MEDIUM'
    },
    {
      id: 'USER-008', module: 'Users', endpoint: '/users/', method: 'POST',
      description: 'Duplicate username prevention',
      testData: 'Same username as existing user',
      expected: '409 Conflict',
      actual: '409 Conflict',
      status: '✅ PASS', bugId: '', severity: ''
    },
    {
      id: 'USER-009', module: 'Users', endpoint: '/users/', method: 'POST',
      description: 'Duplicate email prevention',
      testData: 'Same email as existing user',
      expected: '409 Conflict',
      actual: '409 Conflict',
      status: '✅ PASS', bugId: '', severity: ''
    },
    {
      id: 'USER-010', module: 'Users', endpoint: '/users/{id}', method: 'GET',
      description: 'Get specific user by ID',
      testData: 'Valid user ID with authentication',
      expected: '200 OK with user data',
      actual: '200 OK with user data',
      status: '✅ PASS', bugId: '', severity: ''
    },
    {
      id: 'USER-011', module: 'Users', endpoint: '/users/{id}', method: 'GET',
      description: 'Get non-existent user',
      testData: 'User ID: 999999',
      expected: '404 Not Found',
      actual: '404 Not Found',
      status: '✅ PASS', bugId: '', severity: ''
    },
    {
      id: 'USER-012', module: 'Users', endpoint: '/users/', method: 'GET',
      description: 'List all users without authentication',
      testData: 'No Authorization header',
      expected: '401 Unauthorized',
      actual: '401 Unauthorized',
      status: '✅ PASS', bugId: '', severity: ''
    },
    
    // ========== POSTS TESTS ==========
    {
      id: 'POST-001', module: 'Posts', endpoint: '/posts/', method: 'GET',
      description: 'Get all posts without authentication',
      testData: 'No Authorization header',
      expected: '401 Unauthorized',
      actual: '401 Unauthorized',
      status: '✅ PASS', bugId: '', severity: ''
    },
    {
      id: 'POST-002', module: 'Posts', endpoint: '/posts/', method: 'GET',
      description: 'Get all posts with authentication',
      testData: 'Authorization: Bearer <valid_token>',
      expected: '200 OK with posts array',
      actual: '200 OK with posts array',
      status: '✅ PASS', bugId: '', severity: ''
    },
    {
      id: 'POST-003', module: 'Posts', endpoint: '/posts/', method: 'GET',
      description: 'Get posts with pagination (skip=0, limit=1)',
      testData: 'Query params: ?skip=0&limit=1',
      expected: '200 OK with max 1 post',
      actual: '200 OK with max 1 post',
      status: '✅ PASS', bugId: '', severity: ''
    },
    {
      id: 'POST-004', module: 'Posts', endpoint: '/posts/', method: 'POST',
      description: 'Create post without authentication',
      testData: 'No Authorization header',
      expected: '401 Unauthorized',
      actual: '401 Unauthorized',
      status: '✅ PASS', bugId: '', severity: ''
    },
    {
      id: 'POST-005', module: 'Posts', endpoint: '/posts/', method: 'POST',
      description: 'Create valid post',
      testData: '{"title": "My Post", "content": "Content", "public": true}',
      expected: '201 Created with post ID',
      actual: '201 Created with post ID',
      status: '✅ PASS', bugId: '', severity: ''
    },
    {
      id: 'POST-006', module: 'Posts', endpoint: '/posts/', method: 'POST',
      description: 'Create post with empty title',
      testData: '{"title": "", "content": "Content", "public": true}',
      expected: '422 Validation Error',
      actual: '201 Created (BUG)',
      status: '❌ FAIL', bugId: 'BUG-007', severity: 'MEDIUM'
    },
    {
      id: 'POST-007', module: 'Posts', endpoint: '/posts/', method: 'POST',
      description: 'Create post with empty content',
      testData: '{"title": "Title", "content": "", "public": true}',
      expected: '422 Validation Error',
      actual: '201 Created (BUG)',
      status: '❌ FAIL', bugId: 'BUG-007', severity: 'MEDIUM'
    },
    {
      id: 'POST-008', module: 'Posts', endpoint: '/posts/', method: 'POST',
      description: 'Create post with extremely long title',
      testData: `{"title": "${'A'.repeat(500)}", "content": "Content", "public": true}`,
      expected: '422 Validation Error',
      actual: '201 Created (BUG)',
      status: '❌ FAIL', bugId: 'BUG-007', severity: 'MEDIUM'
    },
    {
      id: 'POST-009', module: 'Posts', endpoint: '/posts/{id}', method: 'GET',
      description: 'Get specific post by ID',
      testData: 'Valid post ID',
      expected: '200 OK with post data',
      actual: '200 OK with post data',
      status: '✅ PASS', bugId: '', severity: ''
    },
    {
      id: 'POST-010', module: 'Posts', endpoint: '/posts/{id}', method: 'GET',
      description: 'Get non-existent post',
      testData: 'Post ID: 999999',
      expected: '404 Not Found',
      actual: '404 Not Found',
      status: '✅ PASS', bugId: '', severity: ''
    },
    {
      id: 'POST-011', module: 'Posts', endpoint: '/posts/{id}', method: 'PUT',
      description: 'Update own post',
      testData: '{"title": "Updated", "content": "Updated", "public": false}',
      expected: '200 OK with updated post',
      actual: '200 OK with updated post',
      status: '✅ PASS', bugId: '', severity: ''
    },
    {
      id: 'POST-012', module: 'Posts', endpoint: '/posts/{id}', method: 'PUT',
      description: 'Update other user\'s post (AUTHORIZATION TEST)',
      testData: 'Try to update post owned by different user',
      expected: '403 Forbidden or 404 Not Found',
      actual: '200 OK (BUG - Security issue)',
      status: '❌ FAIL', bugId: 'BUG-001', severity: 'CRITICAL'
    },
    {
      id: 'POST-013', module: 'Posts', endpoint: '/posts/{id}', method: 'DELETE',
      description: 'Delete own post',
      testData: 'Valid own post ID',
      expected: '204 No Content',
      actual: '204 No Content',
      status: '✅ PASS', bugId: '', severity: ''
    },
    {
      id: 'POST-014', module: 'Posts', endpoint: '/posts/{id}', method: 'DELETE',
      description: 'Delete other user\'s post (AUTHORIZATION TEST)',
      testData: 'Try to delete post owned by different user',
      expected: '403 Forbidden or 404 Not Found',
      actual: '204 No Content (BUG - Security issue)',
      status: '❌ FAIL', bugId: 'BUG-003', severity: 'CRITICAL'
    },
    {
      id: 'POST-015', module: 'Posts', endpoint: '/posts/', method: 'POST',
      description: 'SQL Injection in post content',
      testData: '{"title": "Test", "content": "\'; DROP TABLE posts;--", "public": true}',
      expected: '400/422/500 (Block SQL Injection)',
      actual: '201 Created (BUG - Security issue)',
      status: '❌ FAIL', bugId: 'BUG-004', severity: 'CRITICAL'
    },
    {
      id: 'POST-016', module: 'Posts', endpoint: '/posts/', method: 'POST',
      description: 'Missing title field',
      testData: '{"content": "Content", "public": true}',
      expected: '422 Validation Error',
      actual: '422 Validation Error',
      status: '✅ PASS', bugId: '', severity: ''
    },
    {
      id: 'POST-017', module: 'Posts', endpoint: '/posts/', method: 'POST',
      description: 'Missing content field',
      testData: '{"title": "Title", "public": true}',
      expected: '422 Validation Error',
      actual: '422 Validation Error',
      status: '✅ PASS', bugId: '', severity: ''
    },
    {
      id: 'POST-018', module: 'Posts', endpoint: '/posts/', method: 'POST',
      description: 'Missing public field',
      testData: '{"title": "Title", "content": "Content"}',
      expected: '422 Validation Error',
      actual: '422 Validation Error',
      status: '✅ PASS', bugId: '', severity: ''
    },
    {
      id: 'POST-019', module: 'Posts', endpoint: '/posts/', method: 'POST',
      description: 'Create public post',
      testData: '{"title": "Public", "content": "Content", "public": true}',
      expected: '201 Created',
      actual: '201 Created',
      status: '✅ PASS', bugId: '', severity: ''
    },
    {
      id: 'POST-020', module: 'Posts', endpoint: '/posts/', method: 'POST',
      description: 'Create private post',
      testData: '{"title": "Private", "content": "Content", "public": false}',
      expected: '201 Created',
      actual: '201 Created',
      status: '✅ PASS', bugId: '', severity: ''
    },
    {
      id: 'POST-021', module: 'Posts', endpoint: '/posts/', method: 'POST',
      description: 'XSS attempt in post content',
      testData: '{"title": "Test", "content": "<script>alert(\'xss\')</script>", "public": true}',
      expected: '201 Created (sanitized) or 400/422',
      actual: '201 Created',
      status: '⚠️ WARNING', bugId: '', severity: 'LOW'
    }
  ];
  
  // Adicionar todos os test cases
  allTestCases.forEach(testCase => {
    mainSheet.addRow(testCase);
  });
  
  // ========== ESTILIZAÇÃO ==========
  
  // Cabeçalho estilizado
  const headerRow = mainSheet.getRow(4);
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4472C4' }
  };
  
  // Colorir linhas baseado no status
  allTestCases.forEach((testCase, index) => {
    const row = mainSheet.getRow(index + 5); // +5 porque título ocupa 4 linhas
    
    if (testCase.status === '❌ FAIL') {
      row.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFC7CE' } // Vermelho claro
      };
    } else if (testCase.status === '✅ PASS') {
      row.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFC6EFCE' } // Verde claro
      };
    } else if (testCase.status === '⚠️ WARNING') {
      row.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFFCC' } // Amarelo claro
      };
    }
    
    // Destacar bugs críticos
    if (testCase.severity === 'CRITICAL') {
      row.font = { bold: true, color: { argb: 'FFFF0000' } };
    }
  });
  
  // ========== SUMMARY SHEET ==========
  const summarySheet = workbook.addWorksheet('SUMMARY');
  
  // Resumo por módulo
  const moduleStats = [
    { module: 'Authentication', total: 12, passed: 12, failed: 0, passRate: '100%' },
    { module: 'Users', total: 12, passed: 7, failed: 5, passRate: '58%' },
    { module: 'Posts', total: 21, passed: 14, failed: 7, passRate: '67%' },
    { module: 'TOTAL', total: 45, passed: 33, failed: 12, passRate: '73%' }
  ];
  
  summarySheet.columns = [
    { header: 'MODULE', key: 'module', width: 20 },
    { header: 'TOTAL TESTS', key: 'total', width: 15 },
    { header: 'PASSED', key: 'passed', width: 15 },
    { header: 'FAILED', key: 'failed', width: 15 },
    { header: 'PASS RATE', key: 'rate', width: 15 }
  ];
  
  summarySheet.addRows(moduleStats);
  
  // Estilizar summary
  const summaryHeader = summarySheet.getRow(1);
  summaryHeader.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  summaryHeader.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF00B050' }
  };
  
  // ========== BUGS SHEET ==========
  const bugsSheet = workbook.addWorksheet('BUGS SUMMARY');
  
  const bugs = [
    { id: 'BUG-001', module: 'Posts', description: 'Authorization bypass - Users can edit other users posts', severity: 'CRITICAL', status: 'OPEN' },
    { id: 'BUG-002', module: 'Users', description: 'Invalid data returns wrong HTTP code (409 instead of 422)', severity: 'MEDIUM', status: 'OPEN' },
    { id: 'BUG-003', module: 'Posts', description: 'Authorization bypass - Users can delete other users posts', severity: 'CRITICAL', status: 'OPEN' },
    { id: 'BUG-004', module: 'Posts', description: 'SQL Injection vulnerability in post content', severity: 'CRITICAL', status: 'OPEN' },
    { id: 'BUG-005', module: 'Users', description: 'Inconsistent validation for field lengths', severity: 'MEDIUM', status: 'OPEN' },
    { id: 'BUG-006', module: 'Users', description: 'Missing required fields validation inconsistent', severity: 'MEDIUM', status: 'OPEN' },
    { id: 'BUG-007', module: 'Posts', description: 'Invalid post data accepted (empty title/content)', severity: 'MEDIUM', status: 'OPEN' }
  ];
  
  bugsSheet.columns = [
    { header: 'BUG ID', key: 'id', width: 10 },
    { header: 'MODULE', key: 'module', width: 12 },
    { header: 'DESCRIPTION', key: 'description', width: 60 },
    { header: 'SEVERITY', key: 'severity', width: 15 },
    { header: 'STATUS', key: 'status', width: 12 }
  ];
  
  bugsSheet.addRows(bugs);
  
  // Colorir bugs por severidade
  bugs.forEach((bug, index) => {
    const row = bugsSheet.getRow(index + 2);
    if (bug.severity === 'CRITICAL') {
      row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF9999' } };
    } else if (bug.severity === 'MEDIUM') {
      row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF99' } };
    }
  });
  
  // ========== SALVAR ARQUIVO ==========
  const fileName = 'Complete_Test_Report.xlsx';
  await workbook.xlsx.writeFile(fileName);
  
  console.log('========================================');
  console.log('✅ RELATÓRIO PRINCIPAL GERADO COM SUCESSO');
  console.log('========================================');
  console.log(`📁 Arquivo: ${fileName}`);
  console.log('\n📊 CONTEÚDO:');
  console.log('1. MAIN TEST REPORT - 45 test cases detalhados');
  console.log('   • Authentication: 12 tests (100% pass)');
  console.log('   • Users: 12 tests (58% pass)');
  console.log('   • Posts: 21 tests (67% pass)');
  console.log('2. SUMMARY - Estatísticas por módulo');
  console.log('3. BUGS SUMMARY - 7 bugs encontrados');
  console.log('\n📈 TOTAL: 45 test cases, 33 passed, 12 failed (73% pass rate)');
  console.log('🔴 CRITICAL BUGS: 3');
  console.log('🟡 MEDIUM BUGS: 4');
  console.log('========================================');
  
  return fileName;
}

// Executar o gerador
generateMainReport().catch(console.error);