# Macaw English School

Plataforma completa de gestão escolar com portal do aluno, dashboard de acompanhamento e API robusta em .NET.

## 📂 Estrutura do Projeto

```
/
├── backend/                    # .NET 8 Web API
│   ├── MacawEnglishSchool.API/ # Projeto principal da API
│   ├── MacawEnglishSchool.Tests/ # Testes de integração (xUnit)
│   └── MacawEnglishSchool.sln
├── frontend/                   # React 19 + Vite + Tailwind CSS 4
│   ├── src/
│   │   ├── api/                # Chamadas HTTP para o backend
│   │   ├── components/         # Componentes reutilizáveis
│   │   ├── context/            # Contextos (Auth, Theme, Language)
│   │   ├── data/               # Dados estáticos (FAQ, níveis, planos)
│   │   ├── hooks/              # Hooks customizados (Speech)
│   │   ├── i18n/               # Internacionalização (pt, en, es)
│   │   ├── pages/              # Páginas públicas e dashboard
│   │   └── sections/           # Seções da landing page
│   ├── jest.config.js
│   └── package.json
└── render.yaml                 # Deploy config
```

---

## 🛠️ Tech Stack

### Backend
| Tecnologia         | Versão      |
|--------------------|-------------|
| .NET               | 8.0 Web API |
| MongoDB            | Atlas (3.9) |
| Autenticação       | BCrypt      |
| Documentação       | Swagger UI  |
| Padrões            | Repository Pattern, Service Layer |

**Controllers e Rotas:**
| Controller     | Rotas                                                                 |
|----------------|-----------------------------------------------------------------------|
| AuthController | `POST /api/auth/signup`, `POST /api/auth/login`, `GET/PUT /api/auth/user/{id}` |
| CoursesController | `GET/POST /api/courses`, `GET/PUT/DELETE /api/courses/{id}`        |
| StudentsController | `GET/POST /api/students`, `GET/PUT/DELETE /api/students/{id}`     |
| LessonsController | `GET /api/lessons`, `GET /api/lessons/level/{code}`, `GET /api/lessons/module/{id}`, `GET/POST /api/lessons/{id}`, `PUT/DELETE /api/lessons/{id}` |
| TestsController | `GET/POST /api/tests`, `POST /api/tests/results`, resultados por aluno |
| ProgressController | `GET/POST /api/progress`, `POST /api/progress/complete-lesson`    |
| MessagesController | `GET /api/messages/conversations/{userId}`, `POST /api/messages/send` |
| AIController    | `POST /api/ai/chat` (Gemini 2.0 Flash)                              |
| SeedController  | `POST /api/seed/all`, `POST /api/seed/file`, `GET /api/seed/files`  |

**Middlewares:** Logging, Error Handling, CORS (AllowAll)

### Frontend
| Tecnologia       | Versão       |
|------------------|--------------|
| React            | 19           |
| Vite             | 7            |
| Tailwind CSS     | 4            |
| React Router     | 7            |
| Framer Motion    | 12           |
| Recharts         | 3            |
| i18n             | Custom (pt, en, es) |

**Estrutura de Páginas:**
- **Landing Page:** Home com seções de cursos, planos, FAQ, Hall da Fama
- **Autenticação:** Login e Signup
- **Dashboard:** Home, Perfil, Configurações, Chat, AI Practice
- **Cursos:** MyCourses, CoursePage, LessonViewer, TestPage

---

## 🚀 Getting Started

### Pré-requisitos
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js LTS](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local ou Atlas)

### 1. Backend Setup
```bash
cd backend/MacawEnglishSchool.API
# Configure a connection string em appsettings.json
dotnet restore
dotnet run
# API disponível em http://localhost:5196 | Swagger: /swagger
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Testes

### Backend (xUnit + WebApplicationFactory)
```bash
cd backend
dotnet test MacawEnglishSchool.Tests
```

28 testes de integração cobrindo:

- **AuthController** (9 testes): signup, login, getUser, updateUser — sucesso e erros
- **CoursesController** (8 testes): CRUD completo com casos de sucesso e 404
- **StudentsController** (8 testes): CRUD completo com casos de sucesso e 404

Os testes usam **Moq** para simular os repositórios MongoDB e **WebApplicationFactory** para subir a API em memória.

### Frontend (Jest + React Testing Library)
```bash
cd frontend
npm test              # Executa testes
npm run test:coverage  # Com cobertura
npm run test:watch    # Modo watch
```

39 testes unitários e de componentes cobrindo:

- **Componentes:** Spinner, SectionTitle, ThemeToggle, LanguageSelector, Navbar, Footer
- **Contextos:** AuthContext (login, logout, localStorage)
- **API:** courseApi (9 funções mockando fetch)
- **App:** Renderização de rotas (/login, /signup)

---

## 🗄️ Banco de Dados

MongoDB com collections:
- `users`, `students`, `courses`, `lessons`, `moduleTests`, `testResults`, `studentProgress`, `messages`

Para popular dados de teste:
```bash
curl -X POST http://localhost:5196/api/seed/all
```

Os arquivos de seed ficam em `backend/MacawEnglishSchool.API/SeedData/`.

---

## 🤖 AI Integration

O endpoint `POST /api/ai/chat` utiliza **Gemini 2.0 Flash** da Google para prática de conversação em inglês.

Configure a chave da API via variável de ambiente:
```
Gemini__ApiKey=sua_chave_aqui
```

O controller inclui rate limiting (50 req/min) e retry com exponential backoff para respostas 429.

---

## 🌐 Internationalization

O frontend suporta 3 idiomas via contexto customizado:
- 🇧🇷 Português (padrão)
- 🇬🇧 English
- 🇪🇸 Español

---

## 📄 Licença

Este projeto está licenciado sob os termos descritos em [LICENSE.txt](./LICENSE.txt).
