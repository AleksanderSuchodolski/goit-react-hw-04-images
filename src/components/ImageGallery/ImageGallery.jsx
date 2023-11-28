import { ImageGalleryItem } from 'components/ImageGalleryItem/ImageGalleryItem';
import { GalleryImage } from './ImageGallery.styled';

export const ImageGallery = ({ photos, onClickImage }) => (
  <GalleryImage>
    {photos.map(({ id, webformatURL, tags }) => (
      <ImageGalleryItem
        key={id}
        id={id}
        tags={tags}
        smallURL={webformatURL}
        onClickImage={onClickImage}
      />
    ))}
  </GalleryImage>
);
