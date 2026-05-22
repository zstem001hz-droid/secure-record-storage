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

## Reflection

Building this lab reinforced a core principle from enterprise security that translates directly to application development — authentication and authorization are not the same thing, and treating them as such creates serious vulnerabilities.

The ownership check pattern — `note.user.toString() === req.user._id.toString()` — is deceptively simple but critically important. MongoDB ObjectIds are not plain strings, and comparing them without `.toString()` produces silent false negatives. The authorization check passes when it should fail, and no error is thrown. This is the kind of subtle bug that passes code review, ships to production, and gets exploited. The `.toString()` conversion is not optional.

From an Identity Access Management (IAM) perspective, this lab maps directly to resource-level access control — the principle that identity alone is not sufficient to grant access to a specific resource. In enterprise PAM platforms, a privileged account being authenticated does not mean it can access every vault. Access is scoped to specific resources based on ownership, role, and policy. The `authMiddleware` handles authentication — proving who the user is. The ownership check in each route handles authorization — proving what that user is allowed to touch. Both layers are required. Neither is sufficient alone.

The `authMiddleware` architecture is also worth noting. Applying it once at the router level with `router.use(authMiddleware)` rather than on each individual route is a cleaner, more maintainable pattern. It mirrors the principle of least privilege at the architecture level — rather than deciding per-route whether to check auth, the default is always authenticated and exceptions are explicit. That's the right default.

The most important takeaway from this lab is that authorization logic belongs close to the data, not at the edge. Checking ownership inside the route handler, after the note is retrieved, ensures the check is always performed against the actual resource — not an assumed state. That pattern holds at any scale.
