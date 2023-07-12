import React, { useState, useEffect, useContext } from 'react';
import { Box, Text, Input, Button, useToast, useColorMode,IconButton, CircularProgress, CircularProgressLabel, PopoverArrow, PopoverCloseButton, PopoverHeader,  Stat, StatHelpText, StatArrow, Badge,InputGroup, Popover, PopoverTrigger, PopoverContent, PopoverBody, Image, SimpleGrid, InputRightElement, List, ListItem, ListIcon, Progress} from '@chakra-ui/react';
import { AccountContext } from './App';
import Web3 from 'web3'; //qui serve per codificare/decodificare il nome della comunità
import {Flex} from '@chakra-ui/react';
import { FaInfoCircle } from "react-icons/fa";
import { InfoIcon  } from "@chakra-ui/icons";
import { resourcesInfo } from './metadata.js';

// Importa tutte le immagini delle risorse
import img0 from './assets/resources/0.jpg';
import img1 from './assets/resources/1.jpg';
import img2 from './assets/resources/2.jpg';
import img3 from './assets/resources/3.jpg';
import img4 from './assets/resources/4.jpg';
import img5 from './assets/resources/5.jpg';
import img6 from './assets/resources/6.jpg';
import img7 from './assets/resources/7.jpg';
import img8 from './assets/resources/8.jpg';
import img9 from './assets/resources/9.jpg';
import img10 from './assets/resources/10.png';
import img11 from './assets/resources/11.jpg';
import img12 from './assets/resources/12.jpg';
import img13 from './assets/resources/13.jpg';
import img14 from './assets/resources/14.jpg';



