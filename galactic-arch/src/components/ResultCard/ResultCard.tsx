import styles from './ResultCard.module.css';

type ResultCardProps = {
  value: string | number;
  label: string;
  variant?: 'analytics' | 'history';
};

const ResultCard = ({ value, label, variant = 'analytics' }: ResultCardProps) => {
  return (
    <div className={`${styles.card} ${styles[variant]}`}>
      <div className={styles.value}>{value}</div>
      <div className={styles.label}>{label}</div>
    </div>
  );
};

export { ResultCard };
