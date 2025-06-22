import { useState } from 'react';
import { useGenerateReport } from '../../hooks/useGenerateReport';
// import { Button } from '../../components/Button/Button';
import styles from './GeneratorPage.module.css';
import { ButtonUpload } from '../../components/ButtonUpload/ButtonUpload';

const GeneratorPage = (): React.ReactElement => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const { handleGenerate, error } = useGenerateReport();

  const handleClick = async () => {
    setStatus('loading');
    try {
      await handleGenerate();
      setStatus('success');
    } catch (err) {
      console.error('Ошибка генерации:', err); // Логируем в консоль
      setStatus('error');
    }
  };

  const handleClose = () => {
    setStatus('idle');
  };

  return (
    <div className="generator-container">
      <div className={styles.description}>Сгенерируйте готовый csv-файл нажатием одной кнопки</div>

      <div className={styles.buttonGroup}>
        {/* <Button onClick={handleClick} status={status} onClose={handleClose}>
          Начать генерацию
        </Button>

        {status === 'loading' && <div className={styles.statusMessage}>идет процесс генерации</div>}
        {status === 'success' && <div className={styles.statusMessage}>файл сгенерирован!</div>}
        {status === 'error' && <div className={styles.errorMessage}>упс, не то...</div>} */}
        <ButtonUpload
          isComplete={status === 'success'}
          isLoading={status === 'loading'}
          onClick={handleClick}
          onClose={handleClose}
          status={status}
        >
          Начать генерацию
        </ButtonUpload>
        {status === 'loading' && <div className={styles.statusMessage}>идет процесс генерации</div>}
        {status === 'success' && <div className={styles.statusMessage}>файл сгенерирован!</div>}
        {status === 'error' && <div className={styles.errorMessage}>упс, не то...</div>}
      </div>
    </div>
  );
};

export { GeneratorPage };
