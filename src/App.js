import "./App.css";
import {useWeb3React} from "@web3-react/core";
import Web3 from "web3";
import {useEffect} from "react";
import {NFT} from "./contract/NFT";
import {walletConnectConnector} from "./connectors";


function App() {
    const {account, chainId, connector, activate, library} = useWeb3React();
    console.log(connector, library, chainId, 'connector');


    useEffect(()=> {
        if(localStorage.getItem('isWalletConnect')) {
            activate(walletConnectConnector, undefined, true).catch(e => console.log('ee', e));
        }

    }, [library])

    console.log(library);



    const connectWalletConnectConnector = () => {
        activate(walletConnectConnector, undefined, true).then(() => {
            localStorage.setItem('isWalletConnect', 'true')

        }).catch(e => console.log('ee', e));
    };


    const createNFT = async () => {
        console.log('create nft')
        const web3 = new Web3(library.provider);
        const dtaContract = new web3.eth.Contract(NFT.ABI, NFT.Address);
        await dtaContract.methods.createDTA(account, 4, 1990).send({from: account})
    }

    const burnNFT = async () => {
        const web3 = new Web3(library.provider);
        const dtaContract = new web3.eth.Contract(NFT.ABI, NFT.Address);
        await dtaContract.methods.burn(account, 2, 100).send({from: account})

    }


    const getAmountNFT = async () => {
        const web3 = new Web3(library.provider);
        const dtaContract = new web3.eth.Contract(NFT.ABI, NFT.Address);
        const amount = await dtaContract.methods.balanceOf(account, 1).call();
        console.log(amount, 'sss');

    }


    return (
        <div className="App">
            <div style={{marginTop: "4rem"}}>
                {
                    account ?
                        <> <h1>Account: {account} <button onClick={createNFT}>Create NFT</button> <button onClick={getAmountNFT}>GET AMOUNT</button> <button onClick={burnNFT}>Burn NFT</button> </h1>

                        </> :
                        <>

                            <br/>
                            <button style={{marginTop: '3rem'}} onClick={connectWalletConnectConnector}>Connect
                                WalletConnect
                            </button>
                        </>
                }
            </div>
        </div>
    );
}

export default App;
