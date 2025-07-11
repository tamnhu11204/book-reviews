import React from 'react';
import { Link } from 'react-router-dom';
import type { IBook } from '../types';

interface BookCardProps {
  book: IBook;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  return (
    <Link to={`/book/${book.id}`} className="border rounded-lg p-4 shadow hover:shadow-lg">
      <img src={book.img} alt={book.title} className="w-full h-48 object-cover rounded" />
      <h3 className="text-lg font-semibold mt-2">{book.title}</h3>
      <p className="text-gray-600">{book.author}</p>
      <p className="text-yellow-500">Rating: {book.ratingTotal.toFixed(1)}</p>
    </Link>
  );
};

export default BookCard;