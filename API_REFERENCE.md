# BioVault API Reference

**Version:** 1.0.0  
**Base URL:** `http://localhost:3001/api` (development)  
**Base URL:** `http://192.168.2.244/api` (production)

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Error Handling](#error-handling)
4. [Rate Limiting](#rate-limiting)
5. [API Endpoints](#api-endpoints)
   - [Authentication Endpoints](#authentication-endpoints)
   - [Password Management](#password-management)
   - [Device Pairing](#device-pairing)
   - [Biometric Authentication](#biometric-authentication)
   - [Device Management](#device-management)
6. [WebSocket API](#websocket-api)
7. [Data Models](#data-models)
8. [Examples](#examples)

---

## Overview

The BioVault API is a RESTful API that provides endpoints for password management, device pairing, and biometric authentication. All endpoints except authentication return JSON responses.

### Key Features
- JWT-based authentication
- Real-time updates via WebSocket
- CORS enabled for cross-origin requests
- Comprehensive error handling
- Request validation

### Base URLs

| Environment | URL |
|------------|-----|
| Development | `http://localhost:3001/api` |
| Production | `http://192.168.2.244/api` |

### Content Type

All requests should use `Content-Type: application/json` header.

---

## Authentication

BioVault uses JWT (JSON Web Tokens) for authentication.

### Authentication Flow

1. **Register or Login** to obtain a JWT token
2. **Store the token** securely (localStorage for web, SecureStore for mobile)
3. **Include the token** in the Authorization header for all protected endpoints

### Authorization Header Format

```
Authorization: Bearer <your_jwt_token>
```

### Token Expiration

- Tokens expire after **7 days**
- Expired tokens will return a `401 Unauthorized` error
- Users must login again to obtain a new token

---

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": "Error message description"
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid or missing token |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 500 | Internal Server Error |

### Common Error Messages

| Error | Description |
|-------|-------------|
| "Invalid token" | JWT token is invalid or expired |
| "Email and password are required" | Missing required fields |
| "User already exists" | Email is already registered |
| "Invalid credentials" | Wrong email or password |
| "Password not found" | Requested password doesn't exist |

---

## Rate Limiting

Currently, there is no rate limiting implemented in the prototype. For production deployments, consider implementing rate limiting to prevent abuse.

**Recommended Limits:**
- Authentication endpoints: 5 requests per minute
- Password endpoints: 100 requests per minute
- Biometric auth: 10 requests per minute

---

## API Endpoints

### Health Check

#### GET /api/health

Check if the API server is running.

**Authentication:** Not required

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-11-19T12:00:00.000Z"
}
```

---

## Authentication Endpoints

### Register User

#### POST /api/auth/register

Register a new user account.

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "masterPassword": "securePassword123"  // Alternative field name
}
```

**Validation:**
- Email is required and must be valid
- Password is required and must be at least 8 characters

**Success Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "email": "user@example.com"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Email and password are required"
}
```

**Error Response (409):**
```json
{
  "success": false,
  "error": "User already exists"
}
```

---

### Login

#### POST /api/auth/login

Authenticate user and obtain JWT token.

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "masterPassword": "securePassword123"  // Alternative field name
}
```

**Success Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "email": "user@example.com"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

---

### Logout

#### POST /api/auth/logout

Logout user (client-side token removal).

**Authentication:** Required

**Request Body:**
```json
{}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Password Management

### Get All Passwords

#### GET /api/passwords

Retrieve all passwords for the authenticated user.

**Authentication:** Required

**Query Parameters:**
- `domain` (optional) - Filter passwords by domain
- `category` (optional) - Filter passwords by category

**Success Response (200):**
```json
{
  "success": true,
  "passwords": [
    {
      "id": "uuid-1234",
      "website": "github.com",
      "username": "user@example.com",
      "password": "encrypted_password",
      "category": "Development",
      "notes": "Work account",
      "favorite": false,
      "createdAt": "2024-11-19T12:00:00.000Z",
      "updatedAt": "2024-11-19T12:00:00.000Z"
    }
  ]
}
```

---

### Get Single Password

#### GET /api/passwords/:id

Retrieve a specific password by ID.

**Authentication:** Required

**URL Parameters:**
- `id` (required) - Password UUID

**Success Response (200):**
```json
{
  "success": true,
  "password": {
    "id": "uuid-1234",
    "website": "github.com",
    "username": "user@example.com",
    "password": "encrypted_password",
    "category": "Development",
    "notes": "Work account",
    "favorite": false,
    "createdAt": "2024-11-19T12:00:00.000Z",
    "updatedAt": "2024-11-19T12:00:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Password not found"
}
```

---

### Create Password

#### POST /api/passwords

Create a new password entry.

**Authentication:** Required

**Request Body:**
```json
{
  "website": "github.com",
  "username": "user@example.com",
  "password": "mySecurePassword123",
  "category": "Development",
  "notes": "Work account",
  "favorite": false
}
```

**Required Fields:**
- `website` - Website URL or name
- `username` - Username or email
- `password` - Password (will be encrypted)

**Optional Fields:**
- `category` - Category name (default: "General")
- `notes` - Additional notes
- `favorite` - Mark as favorite (default: false)

**Success Response (201):**
```json
{
  "success": true,
  "password": {
    "id": "uuid-5678",
    "website": "github.com",
    "username": "user@example.com",
    "password": "encrypted_password",
    "category": "Development",
    "notes": "Work account",
    "favorite": false,
    "createdAt": "2024-11-19T12:00:00.000Z",
    "updatedAt": "2024-11-19T12:00:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Website, username, and password are required"
}
```

---

### Update Password

#### PUT /api/passwords/:id

Update an existing password entry.

**Authentication:** Required

**URL Parameters:**
- `id` (required) - Password UUID

**Request Body:**
```json
{
  "website": "github.com",
  "username": "newuser@example.com",
  "password": "newSecurePassword123",
  "category": "Development",
  "notes": "Updated work account",
  "favorite": true
}
```

**Note:** All fields are optional. Only provided fields will be updated.

**Success Response (200):**
```json
{
  "success": true,
  "password": {
    "id": "uuid-1234",
    "website": "github.com",
    "username": "newuser@example.com",
    "password": "encrypted_password",
    "category": "Development",
    "notes": "Updated work account",
    "favorite": true,
    "createdAt": "2024-11-19T12:00:00.000Z",
    "updatedAt": "2024-11-19T13:00:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Password not found"
}
```

---

### Delete Password

#### DELETE /api/passwords/:id

Delete a password entry.

**Authentication:** Required

**URL Parameters:**
- `id` (required) - Password UUID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password deleted successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Password not found"
}
```

---

## Device Pairing

### Request Pairing Code

#### POST /api/pairing/request

Request a pairing code for device pairing.

**Authentication:** Required

**Request Body:**
```json
{
  "deviceType": "mobile",
  "deviceName": "iPhone 13"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "pairingCode": "ABC123",
  "expiresIn": 300,
  "qrCode": "data:image/png;base64,..."
}
```

**Response Fields:**
- `pairingCode` - 6-character alphanumeric code
- `expiresIn` - Expiration time in seconds (5 minutes)
- `qrCode` - Base64-encoded QR code image

---

### Verify Pairing Code

#### POST /api/pairing/verify

Verify a pairing code (called by mobile app).

**Authentication:** Required

**Request Body:**
```json
{
  "pairingCode": "ABC123",
  "deviceId": "device-uuid-1234",
  "deviceName": "iPhone 13",
  "deviceType": "mobile"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Pairing code verified. Complete pairing with biometric authentication.",
  "pairingToken": "temp-token-1234"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Invalid or expired pairing code"
}
```

---

### Complete Pairing

#### POST /api/pairing/complete

Complete device pairing after biometric authentication.

**Authentication:** Required

**Request Body:**
```json
{
  "pairingToken": "temp-token-1234",
  "biometricVerified": true
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Device paired successfully",
  "device": {
    "id": "device-uuid-1234",
    "name": "iPhone 13",
    "type": "mobile",
    "pairedAt": "2024-11-19T12:00:00.000Z"
  }
}
```

---

## Biometric Authentication

### Request Biometric Authentication

#### POST /api/auth/biometric/request

Request biometric authentication for a login action.

**Authentication:** Required (from browser extension)

**Request Body:**
```json
{
  "website": "github.com",
  "username": "user@example.com",
  "requestId": "request-uuid-1234"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Biometric authentication request sent to mobile device",
  "requestId": "request-uuid-1234",
  "expiresIn": 120
}
```

**Note:** The mobile app will receive a WebSocket notification about this request.

---

### Approve Biometric Authentication

#### POST /api/auth/biometric/approve

Approve a biometric authentication request (called by mobile app).

**Authentication:** Required (from mobile app)

**Request Body:**
```json
{
  "requestId": "request-uuid-1234",
  "biometricVerified": true
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Authentication approved",
  "credentials": {
    "website": "github.com",
    "username": "user@example.com",
    "password": "decrypted_password"
  }
}
```

**Note:** The browser extension will receive a WebSocket notification with the credentials.

---

### Deny Biometric Authentication

#### POST /api/auth/biometric/deny

Deny a biometric authentication request.

**Authentication:** Required (from mobile app)

**Request Body:**
```json
{
  "requestId": "request-uuid-1234",
  "reason": "User declined"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Authentication denied"
}
```

---

## Device Management

### Get Paired Devices

#### GET /api/devices

Retrieve all paired devices for the authenticated user.

**Authentication:** Required

**Success Response (200):**
```json
{
  "success": true,
  "devices": [
    {
      "id": "device-uuid-1234",
      "name": "iPhone 13",
      "type": "mobile",
      "pairedAt": "2024-11-19T12:00:00.000Z",
      "lastUsed": "2024-11-19T14:30:00.000Z"
    },
    {
      "id": "device-uuid-5678",
      "name": "Chrome Extension",
      "type": "extension",
      "pairedAt": "2024-11-18T10:00:00.000Z",
      "lastUsed": "2024-11-19T15:00:00.000Z"
    }
  ]
}
```

---

### Unpair Device

#### DELETE /api/devices/:id

Remove a paired device.

**Authentication:** Required

**URL Parameters:**
- `id` (required) - Device UUID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Device unpaired successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Device not found"
}
```

---

## WebSocket API

### Connection

Connect to the WebSocket server for real-time updates.

**URL:** `ws://localhost:3001` (development) or `ws://192.168.2.244` (production)

**Authentication:** Send token in the first message

```javascript
const socket = new WebSocket('ws://localhost:3001');

socket.onopen = () => {
  socket.send(JSON.stringify({
    type: 'authenticate',
    token: 'your_jwt_token'
  }));
};
```

### Client → Server Events

#### Authenticate
```json
{
  "type": "authenticate",
  "token": "jwt_token"
}
```

#### Sync Passwords
```json
{
  "type": "sync",
  "data": {
    "passwords": [...]
  }
}
```

#### Request Pairing
```json
{
  "type": "pair_request",
  "deviceId": "device-uuid"
}
```

#### Biometric Auth Request
```json
{
  "type": "auth_request",
  "website": "github.com",
  "username": "user@example.com"
}
```

### Server → Client Events

#### Connected
```json
{
  "type": "connected",
  "message": "Connected to BioVault"
}
```

#### Sync Update
```json
{
  "type": "sync",
  "data": {
    "passwords": [...]
  }
}
```

#### Pairing Response
```json
{
  "type": "pair_response",
  "pairingCode": "ABC123",
  "qrCode": "data:image/png;base64,..."
}
```

#### Auth Request Pending
```json
{
  "type": "auth_pending",
  "requestId": "request-uuid",
  "website": "github.com",
  "username": "user@example.com"
}
```

#### Auth Approved
```json
{
  "type": "auth_approved",
  "requestId": "request-uuid",
  "credentials": {
    "website": "github.com",
    "username": "user@example.com",
    "password": "decrypted_password"
  }
}
```

#### Auth Denied
```json
{
  "type": "auth_denied",
  "requestId": "request-uuid",
  "reason": "User declined"
}
```

---

## Data Models

### User

```typescript
{
  id: string;           // UUID
  email: string;        // User email
  password: string;     // Hashed password (bcrypt)
  createdAt: Date;      // Account creation date
  updatedAt: Date;      // Last update date
}
```

### Password

```typescript
{
  id: string;           // UUID
  userId: string;       // User UUID (foreign key)
  website: string;      // Website URL or name
  username: string;     // Username or email
  password: string;     // Encrypted password
  category: string;     // Category name
  notes: string;        // Additional notes
  favorite: boolean;    // Favorite flag
  createdAt: Date;      // Creation date
  updatedAt: Date;      // Last update date
}
```

### Device

```typescript
{
  id: string;           // UUID
  userId: string;       // User UUID (foreign key)
  name: string;         // Device name
  type: string;         // 'mobile' | 'extension' | 'web'
  pairedAt: Date;       // Pairing date
  lastUsed: Date;       // Last usage date
}
```

### PairingRequest

```typescript
{
  code: string;         // 6-character code
  userId: string;       // User UUID
  deviceType: string;   // Device type
  deviceName: string;   // Device name
  expiresAt: Date;      // Expiration date
  used: boolean;        // Used flag
}
```

### AuthRequest

```typescript
{
  id: string;           // UUID
  userId: string;       // User UUID
  website: string;      // Website requesting auth
  username: string;     // Username for the website
  status: string;       // 'pending' | 'approved' | 'denied'
  expiresAt: Date;      // Expiration date
  createdAt: Date;      // Creation date
}
```

---

## Examples

### Complete Authentication Flow

```javascript
// 1. Register
const registerResponse = await fetch('http://localhost:3001/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securePassword123'
  })
});

const { token } = await registerResponse.json();

// 2. Store token
localStorage.setItem('token', token);

// 3. Use token for authenticated requests
const passwordsResponse = await fetch('http://localhost:3001/api/passwords', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const { passwords } = await passwordsResponse.json();
```

### Create and Retrieve Password

```javascript
// Create password
const createResponse = await fetch('http://localhost:3001/api/passwords', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    website: 'github.com',
    username: 'myusername',
    password: 'mySecurePassword',
    category: 'Development',
    notes: 'Work account'
  })
});

const { password } = await createResponse.json();
console.log('Created password:', password.id);

// Retrieve passwords
const getResponse = await fetch('http://localhost:3001/api/passwords', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const { passwords } = await getResponse.json();
console.log('Total passwords:', passwords.length);
```

### Device Pairing Flow

```javascript
// 1. Web dashboard requests pairing
const pairRequest = await fetch('http://localhost:3001/api/pairing/request', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${webToken}`
  },
  body: JSON.stringify({
    deviceType: 'mobile',
    deviceName: 'My iPhone'
  })
});

const { pairingCode, qrCode } = await pairRequest.json();

// 2. Mobile app scans QR code and verifies
const verifyResponse = await fetch('http://localhost:3001/api/pairing/verify', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${mobileToken}`
  },
  body: JSON.stringify({
    pairingCode: pairingCode,
    deviceId: 'mobile-device-uuid',
    deviceName: 'My iPhone',
    deviceType: 'mobile'
  })
});

const { pairingToken } = await verifyResponse.json();

// 3. After biometric auth, complete pairing
const completeResponse = await fetch('http://localhost:3001/api/pairing/complete', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${mobileToken}`
  },
  body: JSON.stringify({
    pairingToken: pairingToken,
    biometricVerified: true
  })
});

const { device } = await completeResponse.json();
console.log('Device paired:', device.id);
```

### Biometric Authentication Flow

```javascript
// 1. Extension requests biometric auth
const authRequest = await fetch('http://localhost:3001/api/auth/biometric/request', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${extensionToken}`
  },
  body: JSON.stringify({
    website: 'github.com',
    username: 'myusername',
    requestId: 'unique-request-id'
  })
});

const { requestId } = await authRequest.json();

// 2. Mobile app receives WebSocket notification
// User approves with biometric

// 3. Mobile app sends approval
const approveResponse = await fetch('http://localhost:3001/api/auth/biometric/approve', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${mobileToken}`
  },
  body: JSON.stringify({
    requestId: requestId,
    biometricVerified: true
  })
});

// 4. Extension receives WebSocket notification with credentials
// Extension auto-fills the form
```

### WebSocket Connection Example

```javascript
const socket = new WebSocket('ws://localhost:3001');

socket.onopen = () => {
  // Authenticate
  socket.send(JSON.stringify({
    type: 'authenticate',
    token: localStorage.getItem('token')
  }));
};

socket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  
  switch (message.type) {
    case 'connected':
      console.log('Connected to server');
      break;
      
    case 'sync':
      console.log('Passwords updated:', message.data.passwords);
      // Update local state
      break;
      
    case 'auth_pending':
      console.log('Auth request:', message.website);
      // Show notification
      break;
      
    case 'auth_approved':
      console.log('Auth approved:', message.credentials);
      // Auto-fill form
      break;
  }
};

socket.onerror = (error) => {
  console.error('WebSocket error:', error);
};

socket.onclose = () => {
  console.log('Disconnected from server');
  // Attempt reconnection
};
```

---

## Testing the API

### Using cURL

```bash
# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Get passwords (replace TOKEN)
curl http://localhost:3001/api/passwords \
  -H "Authorization: Bearer TOKEN"

# Create password
curl -X POST http://localhost:3001/api/passwords \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"website":"github.com","username":"user","password":"pass123"}'
```

### Using Postman

1. Import the API collection (if available)
2. Set environment variable for `baseUrl` and `token`
3. Test each endpoint

### Using Browser DevTools

```javascript
// In browser console
const token = 'your_jwt_token';

fetch('http://localhost:3001/api/passwords', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## Changelog

### Version 1.0.0 (Current)
- Initial API release
- Authentication endpoints
- Password CRUD operations
- Device pairing
- Biometric authentication
- WebSocket support

### Planned for Version 1.1.0
- Password sharing endpoints
- Password history
- Two-factor authentication
- Password strength checker API
- Breach monitoring integration

---

## Support

For API support and questions:
- Check the [Troubleshooting Guide](TROUBLESHOOTING.md)
- Review this documentation
- Open an issue on GitHub
- Contact the development team

---

**Last Updated:** November 2024  
**API Version:** 1.0.0
