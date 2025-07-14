import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import type { IReview, IUser } from '../../types';
import { getReviewByUserId } from '../../services/ReviewService';

const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, logout } = useContext(AuthContext);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    email: user?.email || '',
    username: user?.username || '',
    avatar: user?.avatar || '',
    password: '',
  });
  const [error, setError] = useState('');

  const isOwnProfile = user?.id === id;

  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return;
      try {
        const reviewData = await getReviewByUserId(id);
        setReviews(reviewData);
      } catch (err) {
        console.error('Lỗi khi lấy review:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !isOwnProfile) return;
    try {
      const updateData: Partial<IUser> = {
        email: formData.email,
        username: formData.username,
        avatar: formData.avatar || undefined,
      };
      if (formData.password) {
        updateData.password = formData.password;
      }
      const updatedUser = await update(id, updateData);
      if (updatedUser) {
        setFormData({
          email: updatedUser.email,
          username: updatedUser.username,
          avatar: updatedUser.avatar || '',
          password: '',
        });
        setEditMode(false);
        window.location.reload();
      } else {
        setError('Cập nhật thông tin thất bại');
      }
    } catch (err: any) {
      setError(err.message || 'Cập nhật thông tin thất bại');
    }
  };

  if (!user || !isOwnProfile) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>Vui lòng <Link to="/login" className="text-blue-600">đăng nhập</Link> để xem trang cá nhân.</p>
      </div>
    );
  }

  if (loading) return <div className="text-center">Đang tải...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Trang cá nhân</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="border rounded-lg p-4 mb-4">
        <h2 className="text-xl font-semibold">Thông tin người dùng</h2>
        {editMode ? (
          <form onSubmit={handleUpdate} className="mt-4">
            <div className="mb-4">
              <label className="block">Email:</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block">Tên người dùng:</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block">Avatar URL (tùy chọn):</label>
              <input
                type="text"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block">Mật khẩu mới (tùy chọn):</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="border p-2 rounded w-full"
              />
            </div>
            <button type="submit" className="bg-blue-600 text-white p-2 rounded mr-2">Lưu</button>
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="bg-gray-500 text-white p-2 rounded"
            >
              Hủy
            </button>
          </form>
        ) : (
          <div className="mt-4">
            <div className="flex items-center">
              <img
                src={user.avatar || 'https://via.placeholder.com/80'}
                alt={user.username}
                className="w-20 h-20 rounded-full mr-4"
              />
              <div>
                <p><strong>Tên người dùng:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
              </div>
            </div>
            <button
              onClick={() => setEditMode(true)}
              className="mt-4 bg-yellow-500 text-white p-2 rounded"
            >
              Chỉnh sửa thông tin
            </button>
            <button
              onClick={logout}
              className="mt-4 ml-2 bg-red-500 text-white p-2 rounded"
            >
              Đăng xuất
            </button>
          </div>
        )}
      </div>
      <h2 className="text-2xl font-bold mt-6">Danh sách đánh giá</h2>
      {reviews.length === 0 ? (
        <p>Chưa có đánh giá nào.</p>
      ) : (
        reviews.map((review) => (
          <ReviewCard key={review.id} review={review} onUpdate={() => getReviewsByUserId(id!).then(setReviews)} />
        ))
      )}
    </div>
  );
};

export default UserProfile;