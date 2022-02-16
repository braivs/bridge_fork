import React, {useState} from "react";
import s from './Menu.module.scss'
import {NetworkElement} from "./NetworkElement/MenuComponent";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRightArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {useDispatch} from "react-redux";
import {connectToMetamask} from "../../redux/bridge-reducer";
import Web3 from "web3";

export const Menu = (props: PropsType) => {

    const [inputValue, setInputValue] = useState<string>('')
    const [buttonText, setButtonText] = useState<'Connect Wallet' | 'Swap'>('Connect Wallet')

    const dispatch = useDispatch()

    const onButtonClick = () => {
        // buttonText === 'Connect Wallet' ? setButtonText('Swap') : setButtonText('Connect Wallet')
        dispatch(connectToMetamask())
    }

    const onButtonClickHere = async () => {
        // buttonText === 'Connect Wallet' ? setButtonText('Swap') : setButtonText('Connect Wallet')
        dispatch(connectToMetamask())

        if(window.ethereum) {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            const chainId = await window.ethereum.request({ method: 'eth_chainId'});
            // Check if user is connected to Mainnet
            if(chainId != '0x1') {
                alert("Please connect to Mainnet");
            } else {
                let wallet = accounts[0];
                // setWalletAddress(wallet);
            }
        } else {
            alert("Please install Mask");
        }
    }

    const connectToMetamaskOld = async () => {
        try {
            /*let ethereum = window.ethereum;
            let web3 = window.web3;*/
            let ethereum;
            if (window.ethereum) ethereum = window.ethereum;
            let web3;
            if (window.web3) web3 = window.web3;

            if (typeof ethereum !== 'undefined') {

                debugger
                await ethereum.enable();
                web3 = new Web3(ethereum);
                // this.setState({web3})
            } else if (typeof web3 !== 'undefined') {

                debugger
                console.log('Web3 Detected!')
                window.web3 = new Web3(web3.currentProvider);
                // this.setState({web3})
            } else {

                debugger
                console.log('No Web3 Detected')
                window.web3 = new Web3(new Web3.providers.WebsocketProvider('wss://infura.io/ws/v3/72e114745bbf4822b987489c119f858b'));
                // this.setState({web3})
            }
            const networkID = await web3.eth.net.getId();
            // this.setState({networkID: networkID})

           /* if (this.state.networkID === 56) {
                this.load_Hydro_Bsc(this.state.web3)
                //this.getGasPrice()
            } else if (this.state.networkID === 1) {
                this.load_Hydro_Eth(this.state.web3)
            } else {
                this.setState({wrongNetwork: 'This network is not supported yet. Please switch to Ethereum or Binance Smart Chain'})
            }*/


            window.ethereum.on('accountsChanged', function (accounts: string) {
                window.location.reload();
            })

            window.ethereum.on('chainChanged', function (netId: number) {
                window.location.reload();
            })

        } catch (error) {
            /*this.setState({
                loading: false
            })*/
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    }

    return (
        <div className={props.className}>
            <div className={s.selectNetwork}>
                <NetworkElement text={'From'}/>
                <div className={s.swapper}><FontAwesomeIcon icon={faArrowRightArrowLeft}/></div>
                <NetworkElement text={'To'}/>
            </div>
            <div className={s.amount}>
                <div className={s.headerAndBalance}>
                    <div>Amount</div>
                    <div>Balance: ?</div>
                </div>
                <div className={s.buttonIn}>
                    <input type="text" placeholder={'Enter amount'} value={inputValue}
                           onChange={e => setInputValue(e.currentTarget.value)}/>
                    <button>MAX</button>
                </div>

            </div>
            <div className={s.buttonsBlock}>
                <div>Amount Received</div>
                <button>Amount</button>
                <button onClick={onButtonClick}>{buttonText}</button>
            </div>
        </div>
    )
}

type PropsType = {
    className: string
}
declare let window: any;
