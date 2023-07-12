import React, { useState, useEffect, useContext } from 'react';
import { Box, Text, Button, Input, useToast, SimpleGrid, Heading, Badge, Progress, Stack, Spacer } from '@chakra-ui/react';
import { AccountContext } from './App';
import Web3 from 'web3'; 
import { challengesInfo } from './metadata.js';
import {Flex} from '@chakra-ui/react';



const Shop = ({ myContractInstance }) => {
  const toast = useToast();
  const [price, setPrice] = useState(0);
  const [userCommunity, setUserCommunity] = useState(null);
  const defaultAccount = useContext(AccountContext);
  const [communitiesForSale, setCommunitiesForSale] = useState([]);


useEffect(() => {
  const loadUserCommunity = async () => {
    if (myContractInstance) {
      const community = await myContractInstance.methods.getCommunityByOwner(defaultAccount).call();
      setUserCommunity(community);
    }
  };
  loadUserCommunity();
}, [defaultAccount, myContractInstance]);



const getCommunitiesOnSale = async () => {
  try {
    const result = await myContractInstance.methods.getCommunitiesForSale().call();
    setCommunitiesForSale(result);
  } catch (err) {
    console.log(err);
  }
  };
  
  useEffect(() => {
    getCommunitiesOnSale();
  }, [myContractInstance]);



const sellCommunity = async () => {
  try {
    if (myContractInstance) {
      const weiPrice = Web3.utils.toWei(price, 'ether'); 
      await myContractInstance.methods.sellCommunity(weiPrice, defaultAccount).send({from: defaultAccount});
      window.location.reload(); // refresha la pagina
    }
  } catch (error) {
    toast({
      position: 'top',
      title: 'Error',
      description: `${error.message}`,
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  }
};

const classificationNames = ['EcoFriendly', 'InTransition', 'Polluting', 'AtRisk'];

  const classificationColors = {
    0: "green",
    1: "blue",
    2: "orange",
    3: "red",
  };


  const handleBuyCommunity = async (community) => {
    try {
      await myContractInstance.methods.buyCommunity(community).send({from: defaultAccount, value: community.price});
      toast({
        position: 'top',
        title: 'Success',
        description: `Community ${community.name} bought`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      window.location.reload(); // refresha la pagina
    } catch (error) {
      console.log(error);
      toast({
        position: 'top',
        title: 'Error',
        description: `${error.message}`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRemoveFromShop = async () => {
    try {
      await myContractInstance.methods.removeFromShop().send({from: defaultAccount});
      toast({
        position: 'top',
        title: 'Success',
        description: `Removed successfully from shop`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      window.location.reload(); // refresha la pagina
    } catch (error) {
      console.log(error);
      toast({
        position: 'top',
        title: 'Error',
        description: `${error.message}`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

return (

  <Box>
  <Heading textAlign="center" my={8}>Shop</Heading>

  <Flex justify="center" mb={8}>
    <Box w="auto" textAlign="center">
      <Box >
        <Text fontSize="xl" fontWeight="bold" mb={4}>Put your community up for sale (ETH)</Text>
        <Flex justify="center" mb={4}>
          <Input placeholder="Community price" value={price} onChange={(e) => setPrice(e.target.value)} />
        </Flex>
        <Stack direction="row" spacing={4}>
  <Button colorScheme="teal" onClick={sellCommunity} w="50%" >Put on sale</Button>
  <Spacer />
  <Button colorScheme="teal" onClick={() => handleRemoveFromShop()}  w="50%" >Remove from shop</Button>
</Stack>
      </Box>
    </Box>
  </Flex>


<SimpleGrid columns={[1, 2, 3]} spacing={8} mx={4}>
  {communitiesForSale.map((community, index) => (
  <Box key={index} borderWidth="2px" borderRadius="xl" overflow="hidden">
    <Box p={6} position="relative">
      <Text fontSize="md" fontStyle="italic" color="gray" mb={2}>{community.owner}</Text>
        <Box fontWeight="bold" letterSpacing="wide" fontSize="lg" mb={4}>
          <Box textAlign="center" textTransform="uppercase" mb={2}>
            {Web3.utils.hexToUtf8(community.name)}
            <Badge borderRadius="full" px="2" colorScheme={classificationColors[community.classification]} ml="3">
            {classificationNames[community.classification]}
            </Badge> 
          </Box>
          <Text fontSize="3xl" fontWeight="bold" color="teal.600" mb={2}>{Web3.utils.fromWei(community.price, 'ether')} ETH</Text>
            {community.challenges.map((challenge, i) => (
          <Box key={i} mb="1">
            <Flex justifyContent="space-between" alignItems="center">
              <Text fontSize="md" fontWeight="semibold">{challengesInfo[i].name}</Text>
              <Flex alignItems="center">
                <Text fontSize="md" fontWeight="semibold">{parseInt(challenge)}%</Text>
              </Flex>
            </Flex>
            <Progress hasStripe value={parseInt(challenge)} max={100} colorScheme="green" size="sm" mt="1" />
          </Box>
          ))}
        </Box>
          <Button position="absolute" top="4" right="4" colorScheme="green" size="sm" onClick={() => handleBuyCommunity(community)}>Buy</Button>
    </Box>
  </Box>
))}

</SimpleGrid>

</Box>







    
);
};

export default Shop;
