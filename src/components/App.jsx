import { useState, useEffect } from 'react';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { fetchPhoto, fetchError } from '../api/api';
import { AppContainer, Title, Container } from './App.styled';

import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';

const perPage = 12;

export const styleNotify = {
  position: 'top-right',
  timeout: 2000,
  width: '300px',
  fontSize: '20px',
};
export const App = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [btnLoadMore, setBtnLoadMore] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    if (!search) {
      return;
    }
    addNewPage(search, page);
  }, [search, page]);

  const addNewPage = (search, page) => {
    setIsLoading(true);

    fetchPhoto(search, page, perPage)
      .then(data => {
        const { totalHits } = data;
        const totalPage = Math.ceil(data.totalHits / perPage);
        if (totalHits === 0) {
          return Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.',
            styleNotify
          );
        }

        const photoArray = data.hits.map(
          ({ id, webformatURL, largeImageURL, tags }) => ({
            id,
            webformatURL,
            largeImageURL,
            tags,
          })
        );

        setPhotos(prevPhotos => [...prevPhotos, ...photoArray]);

        if (totalPage > page) {
          setBtnLoadMore(true);
        } else {
          Notify.info(
            "We're sorry, but you've reached the end of search results.",
            styleNotify
          );
          setBtnLoadMore(false);
        }
      })
      .catch(fetchError)
      .finally(() => setIsLoading(false));
  };

  const onSubmitSearch = searchImage => {
    if (searchImage === search) {
      Notify.info('Enter new request, please!', styleNotify);
      return;
    }

    setSearch(searchImage);
    setPage(1);
    setPhotos([]);
  };

  const toggleModal = () => {
    setShowModal(prevShowModal => !prevShowModal);
  };

  const onClickOpenModal = evt => {
    const idImage = evt.target.getAttribute('data-id');
    const selectedLargePhoto = photos.find(
      photo => photo.id === Number(idImage)
    );
    setSelectedPhoto(selectedLargePhoto);

    toggleModal();
  };

  const onClickReloading = () => {
    setPage(prevPage => prevPage + 1);
    setBtnLoadMore(false);
  };

  return (
    <Container>
      <Title>Image finder</Title>
      <Searchbar onSubmitSearch={onSubmitSearch} />

      <AppContainer>
        {photos.length !== 0 && (
          <ImageGallery photos={photos} onClickImage={onClickOpenModal} />
        )}
        {isLoading && <Loader />}
      </AppContainer>
      {photos.length !== 0 && btnLoadMore && (
        <Button onClickReloading={onClickReloading} />
      )}
      {showModal && (
        <Modal selectedPhoto={selectedPhoto} onClose={toggleModal} />
      )}
    </Container>
  );
};
