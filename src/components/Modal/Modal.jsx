import { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Overlay, ModalWindow } from './Modal.styled';

const rootModal = document.querySelector('#root-modal');

export const Modal = ({ selectedPhoto: { largeImageURL, tags }, onClose }) => {
  const onEscapeCloseModal = useCallback(
    evt => {
      if (evt.code === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    const handleEscape = evt => onEscapeCloseModal(evt);
    return () => {
      window.addEventListener('keydown', handleEscape);
    };
  }, [onEscapeCloseModal]);

  const onClickOverlay = useCallback(
    evt => {
      if (evt.target === evt.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  return createPortal(
    <Overlay onClick={onClickOverlay}>
      <ModalWindow>
        <img src={largeImageURL} alt={tags} />
      </ModalWindow>
    </Overlay>,
    rootModal
  );
};
