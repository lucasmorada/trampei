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

## Deploy na Vercel

1. **Root Directory:** em **Settings → General → Root Directory**, use **`client`**. Na raiz do monorepo não há `package.json` do Next.
2. **Variáveis de ambiente** (Settings → Environment Variables):
   - `NEXT_PUBLIC_API_URL` — URL pública da API com sufixo `/api`, ex. `https://seu-backend.onrender.com/api`.
   - `NEXT_PUBLIC_SOCKET_URL` — mesma origem **sem** `/api`, ex. `https://seu-backend.onrender.com`.
   - Opcional: `NEXT_PUBLIC_SITE_URL` — URL do app na Vercel, ex. `https://trampei.vercel.app`.
3. **Não** defina `STATIC_EXPORT=true` na Vercel (ativa export estático e quebra `/perfil/[id]` e `/servicos/[id]`).
4. **Não** defina `NEXT_PUBLIC_BASE_PATH` na Vercel (é só para GitHub Pages).
5. **Backend:** no servidor (Render/Railway/…), `CLIENT_URL` deve ser a URL do frontend na Vercel. O código aceita também qualquer `*.vercel.app` em CORS (útil para previews).

Arquivo [`client/vercel.json`](client/vercel.json) deixa o build explícito. Se o deploy falhar por “não achou Next”, verifique o Root Directory.

## GitHub Pages (`*.github.io/Trampei/`)

O GitHub Pages **só hospeda arquivos estáticos**. Ele **não executa** Node/Express nem MongoDB. Por isso, ao abrir [https://lucasmorada.github.io/Trampei/](https://lucasmorada.github.io/Trampei/) sem configurar o deploy, costuma aparecer só o README: não existe um `index.html` gerado pelo Next na raiz do repositório.

### O que fazer (duas opções)

1. **Recomendado para o app completo (API + rotas dinâmicas):** use **[Vercel](https://vercel.com)** (frontend) e **[Render](https://render.com)** / **[Railway](https://railway.app)** (backend). Conecte o repositório [lucasmorada/Trampei](https://github.com/lucasmorada/Trampei) e defina as variáveis de ambiente (`NEXT_PUBLIC_API_URL`, `MONGODB_URI`, etc.).

2. **Só demonstração estática no GitHub Pages:** o workflow [`.github/workflows/github-pages.yml`](.github/workflows/github-pages.yml) gera o export estático do Next com `basePath: /Trampei` e publica na GitHub Pages.

   No repositório GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions** (não “Deploy from a branch”).

   Opcional: em **Settings → Secrets and variables → Actions**, crie segredos `NEXT_PUBLIC_API_URL` e `NEXT_PUBLIC_SOCKET_URL` apontando para a sua API pública (senão o site abre, mas login/feed só funcionam se a API estiver acessível na URL configurada no build).

**Limitação do export estático:** o workflow cria layouts mínimos só no CI para gerar `/perfil/demo` e `/servicos/demo`. Para o app completo com qualquer ID, use a Vercel (sem `STATIC_EXPORT`).

## Licença

MIT
