import { API_BASE_URL } from './config';

export const fetchAggregate = async (
  rows: number,
  file?: File,
  onChunk?: (chunk: AggregateResponse) => void,
): Promise<AggregateResponse[]> => {
  const csvFile = file;
  const formData = new FormData();
  formData.append('file', csvFile);

  try {
    const response = await fetch(`${API_BASE_URL}/aggregate?rows=${rows}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await tryParseError(response);
      throw new Error('Ошибка обработки файла');
    }

    return await processStreamResponse(response, onChunk);
  } catch (error) {
    console.error('Aggregation failed:', error);
    throw new Error('упс, не то...');
  }
};

const processStreamResponse = async (
  response: Response,
  onChunk?: (chunk: AggregateResponse) => void,
): Promise<AggregateResponse[]> => {
  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  let buffer = '';
  const results: AggregateResponse[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');

    for (let i = 0; i < lines.length - 1; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      try {
        const data: AggregateResponse = JSON.parse(line);
        results.push(data);
        onChunk?.(data); // Вызываем callback для каждого чанка
      } catch (err) {
        console.warn('Failed to parse chunk:', line);
      }
    }

    buffer = lines[lines.length - 1];
  }

  if (buffer.trim()) {
    try {
      const data = JSON.parse(buffer);
      results.push(data);
      onChunk?.(data);
    } catch (err) {
      console.warn('Failed to parse last chunk:', buffer);
    }
  }

  return results;
};
