import { useCallback, useState, useRef, useMemo } from 'react';
import { ButtonUpload } from '../../components/ButtonUpload/ButtonUpload';
import styles from './AnalyticsPage.module.css';
import { fetchAggregate } from '../../api/aggregate';
import { Button } from '../../components/Button/Button';
import { ResultsGrid } from '../../components/ResultsGrid/ResultsGrid';
import { useHistoryStore } from '../../store/historyStore';

const AnalyticsPage = (): React.ReactElement => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<boolean>(false);
  const [result, setResult] = useState<any[]>([]);
  const resultRef = useRef<any[]>([]);
  const [partialResults, setPartialResults] = useState<any[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const roundNumbersInObject = (obj: any): any => {
    if (!obj) return obj;

    const roundedObj: any = {};
    for (const key in obj) {
      if (typeof obj[key] === 'number') {
        roundedObj[key] = Math.round(obj[key]);
      } else {
        roundedObj[key] = obj[key];
      }
    }
    return roundedObj;
  };

  const handleClose = useCallback(() => {
    setSelectedFile(null);
    setResult([]);
    resultRef.current = [];
    setPartialResults([]);
    setError(false);
    setIsDragging(false);
    setIsComplete(false);
    setStatus('idle');
  }, []);

  const handleFileSelect = useCallback((file: File) => {
    if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
      setSelectedFile(file);
      setError(false);
      setResult([]);
      resultRef.current = [];
      setPartialResults([]);
    } else {
      setError(true);
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
      setError(true);
      return;
    }

    setIsLoading(true);
    setError(false);
    setIsComplete(false);
    setResult([]);
    resultRef.current = [];
    setPartialResults([]);

    try {
      setStatus('loading');
      const aggregationResult = await fetchAggregate(10000, selectedFile, (chunk) => {
        const roundedChunk = roundNumbersInObject(chunk);
        resultRef.current = [...resultRef.current, roundedChunk];
        setPartialResults((prev) => [...prev, roundedChunk]);
      });

      const roundedResult = aggregationResult.map((item) => roundNumbersInObject(item));
      setResult(roundedResult);
      setIsComplete(true);

      useHistoryStore.getState().addRecord({
        fileName: selectedFile.name,
        status: 'success',
        data: roundedResult.at(-1),
      });
      setStatus('success');
    } catch (err) {
      setStatus('error');
      console.error('Ошибка при агрегации:', err);
      setError(true);

      useHistoryStore.getState().addRecord({
        fileName: selectedFile.name,
        status: 'error',
        error: 'Ошибка обработки файла',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderResults = () => {
    const dataToRender = partialResults.length > 0 ? partialResults : result;

    // Объединяем все частичные результаты в один объект
    const combinedResults =
      dataToRender.length > 0 ? dataToRender.reduce((acc, item) => ({ ...acc, ...item }), {}) : undefined;

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
              disabled={isLoading || !!selectedFile}
              hasFile={!!selectedFile}
              isComplete={false}
              // isComplete={isComplete}
              isDragging={isDragging && !selectedFile}
              isLoading={false}
              // isLoading={isLoading}
              onClose={handleClose}
              onFileSelect={!selectedFile ? handleFileSelect : undefined}
              status={status}
            >
              {selectedFile ? selectedFile.name : 'Загрузить файл'}
            </ButtonUpload>
            <div className={`${styles.uploadMessage} ${status === 'error' ? styles.uploadMessageError : ''}`}>
              {selectedFile
                ? status === 'loading'
                  ? 'идёт парсинг файла'
                  : status === 'error'
                    ? 'упс, не то...'
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
      </div>
    </>
  );
};

export { AnalyticsPage };
