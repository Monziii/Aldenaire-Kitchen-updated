import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';
import './Reviews.css';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [apiAvailable, setApiAvailable] = useState(true);
  const [error, setError] = useState(null);
  
  const [newReview, setNewReview] = useState({
    customer_name: '',
    rating: 5,
    comment: ''
  });

  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await api.getReviews();
      console.log('Reviews data received:', data);
      if (data.success) {
        setReviews(data.reviews || []);
        setApiAvailable(true);
      } else {
        setError(data.error || 'Failed to fetch reviews');
        setReviews([]);
        setApiAvailable(false);
      }
    } catch (error) {
      setError('Failed to load reviews. Please try again.');
      setReviews([]);
      setApiAvailable(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleChange = (e) => {
    setNewReview({
      ...newReview,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      if (!apiAvailable) {
        setSubmitStatus('error');
        setIsSubmitting(false);
        return;
      }
      const data = await api.submitReview(newReview);
      if (data.success) {
        setReviews(prevReviews => [data.review, ...prevReviews]);
        setNewReview({ customer_name: '', rating: 5, comment: '' });
        setSubmitStatus('success');
      } else {
        throw new Error(data.error || 'Failed to submit review');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (isLoading) {
    return (
      <div className="reviews-page">
        <section className="reviews-section">
          <h1>Customer Reviews</h1>
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading reviews...</p>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reviews-page">
        <section className="reviews-section">
          <h1>Customer Reviews</h1>
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button onClick={fetchReviews} className="retry-button">
              🔄 Try Again
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="reviews-page">
      <section className="reviews-section">
        <h1>Customer Reviews</h1>
        <p>See what our customers are saying about our delicious dishes!</p>

        {!apiAvailable && !error && (
          <div className="api-warning">
            <p>⚠️ API is not available. Please try again later.</p>
          </div>
        )}

        <div className="reviews-content">
          <div className="reviews-list">
            <h2>Recent Reviews</h2>
            {reviews.length > 0 ? (
              <div className="reviews-grid">
                {reviews.map(review => (
                  <div key={review.id} className="review-card">
                    <div className="review-header">
                      <h3>Customer Review</h3>
                      <div className="stars">{renderStars(review.rating)}</div>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                    <div className="review-footer">
                      <span className="customer-name">- {review.customer_name}</span>
                      <span className="review-date">{new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No reviews yet. Be the first to leave a review!</p>
            )}
          </div>

          <div className="review-form">
            <h2>Leave a Review</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="customer_name">Your Name:</label>
                <input
                  type="text"
                  id="customer_name"
                  name="customer_name"
                  value={newReview.customer_name}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="rating">Rating:</label>
                <select
                  id="rating"
                  name="rating"
                  value={newReview.rating}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >
                  <option value="5">⭐⭐⭐⭐⭐ (5 stars)</option>
                  <option value="4">⭐⭐⭐⭐☆ (4 stars)</option>
                  <option value="3">⭐⭐⭐☆☆ (3 stars)</option>
                  <option value="2">⭐⭐☆☆☆ (2 stars)</option>
                  <option value="1">⭐☆☆☆☆ (1 star)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="comment">Your Review:</label>
                <textarea
                  id="comment"
                  name="comment"
                  value={newReview.comment}
                  onChange={handleChange}
                  required
                  rows="4"
                  disabled={isSubmitting}
                  placeholder="Tell us about your experience..."
                />
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>

              {submitStatus === 'success' && (
                <div className="success-message">
                  ✅ Review submitted successfully!
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="error-message">
                  ❌ Failed to submit review. Please try again.
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Reviews; 