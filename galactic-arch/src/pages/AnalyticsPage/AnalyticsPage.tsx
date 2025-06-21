import { useCallback, useState, useRef, useMemo } from 'react';
import { ButtonUpload } from '../../components/ButtonUpload/ButtonUpload';
import styles from './AnalyticsPage.module.css';
import { fetchAggregate } from '../../api/aggregate';
import { Button } from '../../components/Button/Button';

const AnalyticsPage = (): React.ReactElement => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any[]>([]);
  const resultRef = useRef<any[]>([]);
  const [partialResults, setPartialResults] = useState<any[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = useCallback((file: File) => {
    if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
      setSelectedFile(file);
      setError(null);
      setResult([]);
      resultRef.current = [];
      setPartialResults([]);
    } else {
      setError('Пожалуйста, выберите CSV файл');
    }
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (isLoading) return;

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [isLoading, handleFileSelect],
  );

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError('Пожалуйста, выберите файл');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult([]);
    resultRef.current = [];
    setPartialResults([]);

    try {
      const aggregationResult = await fetchAggregate(10000, selectedFile, (chunk) => {
        resultRef.current = [...resultRef.current, chunk];
        setPartialResults((prev) => [...prev, chunk]);
      });

      setResult(aggregationResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
      console.error('Ошибка агрегации:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderResults = () => {
    const dataToRender = partialResults.length > 0 ? partialResults : result;
    if (dataToRender.length === 0) return null;

    return (
      <div className={styles.result}>
        <h3>Результаты агрегации:</h3>
        <div className={styles.resultContainer}>
          {dataToRender.map((item, index) => (
            <div key={index} className={styles.resultItem}>
              <pre>{JSON.stringify(item, null, 2)}</pre>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const uploadAreaClass = useMemo(() => {
    return `${styles.backgroundUpload} ${isDragging ? styles.dragging : ''} ${isLoading ? styles.disabled : ''} ${selectedFile ? styles.dragged : ''}`;
  }, [isDragging, isLoading]);

  return (
    <div>
      <div className={styles.description}>
        Загрузите <span className={styles.descriptionAccent}>csv</span> файл и получите{' '}
        <span className={styles.descriptionAccent}>полную информацию</span> о состоянём за сверхнизкое время
      </div>

      <div
        className={uploadAreaClass}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <ButtonUpload onFileSelect={handleFileSelect} disabled={isLoading} hasFile={!!selectedFile}>
          {selectedFile ? selectedFile.name : 'Загрузить файл'}
        </ButtonUpload>
        
        <div className={styles.uploadMessage}>{selectedFile ? 'Файл загружен!' : 'или перетащите сюда'}</div>
      </div>

      {/* <button className={styles.buttonSend} onClick={handleSubmit} disabled={isLoading || !selectedFile}>
        {isLoading ? 'Обработка...' : 'Отправить'}
      </button> */}
      <div>
        <Button onClick={handleSubmit}>Отправить</Button>
        {!isLoading && <div>Здесь появятся хайлайты</div> }
        {renderResults()}
      </div>

      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export { AnalyticsPage };
