// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

/**
   * @title EcoCity
   * @dev ContractDescription
   */
contract EcoCity {

    //indirizzo del wallet dell'organizzazione (8° su ganache)
    address payable organization = payable(0x012b1ecAb40fcCF8a07e1Db99174b7D3bC89819B);

	enum CommunityType {
    	EcoFriendly, InTransition, Polluting, AtRisk
	}

	struct Community{
    	bytes name;
    	CommunityType classification; //al momemnto della creazione la community è AtRisk
    	uint8[15] resources; 
        uint8[7] challenges;
    	uint256 lastInvestment;
    	uint256 score;
    	uint256 eco;
        uint256 price;
        address payable owner;
        CasualEvent lastEvent;
	}

    struct CasualEvent {
        uint8 eventId;
        uint8 severity;
        uint8[15] damages;

    }

	event CommunityCreated(address indexed communityOwner, bytes name);
    event ResourcesInvested(address indexed communityOwner, uint8[15] investments);
    event CommunityOnSale(address indexed seller, uint256 price);
    event CommunityBought(address indexed oldOwner, address indexed newowner, uint256 price);

    
	mapping(address => Community) public communities; //each wallet can only own one community
    address[] public addressArray; //array dinamico degli indirizzi delle comunità

    mapping (uint8 => uint8[]) public eventDiscounts; //ad ogni eventID associo un array di id di risorse che lo attutiscono
    mapping (uint8 => uint8[]) public eventDamages;  //ad ogni eventID associo un array di id di risorse vengono danneggiate


	function createCommunity(bytes memory _name) public { 
    	require(communities[msg.sender].name.length == 0, "This address already has a community"); 
    	require(_name.length > 0, "Provide a name for the community");

    	communities[msg.sender] = Community({
        	name:_name,
        	classification: CommunityType.AtRisk,
        	resources: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            challenges: [0,0,0,0,0,0,0],
        	//lastInvestment: block.timestamp - 1 days, //immediately give the opportunity to invest ECOs
            lastInvestment: block.timestamp,
        	eco: 10,
        	score: 0,
            price: 0,
            owner: payable(msg.sender),
            lastEvent:CasualEvent(0,0, [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
    	});

        addressArray.push(msg.sender);

		emit CommunityCreated(msg.sender, _name);
	}

	function getCommunityByOwner(address _owner) public view returns (Community memory community) {
        require(communities[_owner].name.length > 0, "This address doesn't have a community");

        return communities[_owner]; //BASTA METTERE MSG.SENDER INVECE DI METTERE IN INPUT L'OWNER
    }


	modifier onlyOncePerDay() {
  	    require(communities[msg.sender].lastInvestment + 1 days <= block.timestamp,"Investment is allowed once per day");
        _;
	}  

	function investResources(uint8[15] memory _investments, uint8 randomNumber, uint8 eventNumber, uint8 eventSeverity) public { 
		Community storage community = communities[msg.sender];
        
        
        //cannot invest more ECOs than you have available
        uint256 sum = 0;
        for(uint256 i = 0; i < _investments.length; i++)
            sum = sum + _investments[i];
        require(sum <= community.eco, "Cannot invest more than what you have");
         
        
        //update the resourses of the community
        for(uint8 i = 0; i < _investments.length; i++) {
            if (community.resources[i] + _investments[i] > 100) {
                community.resources[i] = 100;
            } else {
                community.resources[i] += _investments[i];
            }
        }   
    
        //update of the timestamp of the last investment
        community.lastInvestment = block.timestamp;


        //uint8 randomNumber = uint8(uint256(keccak256(abi.encodePacked(block.timestamp, blockhash(block.number-1))))) % 100 + 1; //[1,100]
        if (randomNumber <= 30 ) { 
            //uint8 eventNumber = uint8(uint256(keccak256(abi.encodePacked(block.timestamp, blockhash(block.number-1), randomNumber)))) % 6 + 1; //[1,6]
            //uint8 eventSeverity = uint8(uint256(keccak256(abi.encodePacked(block.timestamp, blockhash(block.number-1), randomNumber, eventNumber)))) % 3 + 1; //[1,3]
            
            uint8[15] memory array = handleEvent(community, eventNumber, eventSeverity);

            community.lastEvent = CasualEvent(eventNumber, eventSeverity, array);
        } else{
            community.lastEvent = CasualEvent(0, 0, [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
        }

        //computing the new score 
        uint16 totalScore = 0; //uint16 --> [0 e 65535]. max=1500
        for(uint8 i = 0; i < _investments.length; i++) {
            totalScore += community.resources[i];
        }
        community.score = (totalScore * 100) / 1500; //calcolo della percentuale media delle risorse

        //computing the new classification
        if (community.score >= 90) community.classification = CommunityType.EcoFriendly;
        else if (community.score >= 60) community.classification = CommunityType.InTransition;
        else if (community.score >= 30) community.classification = CommunityType.Polluting;
        else community.classification = CommunityType.AtRisk;
        
        //updating eco variable
        //community.eco = 10 + community.score; //DA VERIFICARE SE E' TROPPO POCO
        community.eco = 1000 + community.score;


		//updating challanges values
        community.challenges[0] = (community.resources[0] + community.resources[2] + community.resources[10] + community.resources[11]) / 4 ; //deforestation
        community.challenges[1] = (community.resources[0] + community.resources[3] + community.resources[11] + community.resources[14]) / 4;   //loss of biodiversity
        community.challenges[2] = (community.resources[1] + community.resources[4] + community.resources[6] + community.resources[10]) / 4;    //scarcity of natural resourses
        community.challenges[3] = (community.resources[7] + community.resources[8] + community.resources[9] + community.resources[14]) / 4;    //waste disposal
        community.challenges[4] = (community.resources[1] + community.resources[10] + community.resources[6] + community.resources[11]) / 4;   //climate change
        community.challenges[5] = (community.resources[13] + community.resources[12] + community.resources[6] +community.resources[10]) / 4;   //air pollution 
        community.challenges[6] = (community.resources[5] +  community.resources[4] + community.resources[2] + community.resources[11]) / 4;  //water pollution 

        emit ResourcesInvested(msg.sender, _investments);
	}



  function handleEvent(Community storage community, uint8 eventNumber, uint8 eventSeverity) internal returns (uint8[15] memory) {
    uint8[] memory arrayDiscounts = eventDiscounts[eventNumber];
    uint8[] memory arrayDamages = eventDamages[eventNumber];
    uint8[15] memory damageArray;

    uint256 discount = 0;
    for(uint8 i = 0; i < arrayDiscounts.length; i++) {
        uint8 resourceId = arrayDiscounts[i];
        discount += uint256(community.resources[resourceId]) * uint256(10) / uint256(100);
    }
     

    for(uint8 i = 0; i < arrayDamages.length; i++) {
        uint8 resourceId = arrayDamages[i];
        uint256 percent = uint256(25)*uint256(eventSeverity); //25 o 50 o 75
        uint256 numerator = percent * uint256(community.resources[resourceId]); 
        uint256 damage = numerator / uint256(100);
        uint256 damageDiscounted = damage + ( (damage * discount) / uint256(100) ); //applico lo sconto ai danni
        community.resources[resourceId] -= uint8(damageDiscounted);
        damageArray[resourceId] = uint8(damageDiscounted);
    }
    
    return damageArray;
    }


  function removeFromShop() public {
    Community storage community = communities[msg.sender];
    require(community.price > 0, "Community is not on sale");
    community.price = 0;
  }


  function buyCommunity(Community memory _community) payable public {
      require(msg.sender != _community.owner,"cannot buy your own community" );
      require(_community.price > 0, "community not on sale");
      require(communities[msg.sender].name.length == 0, "This address already has a community"); 
      //require(msg.value >= _community.price, "you do not have enough money"); RIDONDANTE: lo fa metamask
      
      address payable oldOwner = _community.owner;

      // remove old owner from addressArray
      for (uint i = 0; i < addressArray.length; i++) {
          if (addressArray[i] == address(_community.owner)) {
              if (i != addressArray.length - 1) {
                  addressArray[i] = addressArray[addressArray.length - 1];
              }
              addressArray.pop();
              break;
          }
      }

      // add new owner to addressArray
      addressArray.push(payable(msg.sender));

      //transfer money 90%
      oldOwner.transfer(msg.value * 9 / 10); 

      //organization earns 10%
      organization.transfer(msg.value / 10);

      //update owner and put not on sale anymore
      _community.owner = payable(msg.sender);
      _community.price = 0;

      // update communities mapping
      delete communities[oldOwner];
      communities[msg.sender] = _community;
      
      // emit event
      emit CommunityBought(oldOwner, msg.sender, msg.value);
  }


  function sellCommunity(uint256 price, address addressOwner) public {
      Community storage community = communities[addressOwner];
      require(community.price == 0,"community is already on sale");
      require(price > 0,"price must be greater than 0");
      require(msg.sender == community.owner,"you must be the owner of the community");
      community.price = price;
      emit CommunityOnSale(msg.sender, price);
  }

  
  function getCommunitiesForSale() public view returns (Community[] memory) {
        uint256 count = 0;
        // scorriamo tutte le comunità per contare quelle in vendita
        for (uint256 i = 0; i < addressArray.length; i++) {
            Community memory community = communities[addressArray[i]];
            if (community.price > 0) {
                count++;
            }
        }

        // creiamo un array di dimensione count
        Community[] memory communitiesOnSale = new Community[](count);
        count = 0;

        // riempiamo l'array con le comunità in vendita
        for (uint256 i = 0; i < addressArray.length; i++){
            Community memory community = communities[addressArray[i]];
            if (community.price > 0){
                communitiesOnSale[count] = community;
                count++;
            }
        }
        return communitiesOnSale;
    }


    
    function getTop5Communities() public view returns (Community[5] memory) {
        Community[5] memory topCommunities;
        uint8 i = 0; // contatore per scorrere l'array topCommunities
        uint256 j = 0; // contatore per l'array addressArray
        while (i < 5 && j < addressArray.length) { //ciclo fino a quando trovo 5 comunità con punteggio > 0 o quando esaurisco gli indirizzi
            address communityAddress = addressArray[j]; //estraggo l'indirizzo corrente
            Community memory community = communities[communityAddress]; //leggo la relativa communità
            if (community.score > 0) { //se la comunità corrente ha uno score
                uint8 k = i; //usato come contatore per scorrere l'array topCommunities e trovare la posizione corretta in cui inserire la comununità corrente
                while (k > 0 && community.score > topCommunities[k - 1].score) { //ciclo finche k>0 e il punteggio della comunità corrente è > di quella nella posizione precedente in array topCommunities
                    //while annidato costoso ma è eseguito solo quando la communità corrente ha lo score> di una delle comunità in topCommunities
                    topCommunities[k] = topCommunities[k - 1]; //sposto la comunità nella posizione k-1 nell'array in posizione k
                    k--;
                }
                topCommunities[k] = community;
                i++;
            }
            j++;
        }
        return topCommunities;
    }
    




  constructor(){
    // populate the mappings for event 1 (storm)
    eventDiscounts[1] = [0, 4, 10];
    eventDamages[1] = [2, 3, 4];
    // populate the mappings for event 2 (drought)
    eventDiscounts[2] = [4, 5, 9, 14];
    eventDamages[2] = [0, 2, 11];
    // populate the mappings for event 3 (flood)
    eventDiscounts[3] = [4, 5, 11];
    eventDamages[3] = [0, 1, 2, 14];
    // populate the mappings for event 4 (epidemic)
    eventDiscounts[4] = [6, 12, 13];
    eventDamages[4] = [6, 9, 11];
    // populate the mappings for event 5 (tornado)
    eventDiscounts[5] = [4, 5, 10];
    eventDamages[5] = [0, 6, 10, 11, 14];
    // populate the mappings for event 6 (fire)
    eventDiscounts[6] = [1, 4, 10, 12];
    eventDamages[6] = [0, 1, 2, 14];
}


}
