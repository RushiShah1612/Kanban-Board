# 📋 Kanban Board

A modern, full-stack Kanban board application built with React, Node.js, and TypeScript. Organize your tasks efficiently with drag-and-drop functionality, user authentication, and persistent data storage.

![React](https://img.shields.io/badge/React-18-blue?logo=react) ![Node.js](https://img.shields.io/badge/Node.js-18-green?logo=nodedotjs) ![Express](https://img.shields.io/badge/Express-4-lightgrey?logo=express) ![SQLite](https://img.shields.io/badge/SQLite-3-blue?logo=sqlite) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-blue?logo=tailwindcss)

---

## ✨ Features

### 🔐 Authentication & Security
- **User Registration**: Secure sign-up with email and password.
- **Login System**: JWT-based authentication for secure sessions.
- **Password Strength**: Real-time password complexity validation (Regex).
- **Protected Routes**: Main board is accessible only to logged-in users.

### 📊 Dynamic Columns
- **Create** new columns to match your workflow
- **Rename** columns with a simple click
- **Delete** columns when no longer needed
- Default columns: Backlog, In Progress, Code Review, Done

### 🎴 Card Management
- **Add cards** with title, description, priority, and due date
- **Edit cards** to update information anytime
- **Delete cards** when tasks are complete
- **Priority tags**: Low (green), Medium (yellow), High (red)

### 🎯 Drag-and-Drop
- Smooth, intuitive drag-and-drop powered by [@dnd-kit](https://dndkit.com/)
- Move cards between columns effortlessly
- Reorder cards within the same column

### 💾 Data Persistence
- **SQLite Database**: User accounts are stored securely.
- **Local Storage**: Temporary board state persistence (migrating to DB soon).

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | Frontend UI library |
| **Node.js & Express** | Backend API server |
| **SQLite** | Database for user data |
| **JWT** | Authentication & Security |
| **TypeScript** | Type-safe development |
| **Tailwind CSS** | Styling & Design System |
| **Vite** | Fast build tool |
| **@dnd-kit** | Drag-and-drop interactions |

---

## 🚀 Getting Started

You need to run both the **Backend** and **Frontend** servers.

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### 1. Backend Setup
The backend handles authentication and the database.

```bash
# Go to server directory
cd server

# Install dependencies
npm install

# Start the server
npm start
```
*Server runs on `http://localhost:5000`*

### 2. Frontend Setup
Open a **new terminal** window for the frontend.

```bash
# Return to root directory (if needed)
# cd ..

# Install dependencies
npm install

# Start the React app
npm run dev
```
*Frontend runs on `http://localhost:5173` (typically)*

### 3. Usage
1.  Open your browser to the local URL (e.g., `http://localhost:5173`).
2.  Click **"Sign up"** to create an account.
3.  Log in to access your personal Kanban board.

---

## 📁 Project Structure

```
├── server/               # Backend logic
│   ├── index.js          # Express server entry point
│   ├── db.js             # SQLite database connection
│   ├── middleware/       # Auth middleware
│   └── routes/           # API routes (Auth)
├── src/                  # Frontend logic
│   ├── components/       # Reusable UI components
│   ├── context/          # State management (AuthContext)
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components (Login, Board)
│   ├── types/            # TypeScript definitions
│   ├── App.tsx           # Routing & App setup
│   └── main.tsx          # Entry point
└── ...
```

---

## 🔮 Future Enhancements

- [ ] **Database Logic for Boards**: Move board state from localStorage to SQLite.
- [ ] **Board Sharing**: Collaborate with team members.
- [ ] **Activity Log**: Track all changes.
- [ ] **Dark/Light Mode Toggle**: Theme preferences.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
