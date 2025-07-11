export interface IBook {
     id: string;
     title: string;
     author: string;
     ratingTotal: number;
     img: string;
     publicationYear: number;
   }

   export interface IReview {
     id: string;
     bookId: string;
     userId: string;
     rating: number;
     comment: string;
     date: string;
     user?: { username: string; avatar?: string };
   }

   export interface IUser {
     id: string;
     email: string;
     username: string;
     avatar?: string;
   }