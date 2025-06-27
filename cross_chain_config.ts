// 首先定义值的类型
interface ChainConfig {
    name: string;
    chainId: number;
    router: string;
    linkToken: string;
}

const crossChainConfig: Record<string, ChainConfig> = {
    eth_sepolia: {
        name: "Ethereum Sepolia",
        chainId: 11155111,
        router: "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59",
        linkToken: "0x779877A7B0D9E8603169DdbD7836e478b4624789"
    },
    avax_fuji: {
        name: "Avalanche Fuji",
        chainId: 43113,
        router: "0xF694E193200268f9a4868e4Aa017A0118C9a8177",
        linkToken: "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846"
    }
}

export default crossChainConfig