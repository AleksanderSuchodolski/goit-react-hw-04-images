// Імпортуючи useState та useEffect з бібліотеки React для управління станом та використання ефектів
import { useState, useEffect } from 'react';

// Імпортуючи компонент Notify з бібліотеки Notiflix для відображення повідомлень
import { Notify } from 'notiflix/build/notiflix-notify-aio';

// Імпортуючи функції для взаємодії з API
import { fetchPhoto, fetchError } from '../api/api';

// Імпортуючи стилізовані компоненти для головного контейнера, назви та внутрішнього контейнера
import { AppContainer, Title, Container } from './App.styled';

// Імпортуючи компоненти для пошукової стрічки, галереї зображень, кнопки та завантажувача
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { Loader } from './Loader/Loader';

// Імпортуючи компонент Modal для відображення зображення в модальному вікні
import { Modal } from './Modal/Modal';

// Кількість зображень, які відображаються на сторінці
const perPage = 12;

// Стиль для відображення повідомлень Notiflix
export const styleNotify = {
  position: 'top-right',
  timeout: 2000,
  width: '300px',
  fontSize: '20px',
};

// Визначення головного компоненту App
export const App = () => {
  // Використання useState для управління станом сторінки, рядка пошуку, списку зображень, вказує, чи треба відображати кнопку "Load More", та стану модального вікна
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [btnLoadMore, setBtnLoadMore] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Ефект для виклику нової сторінки зображень при зміні рядка пошуку чи номера сторінки
  useEffect(() => {
    if (!search) {
      return;
    }
    addNewPage(search, page);
  }, [search, page]);

  // Функція для отримання нової сторінки зображень та її відображення
  const addNewPage = (search, page) => {
    setIsLoading(true);

    fetchPhoto(search, page, perPage)
      .then(data => {
        const { totalHits } = data;
        const totalPage = Math.ceil(data.totalHits / perPage);
        if (totalHits === 0) {
          // Виведення повідомлення про відсутність зображень за вказаним запитом
          return Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.',
            styleNotify
          );
        }

        // Створення масиву зображень з отриманих даних
        const photoArray = data.hits.map(
          ({ id, webformatURL, largeImageURL, tags }) => ({
            id,
            webformatURL,
            largeImageURL,
            tags,
          })
        );

        // Додавання нових зображень до списку
        setPhotos(prevPhotos => [...prevPhotos, ...photoArray]);
        // Визначення, чи треба відображати кнопку "Load More"
        if (totalPage > page) {
          setBtnLoadMore(true);
        } else {
          // Виведення повідомлення про досягнення кінця результатів пошуку
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

  // Функція яка отримує(забирає) данні з форми пошукового запиту
  const onSubmitSearch = searchImage => {
    // Перевірка на зміну пошукового запиту
    if (searchImage === search) {
      // Виведення повідомлення про необхідність введення нового запиту
      Notify.info('Enter new request, please!', styleNotify);
      return;
    }

    // Встановлення нового рядка пошуку та обнулення списку зображень
    setSearch(searchImage);
    setPage(1);
    setPhotos([]);
  };

  // Функція для зміни стану відображення модального вікна
  const toggleModal = () => {
    setShowModal(prevShowModal => !prevShowModal);
  };

  // Функція для відкриття модального вікна та вибору обраного зображення
  const onClickOpenModal = evt => {
    const idImage = evt.target.getAttribute('data-id');
    const selectedLargePhoto = photos.find(
      photo => photo.id === Number(idImage)
    );
    setSelectedPhoto(selectedLargePhoto);

    toggleModal();
  };

  // Функція для завантаження наступної сторінки зображень
  const onClickReloading = () => {
    setPage(prevPage => prevPage + 1);
    setBtnLoadMore(false);
  };

  // Відображення головного контейнера додатку
  return (
    <Container>
      <Title>Image finder</Title>
      {/* Виклик компонента пошукової стрічки та передача функції для обробки події відправлення форми */}
      <Searchbar onSubmitSearch={onSubmitSearch} />

      <AppContainer>
        {/* Виклик (за умовою, якщо немає фото то то порожній тег гд не рендериться) компонента галереї зображень та передача списку зображень та функції для відкриття модального вікна */}
        {photos.length !== 0 && (
          <ImageGallery photos={photos} onClickImage={onClickOpenModal} />
        )}
        {/* Відображення завантажувача під час завантаження зображень */}
        {isLoading && <Loader />}
      </AppContainer>
      {/* Відображення кнопки "Load More", якщо є результати та ще не досягнуто кінця результатів пошуку */}
      {photos.length !== 0 && btnLoadMore && (
        <Button onClickReloading={onClickReloading} />
      )}
      {/* Відображення модального вікна, якщо воно відкрите */}
      {showModal && (
        <Modal selectedPhoto={selectedPhoto} onClose={toggleModal} />
      )}
    </Container>
  );
};
