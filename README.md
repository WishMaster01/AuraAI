# AuraAI - AI-Powered Voice Assistant

A modern, intelligent voice assistant built with React, Node.js, and Google Gemini AI. Create your personalized AI assistant with custom names and images.

## ✨ Features

- 🎤 **Voice Recognition**: Natural voice interaction with your AI assistant
- 🎨 **Customizable Assistant**: Choose your assistant's name and avatar
- 🧠 **AI-Powered**: Powered by Google Gemini AI for intelligent responses
- 🌐 **Web Integration**: Open websites, search, and perform various tasks
- 📱 **Responsive Design**: Beautiful UI that works on all devices
- 🔐 **Secure Authentication**: JWT-based authentication with cookies
- ☁️ **Cloud Storage**: Image uploads with Cloudinary integration

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- Google Gemini API key
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd AuraAI
   ```

2. **Install dependencies**

   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**

   Create a `.env` file in the `server` directory:

   ```env
   DATABASE_URL=your_neon_postgresql_connection_string
   JWT_SECRET=your_jwt_secret_key
   GEMINI_API_KEY=your_gemini_api_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   PORT=8080
   CLIENT_ORIGIN=http://localhost:5173
   ```

4. **Initialize the database**

   ```bash
   cd server
   npm run prisma:generate
   npm run prisma:migrate
   ```

5. **Run the application**

   **Terminal 1 - Start the server:**

   ```bash
   cd server
   npm run server
   ```

   **Terminal 2 - Start the client:**

   ```bash
   cd client
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:8080

## 🎯 Usage

1. **Sign Up**: Create a new account with your email and password
2. **Customize**: Choose your assistant's name and avatar image
3. **Interact**: Start the assistant and begin voice conversations
4. **Commands**: Try commands like:
   - "Open YouTube"
   - "Search for [query]"
   - "What's the time?"
   - "Open Instagram"

## 🛠️ Tech Stack

### Frontend

- React 19
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide React Icons

### Backend

- Node.js
- Express.js
- PostgreSQL with Prisma
- JWT Authentication
- Cloudinary
- Google Gemini AI

## 📁 Project Structure

```
AuraAI/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React contexts
│   │   ├── pages/          # Page components
│   │   └── assets/         # Static assets
│   └── package.json
├── server/                 # Node.js backend
│   ├── configs/           # Configuration files
│   ├── controllers/       # Route controllers
│   ├── middlewares/       # Custom middlewares
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   └── server.js          # Main server file
└── README.md
```

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/logout` - User logout

### User Management

- `GET /api/user/current` - Get current user
- `POST /api/user/update` - Update assistant details
- `POST /api/user/asktoassistant` - Send command to assistant

## 🎨 Customization

The application supports:

- Custom assistant names
- Custom avatar images (upload or choose from gallery)
- Personalized AI responses
- Voice command recognition

## 🚀 Deployment

### Frontend (Vercel/Netlify)

1. Build the client: `cd client && npm run build`
2. Deploy the `dist` folder to your hosting service

### Backend (Railway/Heroku)

1. Set environment variables in your hosting platform
2. Deploy the `server` folder

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Google Gemini AI for intelligent responses
- Cloudinary for image storage
- React and Node.js communities
- All open-source contributors

---

**Made with ❤️ by WishMaster01**
