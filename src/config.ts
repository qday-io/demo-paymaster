export const SIMPLE_ACCOUNT_FACTORY = "0x91E60e0613810449d098b0b5Ec8b51A0FE8c8985" as `0x${string}`
export const ENTRYPOINT_ADDRESS = import.meta.env.VITE_ENTRYPOINT_ADDRESS as `0x${string}`
export const USD8_ADDRESS = import.meta.env.VITE_USD8_ADDRESS as `0x${string}`
export const USD8_PAYMASTER_ADDRESS = import.meta.env.VITE_USD8_PAYMASTER_ADDRESS as `0x${string}`
export const PRICE_ORACLE_ADDRESS = import.meta.env.VITE_PRICE_ORACLE_ADDRESS as `0x${string}`
export const USER_B_ADDRESS = import.meta.env.VITE_USER_B_ADDRESS as `0x${string}`
export const EXPLORER_URL = import.meta.env.VITE_EXPLORER_URL as string
export const BUNDLER_URL = import.meta.env.VITE_BUNDLER_URL as string
export const AMOY_RPC_URL = import.meta.env.VITE_AMOY_RPC_URL as string

export const USD8_DECIMALS = 6

export const SIMPLE_ACCOUNT_FACTORY_ABI = [
  {
    name: "getAddress",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "salt", type: "uint256" },
    ],
    outputs: [{ type: "address" }],
  },
] as const

export const USD8_ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "allowance",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "transfer",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "Transfer",
    type: "event",
    inputs: [
      { name: "from", type: "address", indexed: true },
      { name: "to", type: "address", indexed: true },
      { name: "value", type: "uint256", indexed: false },
    ],
  },
] as const

export const USD8_PAYMASTER_ABI = [
  {
    name: "getDeposit",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const

export const PRICE_ORACLE_ABI = [
  {
    name: "getPrice",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { name: "price", type: "uint256" },
      { name: "decimals", type: "uint8" },
    ],
  },
] as const
