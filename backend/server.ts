// import dotenv from 'dotenv';
// import express, {Request, Response} from 'express';
// import cors from 'cors';
// import mongoose from 'mongoose';
// import routes from './src/routes';

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3001;

// app.use(cors());
// app.use(express.json());

// mongoose.connect(process.env.MONGO_URI as string)
//     .then(() => console.log('Connected to MongoDB'))
//     .catch((error) => console.error('MongoDB connection error: ', error));

// app.use('/api', routes);

// app.get('/', (req: Request, res: Response) => {
//     res.send('Book Review API with MongoDB');
// })

// app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`))