import React, { useState } from 'react';
import './MenuCard.css';

const MenuCard = ({ item, onAddToCart, isProcessing = false }) => {
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = async () => {
    if (isProcessing || isAdded) return;

    try {
      await onAddToCart(item.item_id);
      setIsAdded(true);
      
      // Reset button after 2 seconds
      setTimeout(() => {
        setIsAdded(false);
      }, 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const renderStars = (rating) => {
    const roundedRating = rating ? Math.round(rating) : 4;
    const stars = '⭐'.repeat(roundedRating);
    const emptyStars = '☆'.repeat(5 - roundedRating);
    return stars + emptyStars;
  };

  // Check if this is the Calamari Delight item
  const isCalamari = item.image_path === 'calamari.png';

  return (
    <div className="menu-card">
      <div className={`card-image ${isCalamari ? 'calamari-image' : ''}`}>
        <img 
          src={"http://localhost/Final_project/assets/images/" + item.image_path}
          alt={item.item_name}
          onError={(e) => {
            e.target.style.display = 'none';
            console.log('Image failed to load:', item.image_path);
          }}
        />
      </div>
      
      <div className="card-content">
        <h4>{item.item_name}</h4>
        
        {item.avg_rating !== undefined && (
          <div className="stars">
            {renderStars(item.avg_rating)}
          </div>
        )}
        
        <p className="price">${parseFloat(item.price).toFixed(2)}</p>
      </div>
      
      <div className="card-actions">
        <button 
          className={`add-to-cart-button ${isAdded ? 'added' : ''} ${isProcessing ? 'processing' : ''}`}
          onClick={handleAddToCart}
          disabled={isProcessing || isAdded}
        >
          {isAdded ? 'Item Added' : 'Add To Cart'}
        </button>
      </div>
    </div>
  );
};

export default MenuCard; 