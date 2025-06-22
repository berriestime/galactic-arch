import type { ReactNode } from 'react';
import styles from './Button.module.css';

type ButtonProps = {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  status?: 'idle' | 'loading' | 'success' | 'error';
  onClose?: () => void;
  disabled2?: boolean;
};

const Button = ({
  children,
  onClick,
  disabled = false,
  status = 'idle',
  onClose,
  disabled2,
}: ButtonProps): React.ReactElement => (
  <div className={styles.buttonContainer}>
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || status !== 'idle'}
      className={`${styles.button} ${styles[status]} ${status === 'clear' ? styles.clear : ''} ${disabled2 ? styles.disabled2 : ''}`}
    >
      {status === 'loading' ? (
        <>
          <span className={styles.loader} />
        </>
      ) : status === 'success' ? (
        'Done!'
      ) : status === 'error' ? (
        'Ошибка'
      ) : (
        children
      )}
    </button>
    {(status === 'success' || status === 'error') && (
      <button className={styles.closeButton} onClick={onClose} aria-label="Close"></button>
    )}
  </div>
);

export { Button };
