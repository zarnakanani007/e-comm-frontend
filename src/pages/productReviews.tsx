import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../redux/store';
import { fetchProductReviews, addReview } from '../redux/reviewSlice';
import { toast } from 'react-hot-toast';
import axios from 'axios';


const StarRating: React.FC<{ 
  rating: number; 
  onRatingChange?: (rating: number) => void; 
  readonly?: boolean;
}> = ({ rating, onRatingChange, readonly = false }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onRatingChange?.(star)}
          disabled={readonly}
          className={`text-2xl ${readonly ? 'cursor-pointer' : 'cursor-pointer hover:scale-110'} ${
            star <= rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

// Review Item Component
const ReviewItem: React.FC<{ review: any }> = ({ review }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold text-lg">{review.user?.name || 'Anonymous'}</h4>
          <StarRating rating={review.rating} readonly />
        </div>
        <span className="text-sm text-gray-500">
          {new Date(review.createdAt).toLocaleDateString()}
        </span>
      </div>
      <p className="text-gray-700">{review.comment}</p>
    </div>
  );
};

// Review Form Component
const ReviewForm: React.FC<{ productId: string; onReviewAdded: () => void }> = ({ 
  productId, 
  onReviewAdded 
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { token, user } = useSelector((state: RootState) => state.auth);
  // const { error } = useSelector((state: RootState) => state.reviews);
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!user || !token) {
      toast.error('Please login to submit a review');
      navigate('/login');
      return;
    }

    if (!rating) {
      toast.error('Please select a rating');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please write a review');
      return;
    }

    try {
      setLoading(true);
      
      console.log('🔄 Submitting review...', {
        productId,
        rating,
        comment: comment.trim(),
        hasToken: !!token,
        user: user.name
      });
      
       await dispatch(addReview({
        productId,
        rating,
        comment: comment.trim(),
        token
      })).unwrap();

      toast.success('Review added successfully!');
      setRating(0);
      setComment('');
      onReviewAdded();
      
    } catch (error: any) {
      console.error('❌ Review submission error:', error);
      
      if (error.includes('Unauthorized') || error.includes('token') || error.includes('auth')) {
        toast.error('Your session has expired. Please login again.');
        // Redirect to login after a delay
        setTimeout(() => navigate('/login'), 2000);
      } else if (error.includes('already reviewed')) {
        toast.error('You have already reviewed this product');
      } else {
        toast.error(error || 'Failed to add review. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Show login prompt if user is not logged in
  if (!user) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">Write a Review</h3>
        <div className="text-center py-4">
          <p className="text-gray-600 mb-4">Please login to submit a review</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Write a Review</h3>
      <p className="text-sm text-gray-600 mb-4">Logged in as: <strong>{user.name}</strong></p>
      
      <form onSubmit={handleSubmit}>
        {/* Star Rating */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Your Rating *</label>
          <StarRating rating={rating} onRatingChange={setRating} />
          {rating === 0 && (
            <p className="text-red-500 text-sm mt-1">Please select a rating</p>
          )}
        </div>

        {/* Comment */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Your Review *</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !rating || !comment.trim()}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

// Main Product Reviews Page
const ProductReviews: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { reviews, loading, error } = useSelector((state: RootState) => state.reviews);
  // const { user } = useSelector((state: RootState) => state.auth);
  const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0 });

  // Fetch reviews and stats
  const fetchReviews = async () => {
    if (id) {
      try {
        await dispatch(fetchProductReviews(id)).unwrap();
        
        // Fetch stats separately
        const statsResponse = await axios.get(`http://localhost:5000/api/reviews/stats/${id}`);
        setStats(statsResponse.data.stats);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [id, dispatch]);

  if (loading && reviews.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2"
        >
          ← Back to Product
        </button>

        {/* Product Review Header */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h1 className="text-2xl font-bold mb-4">Product Reviews</h1>
          
          {/* Rating Summary */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">
                {stats.averageRating.toFixed(1)}
              </div>
              <StarRating rating={Math.round(stats.averageRating)} readonly />
              <div className="text-sm text-gray-600 mt-1">
                {stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reviews List - 2/3 width */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-4">
              Customer Reviews {reviews.length > 0 && `(${reviews.length})`}
            </h2>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {reviews.length === 0 ? (
              <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow-md">
                <p className="text-lg mb-2">No reviews yet</p>
                <p className="text-sm">Be the first to review this product!</p>
              </div>
            ) : (
              <div>
                {reviews.map((review) => (
                  <ReviewItem key={review._id} review={review} />
                ))}
              </div>
            )}
          </div>

          {/* Review Form - 1/3 width */}
          <div className="lg:col-span-1">
            <ReviewForm productId={id!} onReviewAdded={fetchReviews} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;