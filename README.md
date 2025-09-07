# Aldenaire Kitchen - Restaurant Website

A modern restaurant website built with React frontend and PHP backend, served through XAMPP.

## 🚀 Features

- **Modern React Frontend**: Built with React 19 and React Router
- **PHP Backend API**: RESTful API endpoints for menu, reviews, orders, and contact
- **MySQL Database**: Local database using XAMPP
- **Responsive Design**: Mobile-first responsive design
- **CORS Optimized**: Proper CORS configuration for cross-origin requests
- **Production Ready**: Optimized build served through Apache

## 🛠️ Technology Stack

- **Frontend**: React 19, React Router DOM, CSS3
- **Backend**: PHP 8.1, MySQL
- **Server**: Apache (XAMPP)
- **Database**: MySQL (XAMPP)

## 📁 Project Structure

```
Final_project/
├── api/                    # PHP API endpoints
│   ├── menu.php           # Menu items API
│   ├── reviews.php        # Reviews API
│   ├── orders.php         # Orders API
│   ├── contact.php        # Contact form API
│   └── config.php         # API configuration
├── react-aldenaire/       # React development files
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # React pages
│   │   └── utils/         # Utility functions
│   └── package.json
├── static/                # Production build files
├── assets/                # Images and static assets
├── includes/              # PHP includes
├── .htaccess             # Apache configuration
└── index.html            # Main entry point
```

## 🚀 Quick Start

### Prerequisites

1. **XAMPP**: Install XAMPP for macOS
2. **Node.js**: Install Node.js (v16 or higher)
3. **MySQL**: Use XAMPP's MySQL server

### Installation

1. **Stop local MySQL service** (if running):

   ```bash
   brew services stop mysql
   ```

2. **Start XAMPP**:

   - Open XAMPP Control Panel
   - Start Apache and MySQL services

3. **Install React dependencies**:

   ```bash
   cd react-aldenaire
   npm install
   ```

4. **Build React app for production**:

   ```bash
   npm run build
   ```

5. **Copy build files**:

   ```bash
   cd ..
   cp -r react-aldenaire/build/* .
   ```

6. **Access the application**:
   - Open browser and go to: `http://localhost/Final_project`

## 🔧 Development

### Running in Development Mode

```bash
cd react-aldenaire
npm start
```

This will start the React development server on `http://localhost:3000`

### Building for Production

```bash
cd react-aldenaire
npm run build
cp -r build/* ..
```

## 🌐 API Endpoints

### Menu API

- **GET** `/api/menu.php` - Get all menu items

### Reviews API

- **GET** `/api/reviews.php` - Get all reviews
- **POST** `/api/reviews.php` - Submit a new review

### Orders API

- **POST** `/api/orders.php` - Submit a new order

### Contact API

- **POST** `/api/contact.php` - Submit contact form

## 🔒 CORS Configuration

The application includes comprehensive CORS configuration supporting:

- Development: `http://localhost:3000`
- Production: `http://localhost/Final_project`
- Future domains: `https://aldenaire.com`

## 📱 Responsive Design

The website is fully responsive and optimized for:

- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🎨 UI/UX Features

- Modern, clean design
- Smooth animations and transitions
- Toast notifications
- Loading states
- Error handling
- Search functionality
- Shopping cart system

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure XAMPP is running and CORS headers are properly configured
2. **Database Connection**: Verify MySQL is running in XAMPP
3. **Build Issues**: Clear build cache and rebuild
4. **Port Conflicts**: Stop other MySQL services before starting XAMPP

### Debug Mode

Enable debug mode in `config.php`:

```php
define('DEBUG_MODE', true);
```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions, please contact the development team.

---

**Built with ❤️ for Aldenaire Kitchen**
