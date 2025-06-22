import { useState } from 'react';
import { generateReport } from '../api/reportApi';

const useGenerateReport = () => {
  const [error, setError] = useState<boolean>(false);

  const handleGenerate = async () => {
    setError(false);
    try {
      await generateReport();
      return true;
    } catch (err) {
      setError(true);
      throw err; // Пробрасываем ошибку дальше для логирования
    }
  };

  return {
    handleGenerate,
    error,
  };
};

export { useGenerateReport };
