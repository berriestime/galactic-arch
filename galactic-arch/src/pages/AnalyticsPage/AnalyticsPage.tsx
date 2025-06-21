import { useCallback, useState, useRef, useMemo } from 'react';
import { ButtonUpload } from '../../components/ButtonUpload/ButtonUpload';
import styles from './AnalyticsPage.module.css';
import { fetchAggregate } from '../../api/aggregate';
import { Button } from '../../components/Button/Button';
import { ResultsGrid } from '../../components/ResultsGrid/ResultsGrid';

const AnalyticsPage = (): React.ReactElement => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any[]>([]);
  const resultRef = useRef<any[]>([]);
  const [partialResults, setPartialResults] = useState<any[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleClose = useCallback(() => {
    setSelectedFile(null);
    setResult([]);
    resultRef.current = [];
    setPartialResults([]);
    setError(null);
    setIsDragging(false);
    setIsComplete(false);
  }, []);

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
    setIsComplete(false);
    setResult([]);
    resultRef.current = [];
    setPartialResults([]);

    try {
      const aggregationResult = await fetchAggregate(10000, selectedFile, (chunk) => {
        resultRef.current = [...resultRef.current, chunk];
        setPartialResults((prev) => [...prev, chunk]);
      });

      setResult(aggregationResult);
      setIsComplete(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
      console.error('Ошибка агрегации:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderResults = () => {
  const dataToRender = partialResults.length > 0 ? partialResults : result;

  // Объединяем все частичные результаты в один объект
  const combinedResults = dataToRender.length > 0 
    ? dataToRender.reduce((acc, item) => ({ ...acc, ...item }), {})
    : undefined;

  return <ResultsGrid data={combinedResults} />;
};

  const uploadAreaClass = useMemo(() => {
    return `${styles.backgroundUpload} 
            ${isDragging ? styles.dragging : ''} 
            ${isLoading ? styles.disabled : ''}`;
  }, [isDragging, isLoading]);

  return (
    <>
      <div className={styles.main}>
        <div className={styles.description}>
          Загрузите <span className={styles.descriptionAccent}>csv</span> файл и получите{' '}
          <span className={styles.descriptionAccent}>полную информацию</span> о состоянём за сверхнизкое время
        </div>

        <div
          className={uploadAreaClass}
          {...(!selectedFile
            ? {
                onDragEnter: handleDragEnter,
                onDragLeave: handleDragLeave,
                onDragOver: handleDragOver,
                onDrop: handleDrop,
              }
            : {})}
        >
          <div style={{ pointerEvents: isDragging ? 'none' : 'auto' }}>
            <ButtonUpload
              onFileSelect={!selectedFile ? handleFileSelect : undefined}
              disabled={isLoading || !!selectedFile}
              hasFile={!!selectedFile}
              onClose={handleClose}
              isDragging={isDragging && !selectedFile}
              isLoading={isLoading}
              isComplete={isComplete}
            >
              {selectedFile ? selectedFile.name : 'Загрузить файл'}
            </ButtonUpload>
            <div className={styles.uploadMessage}>
              {selectedFile
                ? isLoading
                  ? 'идёт парсинг файла'
                  : isComplete
                    ? 'готово!'
                    : 'Файл загружен!'
                : 'или перетащите сюда'}
            </div>
          </div>
        </div>
        {!isLoading && !isComplete && (
          <Button onClick={handleSubmit} disabled2={!selectedFile}>
            Отправить
          </Button>
        )}
        {renderResults()}
        {error && <div className={styles.error}>{error}</div>}
      </div>
    </>
  );
};

export { AnalyticsPage };
