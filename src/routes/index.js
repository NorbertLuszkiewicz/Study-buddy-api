import { Router } from 'express';
import {
  getStudents,
  getStudent,
  addStudent,
  removeStudentClass,
} from '../controllers/students.js';
import { login, register, getUser } from '../controllers/auth.js';
import { getArticles, addArticle } from '../controllers/articles.js';
import { addMessage, getMessages } from '../controllers/message.js';
import { getTeacher } from '../controllers/teacher.js';
import { authMiddleware } from '../middleware/auth-middleware.js';
import {
  addExam,
  addGrade,
  createSubject,
  getSubjects,
  removeSubject,
} from '../controllers/subjects.js';
import { addClass, createClass, getClasses } from '../controllers/class.js';
import { addNote, removeNote } from '../controllers/note.js';

export const router = Router();

router.put('/login', login);
router.post('/register', register);
router.put('/me', authMiddleware, getUser);

router.get('/articles', authMiddleware, getArticles);
router.post('/articles', authMiddleware, addArticle);

router.get('/classes', authMiddleware, getClasses);
router.put('/class:id', authMiddleware, addClass);
router.post('/class', authMiddleware, createClass);

router.get('/messages', authMiddleware, getMessages);
router.post('/message', authMiddleware, addMessage);

router.get('/students', authMiddleware, getStudents);
router.post('/student', authMiddleware, addStudent);
router.put('/student', authMiddleware, removeStudentClass);
router.get('/student', authMiddleware, getStudent);

router.get('/subjects', authMiddleware, getSubjects);
router.post('/subject', authMiddleware, createSubject);
router.put('/subject', authMiddleware, removeSubject);
router.put('/exam', authMiddleware, addExam);
router.post('/grade', authMiddleware, addGrade);

router.post('/note', authMiddleware, addNote);
router.put('/note', authMiddleware, removeNote);

router.get('/teacher', authMiddleware, getTeacher);

export default router;
