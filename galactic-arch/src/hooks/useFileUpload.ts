import { ChangeEvent } from 'react';

type FileUploadOptions = {
  accept?: string;
  multiple?: boolean;
  onFileSelect: (file: File | File[]) => void;
};

export const useFileUpload = ({ accept, multiple = false, onFileSelect }: FileUploadOptions) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (multiple) {
      onFileSelect(Array.from(files));
    } else {
      onFileSelect(files[0]);
    }

    // Сбрасываем значение input, чтобы можно было загрузить тот же файл снова
    e.target.value = '';
  };

  const getInputProps = () => ({
    type: 'file',
    accept,
    multiple,
    onChange: handleFileChange,
  });

  return { getInputProps, handleFileChange };
};
