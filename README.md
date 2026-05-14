# Trampei

Plataforma web brasileira para conectar quem precisa de serviços freelance com profissionais locais.

**Slogan:** Trampei — conectando talentos e oportunidades.

## Stack

| Camada | Tecnologias |
|--------|-------------|
| Frontend | React 19, Next.js 16, Tailwind CSS 4, Framer Motion, Axios, react-hot-toast, next-themes, socket.io-client |
| Backend | Node.js, Express 5, MongoDB (Mongoose), JWT, bcryptjs, Socket.io, Cloudinary, Helmet, rate limit |

## Estrutura

```
trampei/
├── client/          # Next.js (App Router)
│   ├── app/         # Páginas e rotas
│   ├── components/
│   ├── context/
│   └── lib/
└── server/          # API REST + WebSocket
    └── src/
        ├── config/
        ├── controllers/
        ├── middlewares/
        ├── models/
        ├── routes/
        └── sockets/
```

## Pré-requisitos

- Node.js 20+
- Conta [MongoDB Atlas](https://www.mongodb.com/atlas) (ou MongoDB local)
- (Opcional) [Cloudinary](https://cloudinary.com/) para upload de imagens
- (Opcional) SMTP para e-mails de recuperação de senha

## Configuração

### Backend (`server/.env`)

Copie `server/.env.example` para `server/.env` e preencha:

- `MONGODB_URI` — string de conexão MongoDB
- `JWT_SECRET` — segredo forte em produção
- `CLIENT_URL` — URL do frontend (ex.: `http://localhost:3000`)
- `CLOUDINARY_*` — para upload de foto de perfil e portfólio
- `SMTP_*` — para envio do link de redefinição de senha

### Frontend (`client/.env.local`)

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Executar em desenvolvimento

Dois terminais:

```bash
cd server && npm run dev
```

```bash
cd client && npm run dev
```

- Site: [http://localhost:3000](http://localhost:3000)
- API: [http://localhost:5000/api/health](http://localhost:5000/api/health)

## Build de produção

```bash
cd client && npm run build && npm start
cd server && npm start
```

## Funcionalidades principais

- Autenticação (cadastro, login, JWT em cookie + header, recuperação de senha)
- Perfil profissional, portfólio, tags, disponibilidade, trabalhos realizados
- Serviços com categorias, filtros, feed com scroll infinito, status (concluídos saem do feed)
- Busca unificada com sugestões
- Chat em tempo real (Socket.io) e contato via WhatsApp (`wa.me`)
- Avaliações após serviço concluído
- Dashboard, recomendações (tags + localização), modo escuro, skeletons, toasts, página 404

## Licença

MIT
