import { create } from 'zustand';

interface HistoryItem {
  id: string;
  timestamp: number;
  params: any;
  dataPreview: any;
}

interface HistoryState {
  items: HistoryItem[];
  addItem: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
  removeItem: (id: string) => void;
  clearHistory: () => void;
}

const useHistoryStore = create<HistoryState>((set) => ({
  items: JSON.parse(localStorage.getItem('report-history') || '[]'),
  addItem: (item) => 
    set((state) => {
      const newItem = {
        ...item,
        id: Math.random().toString(36).substring(2, 9),
        timestamp: Date.now(),
      };
      const newItems = [newItem, ...state.items].slice(0, 50); // Limit to 50 items
      localStorage.setItem('report-history', JSON.stringify(newItems));
      return { items: newItems };
    }),
  removeItem: (id) => 
    set((state) => {
      const newItems = state.items.filter(item => item.id !== id);
      localStorage.setItem('report-history', JSON.stringify(newItems));
      return { items: newItems };
    }),
  clearHistory: () => {
    localStorage.removeItem('report-history');
    set({ items: [] });
  },
}));

export { useHistoryStore }