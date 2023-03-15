import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Web3 from 'web3';

import RewardNFTAbi from "./ABI/NFTReward.json";

const RewardNFTAddress = "0x286BE428075C825E23a242d8B6484838A13E690a";

function Login() {
    const [isConnected, setWalletStatus] = useState(false);
    const [account, setAccount] = useState("")
    const [web3Obj, setWeb3Obj] = useState(null)
    const [rewardNFTObj, setRewardNFTObj] = useState(null)

    const navigate = useNavigate();

    useEffect(() => {
        const walletStatus = localStorage.getItem('isConnected');
        if (walletStatus) {
            setWalletStatus(true);
        }

        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length > 0) {
                const provider = new Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                signer.getAddress().then((address) => {
                    toast.success(`Connected to wallet: ${address}`);
                    setAccount(address);
                    setWalletStatus(true);
                    localStorage.setItem('isConnected', true);
                });
            } else {
                setWalletStatus(false);
                localStorage.removeItem('isConnected');
                navigate('/');
            }
        });

        // Listen for chain changes
        window.ethereum.on('chainChanged', () => {
            logout();
            window.location.reload();
        });
    }, [navigate]);

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const provider = new Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const address = await signer.getAddress();

                toast.success(`Connected to wallet: ${address}`);
                setAccount(address);
                setWalletStatus(true);
                localStorage.setItem('isConnected', true);
            } catch (error) {
                if (error.code === 4001) {
                    toast.error('User rejected connection request');
                } else {
                    toast.error('Error connecting to wallet');
                    console.error(error);
                }
            }
        } else {
            toast.error('No wallet detected');
        }
    };

    const logout = () => {
        setWalletStatus(false);
        localStorage.removeItem('isConnected');
        toast.error("Wallet Disconnected")
        navigate('/');
    };


    const signTypedDataV4Button = async () => {

        const msgParams = JSON.stringify({
            domain: {
                // Defining the chain aka Rinkeby testnet or Ethereum Main Net
                chainId: 97,
                // Give a user friendly name to the specific contract you are signing for.
                name: 'Hyperleague',
                // If name isn't enough add verifying contract to make sure you are establishing contracts with the proper entity
                verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
                // Just let's you know the latest version. Definitely make sure the field name is correct.
                version: '1',
            },

            // Defining the message signing data content.
            message: {

                message: 'By approving this signature, you are ',
                seller: {
                    wallet: '0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF',
                },
                to: {
                    name: 'Hyperleague Marketplace',
                    marketplaceContract: '0xB0B0b0b0b0b0B000000000000000000000000000',

                },
                nft: {
                    nftId: '1',
                    amount: '1',
                    price: '30',
                    listingType: 'Fixed Price'
                },
                timestamp: {
                    date: 1647292800
                }
            },
            // Refers to the keys of the *types* object below.
            primaryType: 'Details',
            types: {
                // TODO: Clarify if EIP712Domain refers to the domain the contract is hosted on
                EIP712Domain: [
                    { name: 'name', type: 'string' },
                    { name: 'version', type: 'string' },
                    { name: 'chainId', type: 'uint256' },
                    { name: 'verifyingContract', type: 'address' },
                ],
                // Refer to PrimaryType
                Details: [
                    { name: 'seller', type: 'seller' },
                    { name: 'to', type: 'contract' },
                    { name: 'message', type: 'string' },
                    { name: 'seller', type: 'seller' },
                    { name: 'nft', type: 'nft' },
                    { name: 'timestamp', type: 'timestamp' }
                ],
                seller: [
                    { name: 'wallet', type: 'address' }
                ],
                // Not an EIP712Domain definition
                contract: [
                    { name: 'name', type: 'string' },
                    { name: 'marketplaceContract', type: 'address' },
                ],
                nft: [
                    { name: 'nftId', type: 'uint256' },
                    { name: 'amount', type: 'uint256' },
                    { name: 'price', type: 'uint256' },
                    { name: 'listingType', type: 'string' },
                ],
                timestamp: [
                    { name: "date", type: 'uint256' }
                ]
            },
        });
        // let from = await Web3.eth.getAccounts();
        console.log("Account Address", account)
        console.log("message", msgParams)

        let params = [account, msgParams];
        let method = 'eth_signTypedData_v4';

        const signature = await window.ethereum.request({ method, params });

        console.log(
            JSON.stringify({
                address: account,
                msgParams: btoa(msgParams),
                signature,
            })
        )
}

//    const mintNft = async () => {
//        try {
//            let responce = await rewardNFTObj.methods.safeMint(account).send({from: account});
//            console.log(responce)
//        } catch (error) {
//            console.log(error)
//        }
//    }


return (
    <div className="main-div">
        <button onClick={isConnected ? logout : connectWallet}>
            {isConnected ? 'Disconnect Wallet' : 'Connect Wallet'}
        </button>
        <button disabled={isConnected ? false : true} onClick={signTypedDataV4Button}>sign typed data v4</button>
        <ToastContainer />
    </div>
);
}


export default Login;
