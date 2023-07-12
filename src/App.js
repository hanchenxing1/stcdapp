import React, { useState, createContext,useEffect } from 'react';
import { ChakraProvider, theme} from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import MetaMask from './MetaMask';
import Nav from './Nav';
import Home from './Home';
import Challenges from './Challenges';
import Ranking from './Ranking';
import Shop from './Shop';
import initMyContract from "./Contract";

export const AccountContext = createContext(null);

function App() {
  //l'account salvato nel Local Storage verrà utilizzato come account predefinito, a meno che l'utente non effettui nuovamente il login, 
  //in tal caso il nuovo account sostituirà quello salvato nel Local Storage
  const [defaultAccount, setDefaultAccount] = useState(localStorage.getItem('defaultAccount') || null);

  //inizializzazione del contratto
  const [myContractInstance, setMyContractInstance] = useState(null); 
  useEffect(() => {
    const init = async () => {
      const myContractInstance = await initMyContract();
      setMyContractInstance(myContractInstance);
    };
    init();
  }, []);

  const logout = () => {
    localStorage.removeItem('defaultAccount');
    setDefaultAccount(null);

  };

  return (
    <ChakraProvider theme={theme}>
      <AccountContext.Provider value={defaultAccount}>
        <Router>
          {defaultAccount ? (
            <>
              <Nav logout={logout} />
              <Routes>
              <Route path="/" element={<Home myContractInstance={myContractInstance} />} />
                <Route path="/challenges" element={<Challenges myContractInstance={myContractInstance} />} />
                <Route path="/ranking" element={<Ranking myContractInstance={myContractInstance} />} />
                <Route path="/shop" element={<Shop myContractInstance={myContractInstance} />} />
              </Routes>
            </>
          ) : (
            <MetaMask setDefaultAccount={setDefaultAccount} />
          )}
        </Router>
      </AccountContext.Provider>
    </ChakraProvider>
  );
}

export default App;
