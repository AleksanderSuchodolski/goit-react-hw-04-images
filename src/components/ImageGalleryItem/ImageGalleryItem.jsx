import {
  ImageGalleryItemContainer,
  ImageGalleryItemImage,
} from './ImageGalleryItem.styled';

export const ImageGalleryItem = ({ id, smallURL, tags, onClickImage }) => (
  <ImageGalleryItemContainer 
  key={id} 
  data-id={id} 
  onClick={onClickImage}>
    <ImageGalleryItemImage data-id={id} src={smallURL} alt={tags} />
  </ImageGalleryItemContainer>
);
