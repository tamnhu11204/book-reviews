import React, { useContext } from 'react';
import type { IReview } from '../types';
import { AuthContext } from '../context/authContext';
import { deleteReview, updateReview } from '../services/ReviewService';

interface ReviewCardProps {
  review: IReview;
  onUpdate: () => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, onUpdate }) => {
  const { user } = useContext(AuthContext);
  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState({ rating: review.rating, comment: review.comment });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateReview(review.id, formData);
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Lỗi khi cập nhật review:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Bạn có chắc muốn xóa review này?')) {
      try {
        await deleteReview(review.id);
        onUpdate();
      } catch (error) {
        console.error('Lỗi khi xóa review:', error);
      }
    }
  };

  return (
    <div className="border rounded-lg p-4 mb-4">
      {isEditing ? (
        <form onSubmit={handleUpdate} className="mb-2">
          <div className="mb-2">
            <label className="block">Rating:</label>
            <input
              type="number"
              min="1"
              max="5"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: +e.target.value })}
              className="border p-2 rounded w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block">Content:</label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              className="border p-2 rounded w-full"
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white p-2 rounded mr-2">Lưu</button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="bg-gray-500 text-white p-2 rounded"
          >
            Cancel
          </button>
        </form>
      ) : (
        <>
          <div className="flex items-center">
            <img
              src={review.user?.avatar || 'https://via.placeholder.com/40'}
              alt={review.user?.username}
              className="w-10 h-10 rounded-full mr-2"
            />
            <p className="font-semibold">{review.user?.username}</p>
          </div>
          <p className="text-yellow-500">Rating: {review.rating}</p>
          <p>{review.comment}</p>
          <p className="text-gray-500 text-sm">{new Date(review.date).toLocaleDateString()}</p>
          {user?.id === review.userId && (
            <div className="mt-2">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-yellow-500 text-white p-2 rounded mr-2"
              >
                Update
              </button>
              <button onClick={handleDelete} className="bg-red-500 text-white p-2 rounded">
                Delete
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReviewCard;