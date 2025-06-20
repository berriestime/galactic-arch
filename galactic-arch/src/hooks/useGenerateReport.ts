import { useState } from 'react';
import { generateReport } from '../api/reportApi';

const useGenerateReport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await generateReport();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  return { handleGenerate, isLoading, error };
};

export { useGenerateReport };