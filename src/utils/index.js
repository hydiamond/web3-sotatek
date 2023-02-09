import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import {NETWORK_URLS, WALLETCONNECT_BRIDGE_URL} from "../constant";

export const injected = new InjectedConnector({
    supportedChainIds: [137, 80001],
});

export const walletConnectConnector = new WalletConnectConnector({
    supportedChainIds: [137, 80001],
    rpc: NETWORK_URLS,
    bridge: WALLETCONNECT_BRIDGE_URL,
    qrcode: true,
});
