import { Router } from "express";
import { createBook, updateBook, deleteBook, getAllBooks, getBookById } from "../controllers/BookController";

const router =Router()

router.post('/create', createBook)
router.put('/update/:id', updateBook)
router.delete('/delete/:id', deleteBook)
router.get('/get-all', getAllBooks)
router.get('/get-detail', getBookById)

export default router;