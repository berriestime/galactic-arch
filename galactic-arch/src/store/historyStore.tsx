import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { HistoryRecord, HistoryRecords } from '../types/history';

type HistoryState = {
  records: HistoryRecords;
  addRecord: (record: Omit<HistoryRecord, 'id'>) => void;
  removeRecord: (id: string) => void;
  clearHistory: () => void;
};

const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      records: [],
      addRecord: (record) =>
        set((state) => ({
          records: [
            ...state.records,
            {
              ...record,
              id: Date.now().toString(),
              date: new Date().toISOString(),
            },
          ],
        })),
      removeRecord: (id) =>
        set((state) => ({
          records: state.records.filter((record) => record.id !== id),
        })),
      clearHistory: () => set({ records: [] }),
    }),
    {
      name: 'parsing-history-storage',
      getStorage: () => localStorage,
    },
  ),
);

export { useHistoryStore };
