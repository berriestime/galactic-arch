import styles from './ResultCard.module.css';

type ResultCardProps = {
  value: string | number;
  label: string;
};

const ResultCard = ({ value, label }: ResultCardProps) => {
  console.log(value);
  return (
    <div className={styles.card}>
      <div className={styles.value}>{value}</div>
      <div className={styles.label}>{label}</div>
    </div>
  );
};

export { ResultCard };
