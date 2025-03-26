import { Request, Response } from 'express';
import { ScenarioService } from '../services/scenarioService';

export class ScenarioController {
  private scenarioService = new ScenarioService();

  // シナリオをストックに追加する
  async addToStock(req: Request, res: Response): Promise<void> {
    try {
      const { scenarioId } = req.body;
      const userId = req.user?.id; // 認証済みユーザーのID

      if (!userId) {
        res.status(401).json({ error: '認証が必要です' });
        return;
      }

      if (!scenarioId) {
        res.status(400).json({ error: 'シナリオIDが必要です' });
        return;
      }

      await this.scenarioService.addScenarioToStock(scenarioId, userId);
      res
        .status(200)
        .json({ success: true, message: 'シナリオをストックに追加しました' });
    } catch (error) {
      console.error('シナリオのストック追加に失敗:', error);
      res.status(500).json({ error: 'シナリオのストックに失敗しました' });
    }
  }

  // シナリオをストックから削除する
  async removeFromStock(req: Request, res: Response): Promise<void> {
    try {
      const { scenarioId } = req.body;
      const userId = req.user?.id; // 認証済みユーザーのID

      if (!userId) {
        res.status(401).json({ error: '認証が必要です' });
        return;
      }

      if (!scenarioId) {
        res.status(400).json({ error: 'シナリオIDが必要です' });
        return;
      }

      await this.scenarioService.removeScenarioFromStock(scenarioId, userId);
      res
        .status(200)
        .json({ success: true, message: 'シナリオをストックから削除しました' });
    } catch (error) {
      console.error('シナリオのストック削除に失敗:', error);
      res.status(500).json({ error: 'シナリオのストック削除に失敗しました' });
    }
  }

  // その他の既存のコントローラーメソッド...
}
