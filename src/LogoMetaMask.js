import React from 'react';
import { Image, keyframes, usePrefersReducedMotion } from '@chakra-ui/react';
import logo from './assets/metamask.svg';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const LogoMetaMask = props => {
  const prefersReducedMotion = usePrefersReducedMotion();

  const animation = prefersReducedMotion
    ? undefined
    : `${spin} infinite 20s linear`;

  const styles = {
    borderRadius: '45%',
    animation: animation,
    transition: 'transform 0.3s ease-in-out',
  };

  return (
    <Image
      src={logo}
      style={styles}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
      {...props}
    />
  );
};
