import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import type { IBook, IReview } from '../../types';
import { getBookById } from '../../services/BookService';
import { createReview, getReviewsByBookId } from '../../services/ReviewService';
import ReviewCard from '../../components/ReviewCard';

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useContext(AuthContext);
  const [book, setBook] = useState<IBook | null>(null);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [newReview, setNewReview] = useState({ rating: 1, comment: '' });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!id) return;
    try {
      const bookData = await getBookById(id);
      const reviewData = await getReviewsByBookId(id);
      setBook(bookData);
      setReviews(reviewData);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await createReview({ bookId: id!, userId: user.id, ...newReview });
      setNewReview({ rating: 1, comment: '' });
      fetchData();
    } catch (error) {
      console.error('Lỗi khi thêm review:', error);
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (!book) return <div className="text-center">Book not found</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-4">
        <img src={book.img} alt={book.title} className="w-full md:w-1/3 h-64 object-cover rounded" />
        <div>
          <h1 className="text-3xl font-bold">{book.title}</h1>
          <p className="text-gray-600">Author {book.author}</p>
          <p>Publication Year: {book.publicationYear}</p>
          <p className="text-yellow-500">Rating: {book.ratingTotal.toFixed(1)}</p>
        </div>
      </div>
      <h2 className="text-2xl font-bold mt-6">Reviews</h2>
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} onUpdate={fetchData} />
      ))}
      {user && (
        <form onSubmit={handleReviewSubmit} className="mt-4">
          <div className="mb-2">
            <label className="block">Rating:</label>
            <input
              type="number"
              min="1"
              max="5"
              value={newReview.rating}
              onChange={(e) => setNewReview({ ...newReview, rating: +e.target.value })}
              className="border p-2 rounded w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block">Comment:</label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              className="border p-2 rounded w-full"
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white p-2 rounded">Send Review</button>
        </form>
      )}
    </div>
  );
};

export default BookDetail;