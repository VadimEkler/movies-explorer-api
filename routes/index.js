const router = require('express').Router();
const signupRoutes = require('./signup');
const signinRoutes = require('./signin');
const auth = require('../middlewares/auth');
const userRoutes = require('./users');
const moviesRoutes = require('./movies');
const NotFoundError = require('../errors/NotFoundError');

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.use('/signup', signupRoutes);
router.use('/signin', signinRoutes);
router.use(auth);
router.use('/users', userRoutes);
router.use('/movies', moviesRoutes);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена!'));
});

module.exports = router;
