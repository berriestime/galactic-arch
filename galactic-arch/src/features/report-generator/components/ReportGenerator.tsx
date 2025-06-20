import { useGenerateReport } from '../../../hooks/useGenerateReport';
import { Button } from '../../../components/Button/Button';

const ReportGenerator = () => {
  const { handleGenerate, isLoading, error } = useGenerateReport();

  return (
    <div className="generator-container">
      <h2>CSV Report Generator</h2>
      <p>Click button to generate test report</p>
      
      <Button 
        onClick={handleGenerate}
        disabled={isLoading}
      >
        {isLoading ? 'Generating...' : 'Generate Report'}
      </Button>
      
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export { ReportGenerator };