const Home = ({ myContractInstance }) => {
  const { colorMode } = useColorMode();
  const [communityName, setCommunityName] = useState(''); //assigned with input text by user
  const toast = useToast();
  const defaultAccount = useContext(AccountContext); //address of the logged account
  const [userCommunity, setUserCommunity] = useState(null);


  const [timeUntilNextInvestment, setTimeUntilNextInvestment] = useState(0); //timer per il prossimo investimento possibile


  const [increments, setIncrements] = useState([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);

  const totalIncrements = increments.reduce((sum, value) => sum + value, 0); // calcola la somma totale degli incrementi

const handleResourceChange = (index, increment) => {
  const newResources = [...increments];
  const maxIncrement = userCommunity.eco - newResources.reduce((sum, value) => sum + value, 0); // calcola il massimo incremento possibile
  const actualIncrement = Math.min(maxIncrement, increment); // determina l'incremento effettivo, limitandolo al massimo incremento possibile
  newResources[index] = Math.max(0, Math.min(100, newResources[index] + actualIncrement));
  setIncrements(newResources);
};
  


  const classificationNames = ['EcoFriendly', 'InTransition', 'Polluting', 'AtRisk'];

  const classificationColors = {
    0: "green",
    1: "blue",
    2: "orange",
    3: "red",
  };
  

  const generateRandomNumbers = () => {
    const randomNumber = Math.floor(Math.random() *100) + 1; //[1,100]
    const eventNumber = Math.floor(Math.random() *6) + 1; //[1,6]
    const eventSeverity = Math.floor(Math.random() *3) + 1; //[1,3]
    return [randomNumber, eventNumber, eventSeverity]
  };

  const handleInvestResources = async () => {
    try {
      // Invoca la funzione dello smart contract
      const randomNumbers = generateRandomNumbers();
      await myContractInstance.methods.investResources(increments, randomNumbers[0], randomNumbers[1], randomNumbers[2]).send({ from: defaultAccount});
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
  
  

 

  useEffect(() => {
    const loadUserCommunity = async () => {
      if (myContractInstance) {
        const community = await myContractInstance.methods.getCommunityByOwner(defaultAccount).call();
        setUserCommunity(community);
        const timeLeft = ((community.lastInvestment * 1000) + (24 * 60 * 60 * 1000)) - Date.now();
        setTimeUntilNextInvestment(timeLeft < 0 ? 0 : timeLeft);
      }
    };
    loadUserCommunity();
  }, [defaultAccount, myContractInstance]);

   


  useEffect(() => {
    const interval = setInterval(() => {
      setTimeUntilNextInvestment(prev => (prev > 0 ? prev - 1000 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  

 

  const handleCreateCommunity = async () => {
    if (communityName.trim() === '') {
      toast({
        position: 'top',
        title: 'Error',
        description: 'Please enter a valid community name',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } else {
      try {
        await myContractInstance.methods.createCommunity(Web3.utils.utf8ToHex(communityName)).send({from: defaultAccount});

        toast({
          position: 'top',
          title: 'Success',
          description: `Community ${communityName} created`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setCommunityName('');
        window.location.reload(); // refresha la pagina
      } catch (error) {
        console.log(error);
        toast({
          position: 'top',
          title: 'Error',
          description: 'An error occurred while creating the community',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  

  function getEventTitle(id) {
    switch (id) {
      case 1:
        return "Storm";
      case 2:
        return "Drought";
      case 3:
        return "Flood";
      case 4:
        return "Epidemic";
      case 5:
        return "Tornado";
      case 6:
        return "Fire";
      default:
        return "No disasters to report";
    }
  }

  function getSeverityText(severity) {
    let severityText = '';
    if (severity === 1) {
    severityText = 'Mild';
    } else if (severity === 2) {
    severityText = 'Moderate';
    } else if (severity === 3) {
    severityText = 'Severe';
    }
    return severityText;
    }

  // Crea un array con tutte le immagini delle risorse
  const images = [img0, img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12, img13, img14];



  if (userCommunity) {
    return (
      
      <Box p="6" boxShadow="lg" borderRadius="md">
        {/* Dynamic timer for the next investment */}
        <Text display="flex" alignItems="center" justifyContent="center" fontSize="3xl" fontWeight="bold" >
          {timeUntilNextInvestment <= 0
            ? "Next investment available now"
            : `Next investment in `} 
        </Text>
    
        <Box display="flex" alignItems="center" justifyContent="center" mt="4">
          <Flex flexDirection="column" alignItems="center" mr="4">
            <Box color="black" bg="gray.100" p="2" borderRadius="md" fontSize="4xl" fontWeight="bold">
              {`${Math.max(0, Math.floor(timeUntilNextInvestment / (1000 * 60 * 60)))}h`}
            </Box>
          </Flex>
          <Flex flexDirection="column" alignItems="center" mr="4">
            <Box color="black" bg="gray.100" p="2" borderRadius="md" fontSize="4xl" fontWeight="bold">
              {`${Math.max(0, Math.floor((timeUntilNextInvestment % (1000 * 60 * 60)) / (1000 * 60)))}m`}
            </Box>
          </Flex>
          <Flex flexDirection="column" alignItems="center">
            <Box color="black" bg="gray.100" p="2" borderRadius="md" fontSize="4xl" fontWeight="bold">
              {`${Math.max(0, Math.floor((timeUntilNextInvestment % (1000 * 60)) / 1000))}s`}
            </Box>
          </Flex>
        </Box>


        <Flex justifyContent="space-between" alignItems="center" mb="4">
          {/* Title info about the community */}
            <Flex alignItems="center">
              <Text fontSize="3xl" fontWeight="bold">Community: {Web3.utils.hexToUtf8(userCommunity.name)}</Text>
              <Badge fontSize='1em' ml="2" variant='solid' colorScheme={classificationColors[userCommunity.classification]}>
                {`${classificationNames[userCommunity.classification]}`}
              </Badge>
              {userCommunity.price > 0 ? (
                <Badge ml="2" variant='outline' colorScheme="gray">On Sale: {Web3.utils.fromWei(userCommunity.price, 'ether')} ETH</Badge>
              ) : (
                <Badge ml="2" variant='outline' colorScheme="gray">
                  Not on Sale
                </Badge>
              )}
            </Flex>

      {/* Box for information on any natural event that has occurred */}
      <Box borderRadius="md" mr="50" mt="5">
        <Flex alignItems="center">
          <Box>
            <Text fontWeight="bold">{getEventTitle(parseInt(userCommunity.lastEvent.eventId))}</Text>
            {parseInt(userCommunity.lastEvent.severity) !== 0 ? (
              <Text>
                Severity:{' '}
                <Badge mb="1" variant='outline' ml="1" fontSize="md" color={
                                                    parseInt(userCommunity.lastEvent.severity) === 1
                                                      ? 'yellow.500'
                                                      : parseInt(userCommunity.lastEvent.severity) === 2
                                                      ? 'orange.500'
                                                      : 'red.500'
                                                  }
                >
                  {getSeverityText(parseInt(userCommunity.lastEvent.severity))}
                </Badge>
              </Text>
            ) : null}
            
              </Box>
        </Flex>
    </Box>




    </Flex>


       {/* General info about the community */}         
        <Box mb="4">
        <List spacing={3}>
          <ListItem display="flex" alignItems="center">
            <ListIcon as={FaInfoCircle} color="green.500" />
            <Box mr={2}>Score:</Box>
            <Progress hasStripe value={userCommunity.score} max={100} colorScheme="green" size="sm" mr={2} w={500} />{parseInt(userCommunity.score)}%
          </ListItem>
          <ListItem>
            <ListIcon as={FaInfoCircle} color="green.500" />
            ECOs available: {userCommunity.eco - totalIncrements}/{userCommunity.eco}
          </ListItem>
        </List>

        <Text mt="3">
          Last investment: {new Date(userCommunity.lastInvestment * 1000).toLocaleString()}
        </Text>

 
  {/* Button to make the investment */}
    {timeUntilNextInvestment === 0 ? (
      <Box display="flex" justifyContent="center" alignItems="center" mt="5" height="100%">
          <Button colorScheme='green' variant='solid' onClick={handleInvestResources}>Invest</Button>
      </Box> 
            ) : (
              <Box display="flex" justifyContent="center" alignItems="center" mt="5"  height="100%">
                <Button isLoading loadingText='Invest' colorScheme='green' variant='solid'>Invest</Button>
               <Button colorScheme='green' variant='solid' onClick={handleInvestResources}>Invest</Button>
              </Box>
            )}

         
</Box>


{/* Grid for resources that can be invested in */}
<SimpleGrid columns={[1, 2, 3, 4, 5]} spacing={15} mt="8">
  {userCommunity.resources.map((value, index) => (
    <Box key={index} borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Flex justifyContent="flex-end" mt="auto" mr="auto">
        <Popover>
            <PopoverTrigger>
              <IconButton
                size="sm"
                icon={<InfoIcon />}
                aria-label="challenge description"
              />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>{resourcesInfo[index].name}</PopoverHeader>
              <PopoverBody>{resourcesInfo[index].description}</PopoverBody>
            </PopoverContent>
          </Popover>
      </Flex>

      <Box >
        <Flex direction="column" alignItems="center">
        <Image src={images[index]} alt={resourcesInfo[index].name} objectFit="cover"  mt="-8" mb="2" />

        </Flex>
        <Flex  mb="2">
          <Text fontSize="lg" ml="4" fontWeight="bold">{`${resourcesInfo[index].name}`}</Text>
          {parseInt(userCommunity.lastEvent.damages[index]) !== 0 && (
          <Stat> 
            <StatHelpText ml="2">
              <StatArrow type='decrease' />
              {parseInt(userCommunity.lastEvent.damages[index])}%
            </StatHelpText>
          </Stat>
          )}
        </Flex>

        <Box display="flex"  justifyContent="center" mb="3">
          <CircularProgress value={parseInt(value) + increments[index]} color='green.400' size="100px">
            <CircularProgressLabel>{parseInt(value) + increments[index]}%</CircularProgressLabel>
          </CircularProgress>
          <Box ml="4">
            <Text fontSize="md" fontWeight="semibold" mb="1">Increment level</Text>
            <InputGroup>
              <Input
                type="number"
                min={parseInt(value)}
                max={100}
                value={increments[index]}
                readOnly
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={() => handleResourceChange(index, 1)}>+</Button>
                <Button h="1.75rem" size="sm" onClick={() => handleResourceChange(index, -1)}>-</Button>
              </InputRightElement>
            </InputGroup>
          </Box>
        </Box>

      </Box>
    </Box>
  ))}
</SimpleGrid>





      
      </Box>



      
    );
    
    
  } else {
    return (
      <Box bg={colorMode === 'dark' ? '#1A202C' : '#F0F4F8'}
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Box p="6" boxShadow="lg" borderRadius="md" textAlign="center">
          <Text fontSize="3xl" fontWeight="bold" mb="6">
            Create a new community
          </Text>
          <Input
            placeholder="Community name"
            value={communityName}
            onChange={(e) => setCommunityName(e.target.value)}
            mb="4"
          />
          <Button
            colorScheme="blue"
            onClick={handleCreateCommunity}
            mx="auto"
            mt="4"
            display="block"
          >
            Create Community
          </Button>
        </Box>
      </Box>
    );
  }
  
  
};

export default Home;
