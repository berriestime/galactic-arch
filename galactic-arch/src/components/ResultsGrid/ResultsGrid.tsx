import { ResultCard } from '../ResultCard/ResultCard';
import styles from './ResultsGrid.module.css';

type ResultsGridProps = {
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
};

const ResultsGrid = ({ data }: ResultsGridProps) => {
    if (!data) {
    return (
      <div className={styles.placeholder}>
        Здесь появятся хайлайты
      </div>
    );
  }
  return (
    <div className={styles.gridContainer}>
      <div className={styles.grid}>
        <ResultCard value={data.total_spend_galactic} label="Общие расходы (галактические кредиты)" />
        <ResultCard value={data.rows_affected} label="Количество обработанных записей" />
        <ResultCard value={data.less_spent_value} label="День года с минимальными расходами" />
        <ResultCard value={data.big_spent_civ} label="Цивилизация с максимальными расходами" />
        <ResultCard value={data.less_spent_civ} label="Цивилизация с минимальными расходами" />
        <ResultCard value={data.big_spent_value} label="День года с максимальными расходами" />
        <ResultCard value={data.big_spent_at} label="Максимальная сумма расходов за день" />
        <ResultCard 
          value={data.average_spend_galactic} 
          label="Средние расходы (галактические кредиты)" 
        />
      </div>
    </div>
  );
};

export { ResultsGrid };