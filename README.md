# EduCore Platform

Plataforma educacional moderna e escalável para criação, distribuição e monetização de cursos online — com inteligência artificial integrada, pagamentos nacionais e internacionais, e arquitetura de microserviços.

---

## Stack Tecnológica

| Camada       | Tecnologia                                      |
|--------------|-------------------------------------------------|
| Backend      | NestJS, TypeScript, Prisma ORM                  |
| Frontend     | Next.js 14, React, Tailwind CSS                 |
| Banco dados  | PostgreSQL 16                                   |
| Cache        | Redis 7                                         |
| Mensageria   | RabbitMQ 3                                      |
| Storage      | AWS S3                                          |
| Auth         | JWT + Google OAuth 2.0                          |
| Pagamentos   | Stripe + Mercado Pago                           |
| IA           | Anthropic Claude API                            |
| Infra        | Docker, Docker Compose                          |
| Monorepo     | Turborepo / pnpm workspaces                     |

---

## Pré-requisitos

- [Node.js 20+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [pnpm](https://pnpm.io/) — `npm install -g pnpm`

---

## Como rodar localmente

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/educore.git
cd educore
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env
# Edite o .env com suas credenciais
```

### 3. Suba os serviços de infraestrutura

```bash
docker-compose up -d
```

Aguarde os healthchecks passarem. Para verificar:

```bash
docker-compose ps
```

### 4. Instale as dependências

```bash
pnpm install
```

### 5. Execute as migrations do banco

```bash
pnpm --filter api prisma migrate dev
```

### 6. Inicie em modo desenvolvimento

```bash
pnpm dev
```

- API: http://localhost:3001
- Web: http://localhost:3000
- RabbitMQ Management: http://localhost:15672 (admin/admin)

---

## Estrutura de Pastas

```
educore/
├── apps/
│   ├── api/          # Backend NestJS
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   ├── common/
│   │   │   └── main.ts
│   │   └── prisma/
│   └── web/          # Frontend Next.js
│       ├── app/
│       ├── components/
│       └── lib/
├── packages/
│   └── shared/       # Tipos e utilitários compartilhados
│       └── src/
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

## Roadmap

### Fase 1 — Fundação (MVP)
- [x] Estrutura do monorepo
- [ ] Autenticação (JWT + Google OAuth)
- [ ] Cadastro de usuários e perfis
- [ ] CRUD de cursos e módulos
- [ ] Upload de vídeos para S3
- [ ] Painel do instrutor

### Fase 2 — Monetização
- [ ] Integração Stripe (cartão internacional)
- [ ] Integração Mercado Pago (PIX e boleto)
- [ ] Sistema de cupons e descontos
- [ ] Dashboard financeiro
- [ ] Webhooks de pagamento

### Fase 3 — Engajamento
- [ ] Sistema de progresso e certificados
- [ ] Fórum de discussão por curso
- [ ] Notificações em tempo real (WebSockets)
- [ ] Sistema de avaliações e reviews
- [ ] Gamificação (pontos, badges, ranking)

### Fase 4 — Inteligência Artificial
- [ ] Assistente de estudos com Claude AI
- [ ] Geração automática de quizzes
- [ ] Recomendação personalizada de cursos
- [ ] Transcrição e legendas automáticas
- [ ] Análise de sentimento nos fóruns

---

## Serviços Docker

| Serviço    | Porta(s)         | Credenciais          |
|------------|------------------|----------------------|
| PostgreSQL | 5432             | postgres / postgres  |
| Redis      | 6379             | —                    |
| RabbitMQ   | 5672 / 15672     | admin / admin        |

---

## Contribuindo

1. Crie uma branch: `git checkout -b feat/nome-da-feature`
2. Faça commit seguindo Conventional Commits: `feat:`, `fix:`, `chore:`
3. Abra um Pull Request descrevendo as mudanças

---

## Licença

MIT © EduCore Platform
