export interface HistoryRecord {
  id: string;
  fileName: string;
  date: string;
  status: 'success' | 'error';
  error?: string;
  data?: {
    total_spend_galactic: number;
    rows_affected: number;
    less_spent_value: number;
    big_spent_civ: string;
    less_spent_civ: string;
    big_spent_value: number;
    big_spent_at: string;
    average_spend_galactic: number;
  };
}

export type HistoryRecords = HistoryRecord[];
