import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MenuCard from '../components/MenuCard';
import Toast from '../components/Toast';
import './Home.css';

const Home = ({ cartCount, addToCart }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  const getMockMenuItems = () => {
    return [
      {
        item_id: 1,
        item_name: "Grilled Chicken Salad",
        price: 12.99,
        image_path: "grilled-chicken-skinless.png",
        avg_rating: 4.5
      },
      {
        item_id: 2,
        item_name: "Fresh Fish with Lemon",
        price: 18.99,
        image_path: "grilled-fish-fresh-salad-lemon.png",
        avg_rating: 4.8
      },
      {
        item_id: 3,
        item_name: "Calamari Delight",
        price: 15.99,
        image_path: "calamari.png",
        avg_rating: 4.3
      },
      {
        item_id: 4,
        item_name: "Chicken Burger",
        price: 11.99,
        image_path: "hd-sapid-chicken-burger-with-french-fries-on-wood-plate-png-701751710858563bp8ufljnki-removebg-preview.png",
        avg_rating: 4.6
      },
      {
        item_id: 5,
        item_name: "Grilled Shrimp",
        price: 22.99,
        image_path: "sherimp.png",
        avg_rating: 4.7
      },
      {
        item_id: 6,
        item_name: "Pasta Primavera",
        price: 14.99,
        image_path: "pngtree-deliciously-vibrant-pasta-dish-with-vegetables-png-image_15824694-removebg-preview.png",
        avg_rating: 4.4
      }
    ];
  };

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/menu.php');
      if (!response.ok) {
        throw new Error('Failed to fetch menu items');
      }
      const data = await response.json();
      setMenuItems(data.menu_items || []);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      // Fallback to mock data if API fails
      setMenuItems(getMockMenuItems());
    }
  };

  useEffect(() => {
    fetchMenuItems();
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

  const handleSearch = (e) => {
    e.preventDefault();
    // For now, we'll just filter the existing items
    // In a real app, you'd send the search query to the API
    console.log('Search query:', searchQuery);
  };

  // Filter items based on search
  const filteredItems = menuItems.filter(item =>
    item.item_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-text">
          <h2>Discover Food Taste<br />Our <span className="highlight">Best</span> Healthy & Tasty.</h2>
          <p>Our restaurant offers a wide range of healthy, flavourful dishes crafted from the freshest ingredients. We focus on providing nutritious meals that cater to various dietary preferences, ensuring every guest enjoys a delicious, guilt-free experience.</p>
          <div className="action-buttons">
            <Link to="/menu" className="view-menu">View Menu</Link>
            <form onSubmit={handleSearch} className="search-bar">
              <input 
                type="text" 
                placeholder="Search" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit">Search</button>
            </form>
          </div>
        </div>
        <div className="hero-image">
          <img src="/assets/images/3.png" alt="Fresh salad with vegetables" />
        </div>
      </section>

      <section className="popular-menu">
        <h3>Our Popular Menu</h3>
        
        <div className="menu-nav">
          <button className="left-arrow">&#8592;</button>
          <Link to="/menu" className="right-arrow">&#8594;</Link>
        </div>
        <br />

        <div className="menu-items">
          {filteredItems.length === 0 ? (
            <p>No items found matching your search.</p>
          ) : (
            filteredItems.slice(0, 6).map(item => (
              <MenuCard 
                key={item.item_id} 
                item={item} 
                onAddToCart={handleAddToCart}
                isProcessing={isProcessing}
              />
            ))
          )}
        </div>
      </section>

      <Toast 
        show={toast.show} 
        message={toast.message} 
        onClose={() => setToast({ show: false, message: '' })} 
      />
    </div>
  );
};

export default Home; 