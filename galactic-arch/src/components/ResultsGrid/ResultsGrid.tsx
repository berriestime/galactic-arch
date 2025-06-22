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
  variant?: 'analytics' | 'history';
};

const ResultsGrid = ({ data, variant = 'analytics' }: ResultsGridProps) => {
  if (!data) {
    return (
      <div className={styles.placeholder}>
        Здесь
        <br /> появятся хайлайты
      </div>
    );
  }

  const gridClass = variant === 'history' ? styles.historyGrid : styles.analyticsGrid;
  const containerClass = variant === 'history' ? styles.historyContainer : styles.analyticsContainer;

  return (
    <div className={`${styles.gridContainer} ${containerClass}`}>
      <div className={`${styles.grid} ${gridClass}`}>
        <ResultCard value={data.total_spend_galactic} label="Общие расходы (галактические кредиты)" variant={variant} />
        <ResultCard value={data.rows_affected} label="Количество обработанных записей" variant={variant} />
        <ResultCard value={data.less_spent_value} label="День года с минимальными расходами" variant={variant} />
        <ResultCard value={data.big_spent_civ} label="Цивилизация с максимальными расходами" variant={variant} />
        <ResultCard value={data.less_spent_civ} label="Цивилизация с минимальными расходами" variant={variant} />
        <ResultCard value={data.big_spent_value} label="День года с максимальными расходами" variant={variant} />
        <ResultCard value={data.big_spent_at} label="Максимальная сумма расходов за день" variant={variant} />
        <ResultCard
          value={data.average_spend_galactic}
          label="Средние расходы (галактические кредиты)"
          variant={variant}
        />
      </div>
    </div>
  );
};

export { ResultsGrid };
