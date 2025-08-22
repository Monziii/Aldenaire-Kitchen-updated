import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import About from './pages/About';
import Contact from './pages/Contact';
import Reviews from './pages/Reviews';
import Cart from './pages/Cart';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

function App() {
  // Check if localStorage is available
  const isLocalStorageAvailable = () => {
    try {
      const test = 'test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Load cart from localStorage on mount with better error handling
  const getInitialCart = () => {
    if (!isLocalStorageAvailable()) {
      console.warn('localStorage is not available, using empty cart');
      return [];
    }
    
    try {
      const items = JSON.parse(localStorage.getItem('cartItems')) || [];
      // Validate the data structure
      if (!Array.isArray(items)) {
        console.warn('Invalid cart data in localStorage, resetting to empty array');
        return [];
      }
      return items;
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  };

  const getInitialCartCount = () => {
    if (!isLocalStorageAvailable()) {
      return 0;
    }
    
    try {
      const count = parseInt(localStorage.getItem('cartCount'), 10) || 0;
      return Math.max(0, count); // Ensure non-negative
    } catch (error) {
      console.error('Error loading cart count from localStorage:', error);
      return 0;
    }
  };

  const [cartItems, setCartItems] = useState(getInitialCart);
  const [cartCount, setCartCount] = useState(getInitialCartCount);

  const addToCart = (item) => {
    if (!item || !item.item_id) {
      console.error('Invalid item data:', item);
      return;
    }

    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.item_id === item.item_id);
      
      if (existingItem) {
        // Item already exists, increase quantity
        return prevItems.map(cartItem => 
          cartItem.item_id === item.item_id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        // Add new item
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
    
    // Update cart count
    setCartCount(prevCount => prevCount + 1);
  };

  const updateCartItemQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }

    setCartItems(prevItems => {
      return prevItems.map(cartItem => 
        cartItem.item_id === itemId 
          ? { ...cartItem, quantity: newQuantity }
          : cartItem
      );
    });

    // Update cart count based on total items
    setCartItems(prevItems => {
      const newTotalItems = prevItems.reduce((total, item) => {
        if (item.item_id === itemId) {
          return total + newQuantity;
        }
        return total + item.quantity;
      }, 0);
      setCartCount(newTotalItems);
      return prevItems;
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems(prevItems => {
      const item = prevItems.find(cartItem => cartItem.item_id === itemId);
      if (item && item.quantity > 1) {
        // Decrease quantity
        return prevItems.map(cartItem => 
          cartItem.item_id === itemId 
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
      } else {
        // Remove item completely
        return prevItems.filter(cartItem => cartItem.item_id !== itemId);
      }
    });
    
    // Update cart count
    setCartCount(prevCount => Math.max(0, prevCount - 1));
  };

  const clearCart = () => {
    setCartItems([]);
    setCartCount(0);
  };

  // Save cart to localStorage whenever cartItems or cartCount changes
  useEffect(() => {
    if (!isLocalStorageAvailable()) {
      console.warn('localStorage not available, cannot save cart data');
      return;
    }

    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      localStorage.setItem('cartCount', cartCount.toString());
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems, cartCount]);

  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Header cartCount={cartCount} />
          <main>
            <Routes>
              <Route path="/" element={<Home cartCount={cartCount} addToCart={addToCart} />} />
              <Route path="/home" element={<Navigate to="/" replace />} />
              <Route path="/menu" element={<Menu cartCount={cartCount} addToCart={addToCart} />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/cart" element={<Cart cartItems={cartItems} removeFromCart={removeFromCart} updateCartItemQuantity={updateCartItemQuantity} clearCart={clearCart} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
