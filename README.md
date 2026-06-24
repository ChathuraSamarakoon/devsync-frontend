# DevSync — Real-Time Team Collaboration Platform (Frontend)

DevSync is a Slack-inspired, real-time collaboration platform built for development teams. It brings together **workspace channels, direct messaging, and task management** into a single, unified interface — allowing teams to chat and manage their work without switching between tools.

This repository contains the **frontend** of DevSync, built with React and Vite.

---

## ✨ Features

- 🔐 **Authentication** — Secure user registration and login
- 🏢 **Workspaces** — Organize teams into separate workspaces
- 💬 **Channel Chat** — Real-time group messaging within channels
- 📩 **Direct Messages** — One-on-one real-time conversations
- ✅ **Task Management** — Create and track tasks within a workspace
- ⚡ **Real-Time Updates** — Powered by Socket.IO for instant messaging and live updates
- 🎨 **Modern UI** — Clean, responsive interface styled with Tailwind CSS

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Library | React 19 |
| Build Tool | Vite |
| Routing | React Router v7 |
| Styling | Tailwind CSS v4 |
| Real-Time Communication | Socket.IO Client |
| HTTP Client | Axios |
| Icons | React Icons |
| Linting | ESLint |

---

## 📁 Project Structure

```
DevSync-Frontend/
├── public/                 # Static assets (favicon, icons, logo)
├── src/
│   ├── assets/             # Images used within the app
│   ├── components/         # Reusable UI components
│   │   ├── ChatArea.jsx           # Channel chat interface
│   │   ├── DirectMessageArea.jsx  # 1-on-1 messaging interface
│   │   ├── Sidebar.jsx            # Workspace/channel/user navigation
│   │   └── TaskArea.jsx           # Task management view
│   ├── context/             # Global state via React Context
│   │   ├── AuthContext.jsx        # Authentication state
│   │   ├── SocketContext.jsx      # Socket.IO connection management
│   │   └── WorkspaceContext.jsx   # Active workspace/channel/DM state
│   ├── pages/                # Route-level pages
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Dashboard.jsx
│   ├── services/             # API communication layer
│   │   ├── api.js                 # Axios instance config
│   │   └── authService.js         # Auth-related API calls
│   ├── App.jsx               # Route definitions
│   └── main.jsx               # App entry point
├── .env                    # Environment variables
├── package.json
└── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ChathuraSamarakoon/devsync-frontend
   cd DevSync-Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
   > Update this to point to your backend API server.

4. **Run the development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

### Other Scripts

```bash
npm run build      # Build for production
npm run preview    # Preview the production build locally
npm run lint        # Run ESLint
```

---

## 🔗 Backend

This is the **frontend only**. DevSync requires a companion backend (Node.js/Express + Socket.IO server, expected to be available at the URL configured in `VITE_API_URL`) for authentication, data persistence, and real-time event handling.

---

## 📌 Roadmap / Possible Improvements

- File and image sharing in chats
- Notifications system
- User presence (online/offline status) indicators
- Task assignment with due dates and priority levels
- Search across messages and tasks

---

## 👤 Author

Built by **Chathura** as a personal portfolio project.

---

## 📄 License

This project is open for educational and personal portfolio purposes.
