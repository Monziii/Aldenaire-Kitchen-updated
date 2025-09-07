# Aldenaire Kitchen - React Website

A modern, responsive restaurant website built with React that maintains the original design and functionality while providing a more professional and interactive user experience.

## Features

- **Responsive Design**: Fully responsive design that works on all devices
- **Modern UI**: Clean, professional interface with smooth animations
- **Interactive Menu**: Browse and search through menu items
- **Shopping Cart**: Add items to cart with real-time updates
- **Customer Reviews**: View and submit customer reviews
- **Contact Form**: Easy-to-use contact form for customer inquiries
- **Mobile Navigation**: Optimized mobile navigation experience

## Pages

- **Home**: Hero section with featured menu items and search functionality
- **Menu**: Complete menu with all available dishes
- **About**: Restaurant information and story
- **Reviews**: Customer reviews and rating system
- **Contact**: Contact information and contact form
- **Cart**: Shopping cart with checkout functionality

## Technologies Used

- **React 18**: Modern React with hooks and functional components
- **React Router**: Client-side routing
- **CSS3**: Custom styling with responsive design
- **HTML5**: Semantic HTML structure
- **JavaScript ES6+**: Modern JavaScript features

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd react-aldenaire
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Building for Production

To create a production build:

```bash
npm run build
```

This will create an optimized build in the `build` folder.

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Header.js       # Navigation header
│   ├── Footer.js       # Footer component
│   ├── MenuCard.js     # Menu item card
│   └── Toast.js        # Notification component
├── pages/              # Page components
│   ├── Home.js         # Home page
│   ├── Menu.js         # Menu page
│   ├── About.js        # About page
│   ├── Contact.js      # Contact page
│   ├── Reviews.js      # Reviews page
│   └── Cart.js         # Shopping cart page
├── App.js              # Main app component
├── App.css             # App styles
└── index.css           # Global styles
```

## Features in Detail

### Navigation

- Sticky header with logo and navigation menu
- Mobile-responsive hamburger menu
- Active page highlighting
- Cart count indicator

### Menu System

- Grid layout for menu items
- Search functionality
- Add to cart functionality
- Star ratings display
- Responsive design for all screen sizes

### Shopping Cart

- Add/remove items
- Quantity adjustment
- Real-time total calculation
- Checkout process
- Order summary

### Reviews System

- Display customer reviews
- Submit new reviews
- Star rating system
- Review filtering by dish

### Contact Form

- Contact information display
- Interactive contact form
- Form validation
- Success/error messaging

## Styling

The website uses custom CSS with:

- Flexbox and Grid layouts
- CSS transitions and animations
- Mobile-first responsive design
- Consistent color scheme (orange theme)
- Modern typography with Google Fonts

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Optimized images and assets
- Lazy loading for better performance
- Efficient component rendering
- Minimal bundle size

## Future Enhancements

- Backend API integration
- User authentication
- Online ordering system
- Payment gateway integration
- Admin dashboard
- Real-time order tracking

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Contact

For any questions or support, please contact the development team.

---

**Note**: This is a frontend-only implementation. For full functionality, backend API integration would be required for features like cart persistence, user authentication, and order processing.
