# BioVault Web Dashboard

A modern, secure web dashboard for the BioVault Password Manager with React.

## Features

- **Authentication**: Secure login and registration with JWT tokens
- **Password Management**: Add, edit, delete, and search passwords
- **Card-based UI**: Clean, modern interface with card-based password display
- **Search & Filter**: Search passwords and filter by categories
- **Device Pairing**: QR code-based device pairing for mobile apps
- **Statistics**: View password statistics and insights
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Security**: Passwords are masked by default with toggle visibility
- **Password Generator**: Built-in secure password generator

## Installation

1. Install dependencies:
```bash
npm install
```

2. Make sure the backend server is running at `http://localhost:3001`

3. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Runs the test suite
- `npm eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
web-dashboard/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── components/
│   │   ├── Login.js        # Login/Register component
│   │   ├── Dashboard.js    # Main dashboard component
│   │   ├── PasswordCard.js # Password card display
│   │   ├── AddPasswordModal.js  # Add/Edit password modal
│   │   └── PairingModal.js # Device pairing modal
│   ├── App.js              # Main app component
│   ├── App.css             # Global styles
│   └── index.js            # App entry point
└── package.json
```

## API Integration

The dashboard connects to the BioVault backend API at `http://localhost:3001/api` with the following endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/passwords` - Get all passwords
- `GET /api/passwords/:id` - Get specific password
- `POST /api/passwords` - Create new password
- `PUT /api/passwords/:id` - Update password
- `DELETE /api/passwords/:id` - Delete password
- `POST /api/pairing/generate` - Generate pairing code

## Design Features

### Color Scheme
- Primary gradient: #667eea to #764ba2 (purple)
- Background: Clean white and light gray
- Accent colors for categories

### Categories
- Social
- Banking
- Email
- Work
- Shopping
- Entertainment
- Other

### UI Components
- Card-based password display
- Search-first interface
- Category filtering
- Modal dialogs for actions
- QR code for device pairing
- Responsive grid layout

## Security Features

1. **JWT Authentication**: Secure token-based authentication
2. **Password Masking**: Passwords hidden by default
3. **Secure Storage**: Tokens stored in localStorage
4. **HTTPS Ready**: Production-ready security
5. **Password Generator**: Cryptographically secure random passwords
6. **Clipboard Integration**: Secure copy-to-clipboard functionality

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

Built with:
- React 18.2
- Axios for API calls
- qrcode.react for QR code generation
- Create React App for build tooling

## Production Build

To create a production build:

```bash
npm run build
```

This creates an optimized build in the `build/` directory ready for deployment.

## License

ISC
