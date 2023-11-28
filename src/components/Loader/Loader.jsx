import { Vortex } from 'react-loader-spinner';
import { Loaders } from './Loader.styled';

export const Loader = () => (
  <Loaders>
    <Vortex
      visible={true}
      height="180"
      width="180"
      ariaLabel="vortex-loading"
      wrapperStyle={{}}
      wrapperClass="vortex-wrapper"
      colors={['red', 'green', 'blue', 'yellow', 'orange', 'purple']}
    />
  </Loaders>
);
