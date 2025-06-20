import { useState } from 'react';
import { useGenerateReport } from '../../hooks/useGenerateReport';
import { Button } from '../../components/Button/Button';
import styles from './GeneratorPage.module.css';

const GeneratorPage = (): React.ReactElement => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const { handleGenerate, error } = useGenerateReport();

  const handleClick = async () => {
    setStatus('loading');
    try {
      await handleGenerate();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const handleClose = () => {
    setStatus('idle');
  };

  return (
    <div className="generator-container">
      <div className={styles.description}>
        Сгенерируйте готовый csv-файл нажатием одной кнопки
      </div>
      
      <div className={styles.buttonGroup}>
        <Button 
          onClick={handleClick}
          status={status}
          onClose={handleClose}
        >
          Начать генерацию
        </Button>

        {status === 'loading' && (
          <div className={styles.statusMessage}>идет процесс генерации</div>
        )}
        {status === 'success' && (
          <div className={styles.statusMessage}>файл сгенерирован!</div>
        )}
        {status === 'error' && (
          <div className={styles.errorMessage}>упс, не то...</div>
        )}
      </div>
    </div>
  );
};

export { GeneratorPage };