# Secure Record Storage

## Tech Stack

- Node.js
- Express
- MongoDB / Mongoose
- bcrypt
- jsonwebtoken
- dotenv

## Project Structure

```
secure-record-storage/
├── config/
│   └── connection.js
├── models/
│   ├── index.js
│   ├── Note.js
│   └── User.js
├── routes/
│   ├── api/
│   │   ├── index.js
│   │   ├── noteRoutes.js
│   │   └── userRoutes.js
│   └── index.js
├── utils/
│   └── auth.js
├── .env.example
├── .gitignore
├── package.json
├── server.js
└── README.md
```

## Getting Started

### Prerequisites
- Node.js
- MongoDB Atlas account

### Installation
1. Clone the repository
2. Run `npm install`
3. Copy `.env.example` to `.env` and fill in your values
4. Run `nodemon server.js`

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB Atlas connection string |
| `PORT` | Port the server runs on |
| `JWT_SECRET` | Secret key for signing JWTs |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register` | Register a new user |
| POST | `/api/users/login` | Login and receive JWT |
| GET | `/api/notes` | Get all notes for logged-in user |
| POST | `/api/notes` | Create a new note |
| PUT | `/api/notes/:id` | Update a note — owner only |
| DELETE | `/api/notes/:id` | Delete a note — owner only |

## Security Features

- Passwords hashed and salted using bcrypt with 10 salt rounds
- JWT authentication required on all note endpoints
- Ownership-based authorization — users can only access their own notes
- Generic error messages on failed login prevent email enumeration attacks
- Environment variables protect sensitive credentials
- `.env` excluded from version control via `.gitignore`

## Error Responses

| Status Code | Message | Reason |
|-------------|---------|--------|
| 400 | Incorrect email or password. | Invalid login credentials |
| 401 | You must be logged in to do that. | Missing or invalid token |
| 403 | User is not authorized to update this note. | Wrong user token |
| 403 | User is not authorized to delete this note. | Wrong user token |
| 404 | No note found with this id! | Note doesn't exist |

## Usage Examples

### Register a New User
**POST** `/api/users/register`
```json
{
  "username": "testuser",
  "email": "test@test.com",
  "password": "password123"
}
```

**Response — 201 Created:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "username": "testuser",
    "email": "test@test.com"
  }
}
```

### Create a Note
**POST** `/api/notes`
```json
{
  "title": "My First Note",
  "content": "This is a test note."
}
```

**Response — 201 Created:**
```json
{
  "_id": "...",
  "title": "My First Note",
  "content": "This is a test note.",
  "user": "...",
  "createdAt": "..."
}
```

### Unauthorized Access
**Response — 403 Forbidden:**
```json
{
  "message": "User is not authorized to update this note."
}
```

## References

- [Mongoose pre() Middleware](https://mongoosejs.com/docs/middleware.html#pre)
- [bcrypt on npm](https://www.npmjs.com/package/bcrypt)
- [jsonwebtoken on npm](https://www.npmjs.com/package/jsonwebtoken)
- [Express.js Routing Documentation](https://expressjs.com/en/guide/routing.html)
- [Mongoose Population](https://mongoosejs.com/docs/populate.html)

## Reflection

> 🚧 Work in progress
