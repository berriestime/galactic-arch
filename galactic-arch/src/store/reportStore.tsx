import { create } from 'zustand';
import { fetchReport, fetchAggregate } from '../api';
import { ReportParams, AggregateParams } from '../types';

interface ReportState {
  data: any[];
  isLoading: boolean;
  error: string | null;
  params: ReportParams;
  generateReport: (params: ReportParams) => Promise<void>;
  aggregateData: (params: AggregateParams) => Promise<void>;
  clearData: () => void;
}

const useReportStore = create<ReportState>((set) => ({
  data: [],
  isLoading: false,
  error: null,
  params: {},
  generateReport: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetchReport(params);
      set({ data: response, params });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      set({ isLoading: false });
    }
  },
  aggregateData: async (params) => {
    set({ isLoading: true });
    try {
      const response = await fetchAggregate(params);
      set((state) => ({ data: [...state.data, ...response] }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      set({ isLoading: false });
    }
  },
  clearData: () => set({ data: [], params: {}, error: null }),
}));

export { useReportStore}