# Test Framework - Posts Management API

Framework de testes automatizados para a API de gerenciamento de posts.

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- Docker (opcional, para rodar a API localmente)
- npm ou yarn

## 🚀 Instalação

1. Clone o repositório ou copie os arquivos para sua máquina

2. Instale as dependências:
```bash
npm install

# Baixar e executar o container da API
docker run -d -p 8000:80 --name posts-api farlahi00/qachallenge:latest

# Verificar se está rodando
curl http://localhost:8000/

# Ver logs (se necessário)

2. Rode os testes:
```bash
npm test
