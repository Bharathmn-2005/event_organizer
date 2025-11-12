# Event Organizer Backend API

## 🚀 Complete Backend Setup

### **Prerequisites**
1. **Node.js** (v14 or higher)
2. **MongoDB** (v4.4 or higher)
3. **npm** or **yarn**

---

## 📦 Installation Steps

### **Step 1: Install MongoDB**

#### **Windows:**
1. Download MongoDB from: https://www.mongodb.com/try/download/community
2. Run the installer and follow the setup wizard
3. Install as a Windows Service (recommended)
4. MongoDB will start automatically

#### **Or use MongoDB Compass** (GUI tool):
- Download from: https://www.mongodb.com/try/download/compass
- Connect to: `mongodb://localhost:27017`

### **Step 2: Start MongoDB**

#### **Windows (if not running as service):**
```powershell
# Open Command Prompt as Administrator
mongod
```

#### **Check if MongoDB is running:**
```powershell
mongosh
# or
mongo
```

### **Step 3: Install Backend Dependencies**
```powershell
cd backend
npm install
```

### **Step 4: Configure Environment Variables**
The `.env` file is already created with default values:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/event-organizer
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

### **Step 5: Start the Server**
```powershell
npm start
# or for development with auto-reload
npm run dev
```

---

## 📊 Database Schema

### **User Schema**
```javascript
{
  name: String (required, max 50 chars),
  email: String (required, unique, valid email),
  password: String (required, hashed, min 6 chars),
  avatar: String (optional),
  joinedEvents: [ObjectId] (ref: Event),
  createdEvents: [ObjectId] (ref: Event),
  timestamps: { createdAt, updatedAt }
}
```

### **Event Schema**
```javascript
{
  title: String (required, max 100 chars),
  description: String (required, max 2000 chars),
  category: Enum (required) - ['Indie', 'Electronic', 'Rock', 'Jazz', 'Hip Hop', 'Classical', 'Pop', 'Country'],
  date: Date (required),
  time: String (required),
  location: String (required),
  organizer: String (required),
  imageUrl: String (optional, has default),
  programInfo: String (optional),
  createdBy: ObjectId (required, ref: User),
  attendees: [ObjectId] (ref: User),
  maxAttendees: Number (default: 1000),
  status: Enum (default: 'upcoming') - ['upcoming', 'ongoing', 'completed', 'cancelled'],
  timestamps: { createdAt, updatedAt }
}
```

---

## 🛣️ API Endpoints

### **Base URL:** `http://localhost:5000/api`

### **Authentication Endpoints**

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

---

### **Event Endpoints**

#### Get All Events
```http
GET /api/events
Query Parameters (optional):
  - category: Filter by category
  - search: Search in title, location, organizer
  - sort: Sort field (default: -createdAt)
  - limit: Results per page (default: 50)
  - page: Page number (default: 1)
```

#### Get Event by ID
```http
GET /api/events/:id
```

#### Create Event (Protected)
```http
POST /api/events
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Rock Concert 2024",
  "description": "Amazing rock concert featuring top bands",
  "category": "Rock",
  "date": "2024-12-25",
  "time": "7:00 PM",
  "location": "Madison Square Garden, NYC",
  "organizer": "Rock Events Inc",
  "imageUrl": "https://example.com/image.jpg",
  "programInfo": "Gates open at 6 PM. 5 bands performing."
}
```

#### Update Event (Protected - Creator Only)
```http
PUT /api/events/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description"
}
```

#### Delete Event (Protected - Creator Only)
```http
DELETE /api/events/:id
Authorization: Bearer <token>
```

#### Join Event (Protected)
```http
POST /api/events/:id/join
Authorization: Bearer <token>
```

#### Leave Event (Protected)
```http
POST /api/events/:id/leave
Authorization: Bearer <token>
```

---

### **User Endpoints (All Protected)**

#### Get User Profile
```http
GET /api/users/profile
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "avatar": "https://example.com/avatar.jpg"
}
```

#### Get Joined Events
```http
GET /api/users/joined-events
Authorization: Bearer <token>
```

#### Get Created Events
```http
GET /api/users/created-events
Authorization: Bearer <token>
```

---

## 🔒 Authentication

All protected endpoints require a JWT token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

The token is returned when you register or login:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "...",
    "email": "..."
  }
}
```

---

## 📝 Response Format

### Success Response:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response:
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ] // For validation errors
}
```

---

## 🧪 Testing the API

### Using **Postman** or **Thunder Client** (VS Code Extension):

1. **Register a user** → Get token
2. **Login** → Get token
3. **Create an event** → Use token
4. **Join an event** → Use token
5. **Get your dashboard** → Use token

---

## 🐛 Troubleshooting

### MongoDB Connection Failed:
```
❌ Make sure MongoDB is installed and running
✅ Check: http://localhost:27017
✅ Verify MONGODB_URI in .env file
✅ Run: mongod (in separate terminal)
```

### Port Already in Use:
```
Change PORT in .env file to a different port (e.g., 5001)
```

### Token Errors:
```
Make sure Authorization header is set correctly:
Authorization: Bearer <token>
```

---

## 📂 Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── auth.controller.js   # Authentication logic
│   ├── event.controller.js  # Event CRUD operations
│   └── user.controller.js   # User operations
├── middleware/
│   └── auth.middleware.js   # JWT authentication
├── models/
│   ├── User.model.js        # User schema
│   └── Event.model.js       # Event schema
├── routes/
│   ├── auth.routes.js       # Auth endpoints
│   ├── event.routes.js      # Event endpoints
│   └── user.routes.js       # User endpoints
├── .env                      # Environment variables
├── server.js                 # Main entry point
└── package.json              # Dependencies
```

---

## 🎯 Next Steps

1. ✅ Backend API is ready
2. 🔄 Connect frontend to backend
3. 🚀 Test all features
4. 📱 Deploy to production

---

## 💡 Tips

- Keep your `.env` file secure (never commit to git)
- Change JWT_SECRET in production
- Use MongoDB Atlas for cloud database
- Enable CORS for frontend domain in production

---

## 🤝 Support

If you encounter any issues:
1. Check MongoDB is running
2. Verify .env configuration
3. Check terminal for error messages
4. Review API endpoint documentation

---

**Backend is ready! Now you can connect your frontend to these APIs.**
