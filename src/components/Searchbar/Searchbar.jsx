import {
  SearchbarContainer,
  SearchForm,
  SearchFormButton,
  SearchFormInput,
} from './Searchbar.styled';
import { HiOutlineSearch } from 'react-icons/hi';
import { Notify } from 'notiflix';

export const Searchbar = ({ onSubmitSearch }) => {
  const handleSubmit = evt => {
    evt.preventDefault();
    const form = evt.currentTarget;
    const searchImage = form.search.value.trim().toLowerCase();
    if (searchImage === '') {
      Notify.info('Enter your request, please!');
      return;
    }
    onSubmitSearch(searchImage);
  };

  return (
    <SearchbarContainer>
      <SearchForm onSubmit={handleSubmit}>
        <SearchFormButton>
          <HiOutlineSearch size="30" />
        </SearchFormButton>

        <SearchFormInput
          typ="text"
          name="search"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
        />
      </SearchForm>
    </SearchbarContainer>
  );
};
