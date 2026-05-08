# Time-Based Access Window System - Frontend

A modern React application for managing role-based access with time-based access windows. Users can only access protected resources within their assigned time windows.

## 🎯 Features

- **User Authentication**: Register and login with JWT
- **User Dashboard**: View access status and attempt resource access
- **Admin Dashboard**: Manage users and configure access windows with full CRUD operations
- **Real-time Access Control**: Time-based verification for resource access
- **Access Logging**: Complete audit trail of all access attempts
- **Role-Based Navigation**: Different UI for users and admins
- **Responsive Design**: Works seamlessly on all devices

## 🛠 Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router v6** - Routing
- **Axios** - HTTP client
- **Context API** - State management
- **JWT** - Authentication

## 📦 Installation

### Prerequisites
- Node.js 16+
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/Pavitra2605/FSD36-PCP-Frontend.git
cd FSD36-PCP-Frontend

# Install dependencies
npm install

# Create environment file (optional)
echo "VITE_API_URL=http://localhost:5000/api" > .env.local

# Start development server
npm run dev
```

The app will open at `http://localhost:3000`

## 🚀 Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx              # Navigation bar with user info
│   └── ProtectedRoute.jsx       # Route protection component
├── pages/
│   ├── Login.jsx               # User login page
│   ├── Register.jsx            # User registration page
│   ├── UserDashboard.jsx       # User access status & resource access
│   └── AdminDashboard.jsx      # Admin panel with CRUD operations
├── context/
│   └── AuthContext.jsx         # Authentication state management
├── api/
│   └── axiosConfig.js          # HTTP client configuration
├── App.jsx                     # Main router component
├── App.css                     # Global styles
└── main.jsx                    # Application entry point
```

## 🔐 Authentication

The app uses JWT (JSON Web Tokens) for authentication:

1. **Register** → Creates account and returns JWT token
2. **Login** → Authenticates user and returns JWT token
3. **Token Storage** → JWT stored in localStorage
4. **Protected Routes** → Automatic redirection if not authenticated
5. **Token Validation** → Axios interceptor adds token to all requests

## 🎨 Pages

### Login Page
- Email and password input
- User/Admin role selection
- Links to registration
- Error messages for failed login

### Register Page
- Name, email, password fields
- Role selection (User/Admin)
- Account creation with auto-login
- Links to login page

### User Dashboard
- Display current access status
- Show access window start/end times
- "Access Protected Resource" button
- Real-time feedback on access attempts
- Current time display

### Admin Dashboard
- **Manage Users Tab**
  - View all users and their access windows
  - CREATE: Set new access window
  - UPDATE: Edit existing access windows (modal)
  - DELETE: Remove access windows
- **Access Logs Tab**
  - View all access attempts
  - Filter by user
  - See success/failure status

## 🔗 API Endpoints Used

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### User Routes
- `GET /api/user/status` - Get access status
- `GET /api/user/protected-resource` - Attempt resource access

### Admin Routes
- `PUT /api/admin/access/:userId` - Create/Set access window
- `PATCH /api/admin/access/:userId` - Update access window
- `DELETE /api/admin/access/:userId` - Delete access window
- `GET /api/admin/users` - Get all users
- `GET /api/admin/logs` - Get access logs

## 🧪 Testing

### Test User Accounts

**Admin Account**
```
Email: admin@example.com
Password: admin123
Role: admin
```

**User Account**
```
Email: user@example.com
Password: user123
Role: user
```

### Test Scenario

1. Login as admin
2. Go to Admin Dashboard
3. Create access window for a user (set times around current time)
4. Logout and login as user
5. Click "Access Protected Resource"
6. Should see "Access granted" message
7. Go back to admin dashboard and check "Access Logs"

## 🌐 Environment Variables

```
VITE_API_URL=http://localhost:5000/api
```

For production, update this to your backend URL:
```
VITE_API_URL=https://your-backend.onrender.com/api
```

## 🚀 Deployment on Vercel

### Prerequisites
- GitHub repository pushed
- Vercel account

### Steps

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - Framework: React
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add Environment Variable:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-url/api`
6. Click "Deploy"

## 📚 Component Documentation

### Navbar.jsx
- Displays user info and role
- Navigation links based on role
- Logout button

### ProtectedRoute.jsx
- Wraps routes that require authentication
- Verifies user role
- Redirects to login if not authenticated

### AuthContext.jsx
- Global authentication state
- Manages login/logout
- Persists token in localStorage

### axiosConfig.js
- Configured Axios instance
- Auto-attaches JWT to requests
- Handles 401 responses

## 🐛 Troubleshooting

### API Connection Error
- Check if backend is running on port 5000
- Verify `VITE_API_URL` in `.env.local`
- Check browser console for CORS errors

### Token Not Persisting
- Check browser localStorage (DevTools → Application → LocalStorage)
- Verify AuthContext is wrapping the app
- Check if cookies are enabled

### CSS Not Loading
- Clear browser cache
- Run `npm run dev` again
- Check that Tailwind is configured properly

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start dev server at localhost:3000

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Linting (optional)
npm run lint         # Run ESLint
```

## 🔒 Security Notes

- ✅ Passwords hashed with bcryptjs on backend
- ✅ JWT tokens with expiration
- ✅ Protected routes require authentication
- ✅ Role-based access control
- ✅ CORS enabled on backend
- ⚠️ Never commit `.env` files
- ⚠️ Regenerate JWT_SECRET in production

## 📦 Dependencies

- `react` (18.2.0) - UI library
- `react-dom` (18.2.0) - React DOM rendering
- `react-router-dom` (6.16.0) - Client-side routing
- `axios` (1.5.0) - HTTP client
- `tailwindcss` (3.3.0) - CSS framework
- `vite` (5.0.0) - Build tool

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License - Feel free to use for personal or commercial projects

## 👨‍💻 Author

**Pavitra2605**
- GitHub: https://github.com/Pavitra2605
- Project: Time-Based Access Window System

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the API documentation in backend README
3. Check browser console for errors
4. Open an issue on GitHub

---

**Built with ❤️ using React and Tailwind CSS**
