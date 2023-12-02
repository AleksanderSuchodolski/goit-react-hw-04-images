// Імпортуючи useEffect та useCallback з бібліотеки React для використання побічних ефектів та оптимізації функцій
import { useEffect, useCallback } from 'react';

// Імпортуючи функцію createPortal з react-dom для відображення компоненту поза його звичайним DOM-контекстом
import { createPortal } from 'react-dom';

// Імпортуючи стилізовані компоненти для модального вікна
import { Overlay, ModalWindow } from './Modal.styled';

// Визначення точки монтажу для модального вікна
const rootModal = document.querySelector('#root-modal');

// Визначення компоненту Modal
export const Modal = ({ selectedPhoto: { largeImageURL, tags }, onClose }) => {
  // Функція для закриття модального вікна при натисканні клавіші 'Escape'
  const onEscapeCloseModal = useCallback(
    evt => {
      if (evt.code === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  // Ефект для додавання слухача клавіші 'Escape' при монтажі компонента та його видалення при демонтажі
  useEffect(() => {
    const handleEscape = evt => onEscapeCloseModal(evt);
    return () => {
      window.addEventListener('keydown', handleEscape);
    };
  }, [onEscapeCloseModal]);

  // Функція для закриття модального вікна при кліку на затемнений фон (overlay)
  const onClickOverlay = useCallback(
    evt => {
      if (evt.target === evt.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  // Використання createPortal для відображення компонента за межами його звичайного DOM-контексту
  return createPortal(
    // Оверлей та модальне вікно зображення
    <Overlay onClick={onClickOverlay}>
      <ModalWindow>
        <img src={largeImageURL} alt={tags} />
      </ModalWindow>
    </Overlay>,
    // Кореневий елемент для монтажу модального вікна
    rootModal
  );
};
