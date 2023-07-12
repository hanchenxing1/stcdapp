import React, { useState, useEffect, useContext } from 'react';
import { Box, Text, Progress,Flex, Heading, Center, Grid, GridItem, Popover, PopoverTrigger, PopoverBody, PopoverContent, PopoverHeader, PopoverCloseButton, IconButton, PopoverArrow} from '@chakra-ui/react';
import { AccountContext } from './App';
import { challengesInfo } from './metadata.js';
import { InfoIcon  } from "@chakra-ui/icons";


const Challenges = ({ myContractInstance }) => {
  const [userCommunity, setUserCommunity] = useState(null);
  const defaultAccount = useContext(AccountContext);

  useEffect(() => {
    const loadUserCommunity = async () => {
      if (myContractInstance) {
        const community = await myContractInstance.methods.getCommunityByOwner(defaultAccount).call();
        setUserCommunity(community);
      }
    };
    loadUserCommunity();
  }, [defaultAccount, myContractInstance]);


  if (userCommunity) {
  return (
    <Center>
  <Box w="100%" maxW="1200px">
    <Heading mb={9} mt={9} textAlign="center">Environmental challenges</Heading>
    {userCommunity && (
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
        {challengesInfo.map((challenge, index) => (
          <GridItem key={challenge.name}>
            <Box
              p={4}
              borderRadius="md"
              boxShadow="md"
              h="100%"
              position="relative"
            >
              <Flex justifyContent="center" alignItems="center" mb={4}>
                <Heading fontSize="xl">{challenge.name}</Heading>
              </Flex>
              <Box position="absolute" top={2} right={2}>
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
                    <PopoverHeader>{challenge.name}</PopoverHeader>
                    <PopoverBody>{challenge.description}</PopoverBody>
                  </PopoverContent>
                </Popover>
              </Box>
              <Box mb={4}>
                <Progress hasStripe colorScheme='green' value={parseInt(userCommunity.challenges[index])} />
              </Box>
              <Flex justifyContent="flex-end">
                <Box>
                  <Text fontWeight="bold">{userCommunity.challenges[index]}%</Text>
                </Box>
              </Flex>
            </Box>
          </GridItem>
        ))}
      </Grid>
    )}
  </Box>
</Center>
  );


        } else {
        return (
          <Center>
          <Box w="100%" maxW="1200px">
            <Heading mb={9} mt={9} textAlign="center">You currently do not own a community. Create a new one or buy one from the shop.</Heading>
          </Box>
          </Center>

        );
      
        }


};

export default Challenges;
