import { useState } from 'react';
import { useHistoryStore } from '../../store/historyStore';
import { useNavigate } from 'react-router-dom';
import styles from './HistoryPage.module.css';
import { Modal } from '../../components/Modal/Modal';
import { ResultsGrid } from '../../components/ResultsGrid/ResultsGrid';
import { Button } from '../../components/Button/Button';
import smileHappy from '../../assets/Smile.svg';
import smileSad from '../../assets/ph_smiley-sad.svg';
import trash from '../../assets/trash.svg';

const formatDateWithDots = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const year = date.getUTCFullYear();

  return `${day}.${month}.${year}`;
};

const HistoryPage = () => {
  const { records, removeRecord, clearHistory } = useHistoryStore();
  const [selectedRecord, setSelectedRecord] = useState<HistoryRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleRecordClick = (record: HistoryRecord) => {
    if (record.status !== 'success') return;
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
  };

  return (
    <div className={styles.container}>
      {records.length === 0 ? (
        <div className={styles.emptyMessage}>История парсинга пуста</div>
      ) : (
        <>
          <div className={styles.historyList}>
            {records.map((record) => (
              <div
                key={record.id}
                className={`${styles.record} ${styles[record.status]} ${
                  record.status !== 'success' ? styles.notClickable : ''
                }`}
                onClick={() => handleRecordClick(record)}
              >
                <div className={styles.recordContent}>
                  <div className={styles.fileName}>{record.fileName}</div>
                  <div className={styles.date}>{formatDateWithDots(record.date)}</div>
                  <div
                    className={`${styles.status} ${record.status === 'success' ? styles.activeStatus : styles.inactiveStatus}`}
                  >
                    Обработан успешно
                    <img src={smileHappy} alt="веселый смайлик" />
                  </div>
                  <div
                    className={`${styles.status} ${record.status === 'error' ? styles.activeStatus : styles.inactiveStatus}`}
                  >
                    Не удалось обработать
                    <img src={smileSad} alt="грустный смайлик" />
                  </div>
                </div>
                <button
                  className={styles.deleteButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeRecord(record.id);
                  }}
                  title="Удалить запись"
                >
                  <img src={trash} alt="корзина" />
                </button>
              </div>
            ))}
          </div>
          <div className={styles.controls}>
            <Button onClick={() => navigate('/generator')}>Сгенерировать больше</Button>
            <Button onClick={clearHistory} className={styles.clearButton}>
              Очистить всё
            </Button>
          </div>
        </>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {selectedRecord && (
          <div className={styles.modalContent}>
            {selectedRecord.data && <ResultsGrid data={selectedRecord.data} variant="history" />}
          </div>
        )}
      </Modal>
    </div>
  );
};

export { HistoryPage };
