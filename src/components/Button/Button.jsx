import { ButtonLoadMore, Wrapper } from './Button.styled';

export const Button = ({ onClickReloading }) => (
  <Wrapper>
    <ButtonLoadMore type="button" onClick={onClickReloading}>
      Load more
    </ButtonLoadMore>
  </Wrapper>
);
