const generateReport = async (): Promise<void> => {
  const params = {
    size: 0.1,
    withErrors: 'off',
    maxSpend: '1000',
  };

  try {
    const queryParams = new URLSearchParams(params as Record<string, string>).toString();
    const response = await fetch(`http://localhost:3000/report?${queryParams}`);

    if (!response.ok) {
      throw new Error('Report generation failed');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'report.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Ошибка в reportApi:', err); // Логируем полную ошибку
    throw new Error('упс, не то...'); // Заменяем сообщение ошибки
  }
};

export { generateReport };
