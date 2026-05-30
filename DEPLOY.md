# Deploy do Avantis Studio no Vercel

Arquitetura final:
- **Frontend** (Vite/React) → Vercel. Sistema único: **Avantis Studio** (entra direto em `/`).
- **Backend** (`/api/*`) → funções serverless do Vercel (`api/[...path].mjs`).
- **Dados** → Supabase (tabelas `channels` e `channel_history`).
- **Login** → Supabase Auth (e-mail + senha). Protege a interface **e** a API.
- **Chaves de API** (YouTube) → só no servidor (variáveis de ambiente). **Nada no front.**

No dev local: `npm run dev` sobe o `server.mjs` (porta 3001) e o Vite faz proxy de `/api`.

---

## 1. Variáveis de ambiente no Vercel

**Project → Settings → Environment Variables** (Production, Preview e Development):

| Nome | Valor | Para quê |
|------|-------|----------|
| `SUPABASE_URL` | `https://hakvewukaphjuqgbdueb.supabase.co` | Backend ler/gravar no Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | *(chave `service_role` secreta)* | Backend (ignora RLS) |
| `YOUTUBE_API_KEY` | *(chave da YouTube Data API v3)* | API do YouTube no servidor |
| `VITE_SUPABASE_URL` | `https://hakvewukaphjuqgbdueb.supabase.co` | Frontend (login + cliente Supabase) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | *(chave `anon` pública)* | Frontend (login) + backend valida o token |

> ⚠️ Use `YOUTUBE_API_KEY` **sem** o prefixo `VITE_`.
> Variáveis com `VITE_` são embutidas no JavaScript do navegador.

---

## 2. Configurar o login (Supabase Auth)

1. No painel do Supabase: **Authentication → Providers → Email** → deixe **Email** ativado.
2. **Authentication → Sign In / Providers** (ou *Settings*) → **DESATIVE** "Allow new users to sign up".
   Assim ninguém cria conta — só você entra.
3. Crie o **seu** usuário: **Authentication → Users → Add user** → informe seu e-mail e senha
   (marque "Auto Confirm User" para não precisar confirmar por e-mail).
4. Pronto: na tela de login do app, use esse e-mail e senha.

> Esqueceu a senha? Em **Authentication → Users**, clique no usuário → "Reset password" /
> ou apague e crie de novo.

---

## 3. Configurar a chave da YouTube Data API v3

1. **Google Cloud Console** → https://console.cloud.google.com/
2. **APIs e serviços → Biblioteca** → "YouTube Data API v3" → **Ativar**.
3. **Credenciais → Criar credenciais → Chave de API** → copie (formato `AIza...`).
4. (Recomendado) restrinja a chave só à **YouTube Data API v3**.
5. Cole no Vercel como `YOUTUBE_API_KEY`.

---

## 4. Publicar

1. Push para o GitHub (a branch principal).
2. No Vercel: **Add New → Project → Import** o repositório (ou só dê push, se já conectado).
3. Framework: **Vite** (já fixado em `vercel.json`). Confirme as variáveis do passo 1 → **Deploy**.

## 5. Conferir depois do deploy

- `https://SEU-APP.vercel.app/api/status` → `{"status":"ok","supabase":true}` (rota pública).
- Abrir o app → cai na **tela de login**. Entre com seu usuário do Supabase.
- Depois de logar: os 263 canais carregam, monitoramento/IA funcionam.
- Sem login, `/api/channels` responde **401** (dados protegidos).

---

## Segurança (estado atual)

- Login obrigatório (Supabase Auth) para ver a interface.
- As rotas de dados (`/api/channels`, `/api/history`, `/api/youtube/*`)
  exigem token válido — protegidas no servidor.
- Rotas públicas (sem login): `/api/status` e os proxies de thumbnail/título
  (`/api/proxy/*`), porque são usados em `<img>` e não expõem dados pessoais.
- Nenhuma chave de API fica no navegador.
