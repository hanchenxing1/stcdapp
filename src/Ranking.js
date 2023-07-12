import React, { useState, useEffect, useContext } from 'react';
import { AccountContext } from './App';
import { Image, Badge, Text, Heading, Card,  CardBody, GridItem, Grid, Stack, Center} from '@chakra-ui/react';
import Web3 from 'web3';



function Ranking({ myContractInstance }){
  const defaultAccount = useContext(AccountContext); //indirizzo 0x... dell'account collegato
  const [topCommunities, setTopCommunities] = useState([]);
  
  const startRow = (index) => {
    let rowStart
    if (index === 0){
      rowStart = 0
    }
    else if (index === 1){
      rowStart = 1
    }
    else if (index === 2){
      rowStart = 1
    }

    else if (index === 3){
      rowStart = 3
    }
    else if (index === 4){
      rowStart = 4
    }
    return rowStart
  }
  
  const endRow = (index) => {
    let rowSpan
    if (index === 0){
      rowSpan = 1
  } 
    else if (index === 1){
      rowSpan = 2
    }
    else if (index === 2){
      rowSpan = 2
  }
  else if (index === 3){
    rowSpan = 4
  }
  else if (index === 4){
    rowSpan = 5
}
  return rowSpan
  }
  
  const startCol = (index) => {
    let colStart
    if (index === 0){
      colStart = 5
    }
    else if (index === 1){
      colStart = 4
    }
    else if (index === 2){
      colStart = 6
    }

    else if (index === 3){
      colStart = 5
    }
    else if (index === 4){
      colStart = 5
    }
    return colStart
  }



  const endCol = (index) => {
    let colSpan
    if (index === 0){
      colSpan = 7
  } 
    else if (index === 1){
      colSpan = 6
    }
    else if (index === 2){
      colSpan = 8
      
  }
  else if (index === 3){
    colSpan = 7
  }
  else if (index === 4){
    colSpan = 7
    
}
  return colSpan
  }

  const championSize =(index) => {
    if (index === 0){
      return { base: '80%', sm: '90px' }
    }
    else {
      return {base: '0%', sm:'0px'}
    }
    
  }
  
  const setDir = (index) => {
    if (index === 0){
      return { base: 'column', sm: 'row' }
    }
  }


  useEffect(() => {
    const getTopCommunities = async () => {
      const top5 = await myContractInstance.methods.getTop5Communities().call();
      setTopCommunities(top5);
    }
    getTopCommunities();
  }, [myContractInstance]);


  return (
    
    <>
      <Heading mb={9} mt={9} textAlign="center">Top 5 Communities</Heading>
      
      <Grid h="200px" templateRows="repeat(5, 1fr)" templateColumns="repeat(10, 1fr)" gap={4} >
      {topCommunities.length > 0 ? (
        
        topCommunities.map((community, index) => (
         
         <GridItem rowEnd={endRow(index)} colEnd={endCol(index)} rowStart={startRow(index)} colStart={startCol(index)} >
         
         <Card direction={setDir(index)} overflow='hidden' variant='outline'>
            <Image
              objectFit='cover'
              maxW={championSize(index)}
              src='https://cdn2.iconfinder.com/data/icons/thesquid-ink-40-free-flat-icon-pack/64/cup-512.png'
              
            />
            <Center>
            <Stack>
            
              <CardBody ml = {index===0 ? '10': '0'} align='center'>
                <Heading size='md'> <Badge  mr='2' fontSize='xl' variant='solid'  colorScheme='green'> {index+1}</Badge>
                {Web3.utils.hexToUtf8(community.name)}</Heading>

                <Text fontWeight="bold">
                Score: {community.score}%
              </Text>
              </CardBody>

              
            </Stack>
            </Center>
          </Card>
            
          </GridItem>
                      
        ))
      ) : (
        <Text>No communities found</Text>
      )}
      </Grid>
      
    </>
  );
}


export default Ranking;
