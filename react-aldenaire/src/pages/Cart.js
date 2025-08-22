import React, { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { api } from '../utils/api';
import StripeCheckout from '../components/StripeCheckout';
import stripePromise from '../utils/stripe';
import './Cart.css';

const Cart = ({ cartItems, removeFromCart, updateCartItemQuantity, clearCart }) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutStatus, setCheckoutStatus] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [customerName, setCustomerName] = useState('');
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });

  const updateQuantity = (itemId, newQuantity) => {
    updateCartItemQuantity(itemId, newQuantity);
  };

  const handleCheckout = () => {
    setShowPaymentForm(true);
  };

  const handlePayment = async () => {
    if (!customerName.trim()) {
      alert('Please enter your name');
      return;
    }

    if (paymentMethod === 'stripe') {
      setShowPaymentForm(true);
      return;
    }

    // Cash payment
    setIsCheckingOut(true);
    try {
      const orderData = {
        customer_name: customerName.trim(),
        items: cartItems.map(item => ({
          item_id: item.item_id,
          item_name: item.item_name,
          quantity: item.quantity,
          price: item.price
        })),
        total_amount: calculateTotal() * 1.08,
        payment_method: paymentMethod
      };

      // Try to save to database first
      try {
        const data = await api.submitOrder(orderData);
        console.log('Order saved to database:', data);
      } catch (apiError) {
        console.error('API Error:', apiError);
        // Continue with mock payment if API fails
        console.log('Continuing with mock payment...');
      }

      // Simulate payment process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setCheckoutStatus('success');
      clearCart();
      setShowPaymentForm(false);
      setCustomerName('');
    } catch (error) {
      console.error('Error during payment:', error);
      setCheckoutStatus('error');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleStripeSuccess = async (paymentIntent) => {
    try {
      const orderData = {
        customer_name: customerName.trim(),
        items: cartItems.map(item => ({
          item_id: item.item_id,
          item_name: item.item_name,
          quantity: item.quantity,
          price: item.price
        })),
        total_amount: calculateTotal() * 1.08,
        payment_method: 'stripe',
        stripe_payment_id: paymentIntent.id
      };

      // حفظ الطلب في قاعدة البيانات
      await api.submitOrder(orderData);
      
      setCheckoutStatus('success');
      clearCart();
      setShowPaymentForm(false);
      setCustomerName('');
    } catch (error) {
      console.error('Error saving order:', error);
      setCheckoutStatus('error');
    }
  };

  const handleStripeCancel = () => {
    setShowPaymentForm(false);
    setPaymentMethod('cash');
  };

  const handlePaymentDataChange = (field, value) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className="cart-page">
      <section className="cart-section">
        <h1>My Orders</h1>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <h2>Your cart is empty</h2>
            <p>Add some delicious items to your cart to get started!</p>
            <a href="/menu" className="view-menu-btn">View Menu</a>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              <h2>Cart Items ({cartItems.length})</h2>
              {cartItems.map(item => (
                <div key={item.item_id} className="cart-item">
                  <div className="item-image">
                    <img src={"http://localhost/Final_project/assets/images/" + item.image_path} alt={item.item_name} />
                  </div>
                  <div className="item-details">
                    <h3>{item.item_name}</h3>
                    <p className="item-price">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="item-quantity">
                    <button 
                      onClick={() => updateQuantity(item.item_id, item.quantity - 1)}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.item_id, item.quantity + 1)}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                  <div className="item-total">
                    <p>${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.item_id)}
                    className="remove-btn"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2>Order Summary</h2>
              <div className="summary-item">
                <span>Subtotal:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              <div className="summary-item">
                <span>Tax:</span>
                <span>${(calculateTotal() * 0.08).toFixed(2)}</span>
              </div>
              <div className="summary-item total">
                <span>Total:</span>
                <span>${(calculateTotal() * 1.08).toFixed(2)}</span>
              </div>

              <button 
                onClick={handleCheckout}
                className="checkout-btn"
                disabled={isCheckingOut}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}

        {showPaymentForm && (
          <div className="payment-form">
            <h2>Payment Information</h2>
            
            <div className="form-group">
              <label>Your Name *</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            </div>

            <div className="payment-method">
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Cash on Delivery
              </label>
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="stripe"
                  checked={paymentMethod === 'stripe'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Credit/Debit Card <span className="stripe-box">Stripe</span>
              </label>
            </div>

            {paymentMethod === 'card' && (
              <div className="card-details">
                <div className="form-group">
                  <label>Card Number:</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={paymentData.cardNumber}
                    onChange={(e) => handlePaymentDataChange('cardNumber', e.target.value)}
                    maxLength="19"
                  />
                </div>
                <div className="form-group">
                  <label>Card Holder Name:</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={paymentData.cardHolder}
                    onChange={(e) => handlePaymentDataChange('cardHolder', e.target.value)}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date:</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={paymentData.expiryDate}
                      onChange={(e) => handlePaymentDataChange('expiryDate', e.target.value)}
                      maxLength="5"
                    />
                  </div>
                  <div className="form-group">
                    <label>CVV:</label>
                    <input
                      type="text"
                      placeholder="123"
                      value={paymentData.cvv}
                      onChange={(e) => handlePaymentDataChange('cvv', e.target.value)}
                      maxLength="4"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'stripe' ? (
              <Elements stripe={stripePromise}>
                <StripeCheckout
                  amount={calculateTotal() * 1.08}
                  onSuccess={handleStripeSuccess}
                  onCancel={handleStripeCancel}
                  customerName={customerName}
                  orderItems={cartItems}
                />
              </Elements>
            ) : (
              <div className="payment-actions">
                <button 
                  onClick={() => setShowPaymentForm(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button 
                  onClick={handlePayment}
                  className="pay-btn"
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? 'Processing Payment...' : 'Pay Now'}
                </button>
              </div>
            )}
          </div>
        )}

        {checkoutStatus === 'success' && (
          <div className="success-message">
            <h2>Payment Successful!</h2>
            <p>Your order has been placed successfully. Thank you for your order!</p>
            <p>Order Total: ${(calculateTotal() * 1.08).toFixed(2)}</p>
          </div>
        )}

        {checkoutStatus === 'error' && (
          <div className="error-message">
            <h2>Payment Failed</h2>
            <p>There was an error processing your payment. Please try again.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Cart; 