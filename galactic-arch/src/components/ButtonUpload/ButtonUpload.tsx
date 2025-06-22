import styles from './ButtonUpload.module.css';

type ButtonUploadProps = {
  children: React.ReactNode;
  onFileSelect?: (file: File) => void;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  hasFile?: boolean;
  onClose?: () => void;
  isDragging?: boolean;
  status?: 'idle' | 'loading' | 'success' | 'error';
  initialColor?: 'white' | 'green';
};

const ButtonUpload = ({
  children,
  onFileSelect,
  onClick,
  disabled = false,
  hasFile = false,
  className = '',
  onClose,
  isDragging = false,
  status = 'idle',
  initialColor = 'white',
}: ButtonUploadProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileSelect) onFileSelect(file);
  };

  return (
    <div className={`${styles.buttonContainer} ${isDragging ? styles.dragging : ''}`}>
      <label
        className={`
          ${styles.uploadLabel} 
          ${disabled ? styles.disabled : ''} 
          ${hasFile ? styles.hasFile : ''}
          ${status === 'loading' ? styles.loading : ''}
          ${status === 'success' ? styles.success : ''}
          ${status === 'error' ? styles.error : ''}
          ${status === 'idle' && initialColor === 'green' ? styles.initialGreen : ''}
          ${className}
        `}
        onClick={
          onClick
            ? (e) => {
                if (!onFileSelect) {
                  e.preventDefault();
                  onClick();
                }
              }
            : undefined
        }
      >
        {status === 'loading' ? (
          <span className={styles.loader} />
        ) : status === 'success' ? (
          'Done!'
        ) : status === 'error' ? (
          'Ошибка'
        ) : (
          children
        )}
        {onFileSelect && (
          <input
            type="file"
            accept=".csv, text/csv"
            onChange={handleFileChange}
            disabled={disabled || status !== 'idle'}
            className={styles.uploadInput}
          />
        )}
      </label>
      {(status === 'success' || status === 'error' || (!status && !hasFile)) && onClose && (
        <button className={styles.closeButton} onClick={onClose} aria-label="Close"></button>
      )}
    </div>
  );
};

export { ButtonUpload };