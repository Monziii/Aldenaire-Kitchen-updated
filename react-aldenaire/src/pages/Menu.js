import React, { useState, useEffect } from 'react';
import MenuCard from '../components/MenuCard';
import Toast from '../components/Toast';
import { api } from '../utils/api';
import './Menu.css';

const Menu = ({ cartCount, addToCart }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });



  const fetchAllMenuItems = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching menu items from API...');
      const data = await api.getMenuItems();
      console.log('Menu data received:', data);
      
      if (data.success) {
        setMenuItems(data.menu_items || []);
      } else {
        setError(data.error || 'Failed to fetch menu items');
        setMenuItems([]);
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
      setError('Failed to load menu items. Please try again.');
      setMenuItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllMenuItems();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddToCart = async (itemId) => {
    setIsProcessing(true);
    try {
      const item = menuItems.find(menuItem => menuItem.item_id === itemId);
      if (item) {
        // Make sure to pass all required properties
        addToCart({
          item_id: item.item_id,
          item_name: item.item_name,
          image_path: item.image_path,
          price: parseFloat(item.price),
          quantity: 1
        });
        setToast({ show: true, message: '✅ Item added to cart!' });
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      setToast({ show: true, message: '❌ Error adding item. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="menu-page">
      <section className="menu-section">
        <h1>Our Menu</h1>
        
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading menu items...</p>
          </div>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : menuItems.length > 0 ? (
          <div className="menu-items">
            {menuItems.map(item => (
              <MenuCard 
                key={item.item_id} 
                item={item} 
                onAddToCart={handleAddToCart}
                isProcessing={isProcessing}
              />
            ))}
          </div>
        ) : (
          <p>No menu items found.</p>
        )}
      </section>

      <Toast 
        show={toast.show} 
        message={toast.message} 
        onClose={() => setToast({ show: false, message: '' })} 
      />
    </div>
  );
};

export default Menu; 