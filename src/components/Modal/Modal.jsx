import { Component } from 'react';
import { createPortal } from 'react-dom';
import { Overlay, ModalWindow } from './Modal.styled';

const rootModal = document.querySelector('#root-modal');

export class Modal extends Component {
  componentDidMount = () => {
    window.addEventListener('keydown', this.onEscapeCloseModal);
  };

  componentWillUnmount = () => {
    window.removeEventListener('keydown', this.onEscapeCloseModal);
  };

  onEscapeCloseModal = evt => {
    if (evt.code === 'Escape') {
      this.props.onClose();
    }
  };

  onClickOverlay = evt => {
    if (evt.target === evt.currentTarget) {
      this.props.onClose();
    }
  };

  render() {
    const {
      selectedPhoto: { largeImageURL, tags },
    } = this.props;

    return createPortal(
      <Overlay onClick={this.onClickOverlay}>
        <ModalWindow>
          <img src={largeImageURL} alt={tags} />
        </ModalWindow>
      </Overlay>,
      rootModal
    );
  }
}
