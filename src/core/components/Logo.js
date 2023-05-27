import LogoBlack from '@assets/logo/color-quad.black.svg';
import LogoWhite from '@assets/logo/color-quad.white.svg';

const Logo = props => {
  const {theme} = props;
  switch (theme) {
    case 'black':
      return <LogoBlack {...props} />;
    case 'white':
      return <LogoWhite {...props} />;
    default:
      return <LogoBlack {...props} />;
  }
};

export default Logo;
