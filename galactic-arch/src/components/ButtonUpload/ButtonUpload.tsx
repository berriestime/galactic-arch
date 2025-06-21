import styles from './ButtonUpload.module.css';

type ButtonUploadProps = {
  children: React.ReactNode;
  onFileSelect: (file: File) => void;
  disabled?: boolean;
  className?: string;
  hasFile?: boolean;
};

const ButtonUpload = ({ 
  children, 
  onFileSelect, 
  disabled = false,
  hasFile = false,
  className = ''
}: ButtonUploadProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <label className={`
      ${styles.uploadLabel} 
      ${disabled ? styles.disabled : ''} 
      ${hasFile ? styles.hasFile : ''}
      ${className}
    `}>
      {children}
      <input
        type="file"
        accept=".csv, text/csv"
        onChange={handleFileChange}
        disabled={disabled}
        className={styles.uploadInput}
      />
    </label>
  );
};

export { ButtonUpload }