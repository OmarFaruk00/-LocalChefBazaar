import { Router } from 'express';
import { authController } from '../controllers/authController';
import { userController } from '../controllers/userController';
import { requestController } from '../controllers/requestController';
import { mealController } from '../controllers/mealController';
import { reviewController } from '../controllers/reviewController';
import { favoriteController } from '../controllers/favoriteController';
import { orderController } from '../controllers/orderController';
import { paymentController } from '../controllers/paymentController';
import { statsController } from '../controllers/statsController';
import { forbidFraud, requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// Auth
router.post('/auth/login', authController.login);
router.get('/auth/me', requireAuth, authController.me);
router.post('/auth/logout', requireAuth, authController.logout);

// Users
router.get('/users', requireAuth, requireRole(['admin']), userController.list);
router.patch('/users/:id/fraud', requireAuth, requireRole(['admin']), userController.makeFraud);

// Requests
router.post('/requests', requireAuth, requestController.create);
router.get('/requests', requireAuth, requireRole(['admin']), requestController.list);
router.patch('/requests/:id', requireAuth, requireRole(['admin']), requestController.updateStatus);

// Meals
router.get('/meals', mealController.list);
router.get('/meals/:id', requireAuth, mealController.byId);
router.post('/meals', requireAuth, forbidFraud, requireRole(['chef']), mealController.create);
router.put('/meals/:id', requireAuth, requireRole(['chef']), mealController.update);
router.delete('/meals/:id', requireAuth, requireRole(['chef']), mealController.remove);
router.get('/meals/mine', requireAuth, requireRole(['chef']), mealController.myMeals);

// Reviews
router.get('/reviews/:mealId', reviewController.listByMeal);
router.post('/reviews/:mealId', requireAuth, reviewController.create);
router.put('/reviews/item/:id', requireAuth, reviewController.update);
router.delete('/reviews/item/:id', requireAuth, reviewController.remove);
router.get('/reviews', requireAuth, reviewController.myReviews);

// Favorites
router.get('/favorites', requireAuth, favoriteController.list);
router.post('/favorites', requireAuth, favoriteController.add);
router.delete('/favorites/:id', requireAuth, favoriteController.remove);

// Orders
router.post('/orders', requireAuth, forbidFraud, orderController.create);
router.get('/orders', requireAuth, orderController.myOrders);
router.get('/orders/chef', requireAuth, requireRole(['chef']), orderController.chefOrders);
router.patch('/orders/:id/status', requireAuth, requireRole(['chef']), orderController.updateStatus);

// Payments
router.post('/payments/checkout', requireAuth, paymentController.checkout);
router.post('/payments/success', paymentController.success);

// Stats
router.get('/stats/platform', requireAuth, requireRole(['admin']), statsController.platform);

export default router;




