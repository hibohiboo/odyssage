import express from 'express';
import { ScenarioController } from '../controllers/scenarioController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();
const scenarioController = new ScenarioController();

// シナリオ関連のルート
router.get('/:id', scenarioController.getScenario.bind(scenarioController));
router.get('/', scenarioController.listScenarios.bind(scenarioController));

// 認証が必要なルート
router.use(authMiddleware);

// シナリオストック関連
router.post('/stock', scenarioController.addToStock.bind(scenarioController));
router.post(
  '/unstock',
  scenarioController.removeFromStock.bind(scenarioController),
);

// その他の既存のルート...

export default router;
