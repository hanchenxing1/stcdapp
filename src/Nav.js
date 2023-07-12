import React, { useContext } from 'react';
import { Box, Text, Flex, Link, Button, useColorMode, Code, Image } from '@chakra-ui/react';
import { AccountContext } from './App';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { useNavigate, Link as ReactRouterLink } from 'react-router-dom';
import { MdExitToApp } from 'react-icons/md';
import logo from './assets/logo.svg';


const Nav = ({ logout }) => {
  const defaultAccount = useContext(AccountContext);
  const { colorMode } = useColorMode();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('defaultAccount');
    logout();
    navigate('/');
  };

  return (
    <Box bg={colorMode === 'dark' ? '#3E6643' : '#7FB069'}>
      <Flex justifyContent="space-between" alignItems="center" p="2">
        <Flex alignItems="center">
          <Image src={logo} borderRadius="50%" mr="2" />
          <Link as={ReactRouterLink} to="/" exact>
            <Text fontSize="xl" fontWeight="bold" color={colorMode === 'dark' ? 'white' : 'gray.800'}>
              Home
            </Text>
          </Link>
        </Flex>
        <Link as={ReactRouterLink} to="/challenges" mr="4">
          <Text fontSize="lg" color={colorMode === 'dark' ? 'white' : 'gray.800'}>
          Environmental challenges
          </Text>
        </Link>
        <Link as={ReactRouterLink} to="/ranking" mr="4">
          <Text fontSize="lg" color={colorMode === 'dark' ? 'white' : 'gray.800'}>
          Ranking
          </Text>
        </Link>
        <Link as={ReactRouterLink} to="/shop" mr="4">
          <Text fontSize="lg" color={colorMode === 'dark' ? 'white' : 'gray.800'}>
            Shop
          </Text>
        </Link>
        <Flex alignItems="center">
          {defaultAccount && (
            <>
              <Text mx="2" fontWeight="medium" color={colorMode === 'dark' ? 'white' : 'gray.800'}>
                <Code fontSize="xl">{defaultAccount}</Code>
              </Text>
            </>
          )}
          <ColorModeSwitcher justifySelf="flex-end" ml="2" />
          <Button rightIcon={<MdExitToApp />} variant="ghost" color={colorMode === 'dark' ? 'red' : 'red'} onClick={handleLogout}>
            Logout
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Nav;
