// src/AppKitConfig.ts (or wherever you prefer to configure it)
import "@walletconnect/react-native-compat";

import { createAppKit, bitcoin, solana, type AppKitNetwork } from '@reown/appkit-react-native';
import { EthersAdapter } from '@reown/appkit-ethers-react-native';

// You can use 'viem/chains' or define your own chains using `AppKitNetwork` type. Check Options/networks for more detailed info
import { mainnet, polygon } from 'viem/chains';
import Custom_storage from "./CustomStorge";

const projectId = '1f6912239d8c23db5270c37354ccec7f'; // Obtain from https://dashboard.reown.com/

const ethersAdapter = new EthersAdapter();

export const appKit = createAppKit({
    projectId,
    networks: [mainnet, polygon],
    defaultNetwork: mainnet, // Optional: set a default network
    adapters: [ethersAdapter],
    storage: Custom_storage,
    // Other AppKit options (e.g., metadata for your dApp)
    metadata: {
        name: 'onliq',
        description: 'onliq',
        url: 'https://onliq.com',
        icons: ['https://onliq.com/icon.png'],
        redirect: {
            native: "onliq://",
            universal: "onliq.com",
        },
    }
});