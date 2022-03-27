import "./App.css";
import {useWeb3React} from "@web3-react/core";
import Web3 from "web3";
import {useEffect, useState} from "react";
import {ERC20} from './contract/ERC20';
import {WETH} from "./contract/WETH";
import {injected, walletConnectConnector} from "./utils";
import {Modal, Table} from 'antd';
import {userHistoryApollo} from "./services/apollo/history";


function App() {
    const {account, chainId, connector, activate, library} = useWeb3React();
    const [balance, setBlance] = useState(0);
    const [isApproved, setIsApproved] = useState(false);
    const [isModalVisibleStake, setIsModalVisibleStake] = useState(false);
    const [isModalVisibleWithDraw, setIsModalVisibleWithDraw] = useState(false);
    const [weth, setWeth] = useState('');
    const [amount, setAmount] = useState('');
    const [totalSupplyWeth, setTotalSupplyWeth] = useState(0);
    const [histories, setHistories] = useState([]);

    const columns = [
        {
            title: 'Action',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Time',
            dataIndex: 'timestamp',
            key: 'timestamp',
        },
    ];


    console.log(library);
    const connectInjectedConnector = () => {
        activate(injected);
    };

    const showModal = () => {
        setIsModalVisibleStake(true);
    };

    const showModalW = () => {
        setIsModalVisibleWithDraw(true);
    };


    const handleCancel = () => {
        setIsModalVisibleStake(false);
    };

    const handleCancelWithDraw = () => {
        setIsModalVisibleWithDraw(false);
    };


    const connectWalletConnectConnector = () => {
        activate(walletConnectConnector, undefined, true).catch(e => console.log('ee', e));
    };


    const getBalance = async () => {
        const web3 = new Web3(library.provider);
        const wethContract = new web3.eth.Contract(ERC20.ABI, WETH.Address);
        const balanceAccount = await wethContract.methods.balanceOf(account).call();
        const total = await wethContract.methods.totalSupply().call();
        setTotalSupplyWeth(web3.utils.fromWei(total))
        setBlance(web3.utils.fromWei(balanceAccount));
    }

    const getStaticInfo = async () => {
        await getBalance();
    };

    const deposit = async () => {
        const web3 = new Web3(library.provider);
        const wethContract = new web3.eth.Contract(ERC20.ABI, WETH.Address);
        await wethContract.methods.deposit().send({value: web3.utils.toWei(weth), from: account});
        setIsModalVisibleStake(false);
        getStaticInfo();
        getUserHistory()
    };


    const withDraw = async () => {
        const web3 = new Web3(library.provider);
        const wethContract = new web3.eth.Contract(WETH.ABI, WETH.Address);
        await wethContract.methods.withdraw(web3.utils.toWei(amount)).send({from: account});
        setIsModalVisibleWithDraw(false);
        getStaticInfo();
        getUserHistory();
    }

    const handleApproved = async () => {
        const web3 = new Web3(library.provider);
        const wethContract = new web3.eth.Contract(WETH.ABI, WETH.Address);
        await wethContract.methods.approve(account, web3.utils.toWei(balance.toString())).send({from: account});
        setIsApproved(true);
    }

    function handleChangeWeth(event) {
        const weth = event.target.value;
        setWeth(weth);
    }

    function handleChangeAmount(event) {
        const amount = event.target.value;
        setAmount(amount);
    }

    useEffect(() => {
        if (account) {
            getStaticInfo();
            getUserHistory(account)
        }
    }, [account]);

    async function getUserHistory(account) {
        const histories = await userHistoryApollo.getMarketDetail(account.toLowerCase());
        setHistories(histories.data.userHistories)
    }


    return (
        <div className="App">
            <div style={{marginTop: "4rem"}}>
                {
                    account ?
                        <> <h1>Account: {account} </h1>
                            <h2>Balance: {balance} WETH</h2>
                            <h2>Token Earn: 0 DD2</h2>
                            <h2>Your Stake: 0 WETH</h2>
                            <h2>Total Stake: {totalSupplyWeth} WETH</h2>
                            <button onClick={showModal}>Harvest</button>
                            <Modal footer={null} title="Stake" visible={isModalVisibleStake} onCancel={handleCancel}>
                                <input onChange={handleChangeWeth}/>
                                <p>Your Balance: {balance} WETH</p>
                                <button onClick={deposit}>Stake</button>
                            </Modal>

                            <Modal footer={null} title="WithDraw" visible={isModalVisibleWithDraw}
                                   onCancel={handleCancelWithDraw}>
                                <input onChange={handleChangeAmount}/>
                                <p>Your Balance: {balance} WETH</p>
                                <button onClick={withDraw}>WithDraw</button>
                            </Modal>

                            {!isApproved ? <button onClick={handleApproved}>Approved</button> :
                                <>
                                    <button onClick={showModal}>Deposit</button>
                                    <button onClick={showModalW}>WithDraw WETH</button>
                                </>}

                            <Table dataSource={histories} columns={columns}/>


                        </> :
                        <>
                            <button onClick={connectInjectedConnector}>Connect Metamask</button>
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
