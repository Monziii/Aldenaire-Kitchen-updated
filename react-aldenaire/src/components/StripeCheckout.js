import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './StripeCheckout.css';

const StripeCheckout = ({ amount, onSuccess, onCancel, customerName, orderItems }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);



  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }



    setIsProcessing(true);
    setError(null);

    try {
      // إنشاء Payment Intent على الخادم
      const response = await fetch('http://localhost:8000/api/stripe-payment.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Stripe يتعامل بالسنت
          customer_name: customerName,
          items: orderItems
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Confirm payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        data.client_secret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: customerName,
            },
          },
        }
      );

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="stripe-checkout">
      <h3>Payment Details</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Card Information</label>
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
              hidePostalCode: true,
            }}
          />
        </div>
        

        

        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <div className="payment-actions">
          <button
            type="button"
            onClick={onCancel}
            className="cancel-btn"
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="pay-btn"
            disabled={!stripe || isProcessing}
          >
            {isProcessing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StripeCheckout; 