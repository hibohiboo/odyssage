import { Save, X } from 'lucide-react';

interface SceneFormData {
  title: string;
  overview: string;
  order: number;
}

interface SceneFormProps {
  formData: SceneFormData;
  onFormChange: (data: SceneFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isLoading?: boolean;
  submitButtonText: string;
  title: string;
}

export const SceneForm = ({
  formData,
  onFormChange,
  onSubmit,
  onCancel,
  isLoading = false,
  submitButtonText,
  title,
}: SceneFormProps) => (
    <form onSubmit={onSubmit} className="p-4 border border-stone-200 rounded-lg bg-stone-50">
      <h3 className="font-medium text-lg text-amber-800 mb-3">{title}</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            シーンタイトル
          </label>
          <input
            type="text"
            data-testid="scene-title-input"
            value={formData.title}
            onChange={(e) => onFormChange({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="シーンのタイトルを入力"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            シーン概要
          </label>
          <textarea
            data-testid="scene-overview-input"
            value={formData.overview}
            onChange={(e) => onFormChange({ ...formData, overview: e.target.value })}
            className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            rows={3}
            placeholder="シーンの概要を入力"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            シーン順序
          </label>
          <input
            type="number"
            data-testid="scene-order-input"
            value={formData.order}
            onChange={(e) => onFormChange({ ...formData, order: parseInt(e.target.value, 10) || 1 })}
            className="w-24 px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            min="1"
            required
          />
        </div>
      </div>
      
      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary flex items-center"
        >
          <Save className="mr-2 h-4 w-4" />
          {submitButtonText}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary flex items-center"
        >
          <X className="mr-2 h-4 w-4" />
          キャンセル
        </button>
      </div>
    </form>
  );