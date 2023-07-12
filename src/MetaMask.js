import React, { useState } from 'react';
import { Button, Container, Flex, Heading, Text } from '@chakra-ui/react';
//import { ethers } from 'ethers';
import { Logo } from './Logo';
import {LogoMetaMask} from './LogoMetaMask';
import { ArrowRightIcon } from '@chakra-ui/icons'
import { ColorModeSwitcher } from './ColorModeSwitcher';


const MetaMask = ({ setDefaultAccount }) => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccountLocal] = useState(null);

  //connects to the user's MetaMask wallet: retrieves the account information or displays an error message.
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        });
        if (accounts.length > 0) {
          accountChanged(accounts[0]);
        } else {
          setErrorMessage('*No accounts found in MetaMask');
        }
      } catch (err) {
        setErrorMessage(err.message);
      }
    } else {
      setErrorMessage('*Please install MetaMask in your browser to play EcoCity');
    }
  };


  const accountChanged = (accountName) => {
    setDefaultAccountLocal(accountName);
    setDefaultAccount(accountName);
    // per mantenere la persistenza dell'account anche dopo il refresh, salviamo l'account in uno stato persistente (il Local Storage del browser)
    localStorage.setItem('defaultAccount', accountName);
  };



  return (
    <Container maxW="container.md" mt={10} textAlign="center">
      <ColorModeSwitcher position="absolute" top="0" right="0" mr="2" />
        <Logo h="30vmin" pointerEvents="none" mx="auto" mb={8} />
        <Heading as="h1" size="xl" mb={8}>Join the EcoCity community and become an environmental hero!</Heading>
        <LogoMetaMask size="4xl" alt="MetaMask" width="70px" mx="auto" />
        <Text fontSize="xl" mt={6} mb={8}>Click the button below to connect your MetaMask wallet</Text>
        <Flex justify="center" mb={8}>
          <Button rightIcon={<ArrowRightIcon />} colorScheme="green" onClick={connectWallet}>Connect Wallet</Button>
        </Flex>
        {errorMessage && (<Text color="red" fontWeight="bold">{errorMessage}</Text>)}
    </Container>

  );
};

export default MetaMask;
