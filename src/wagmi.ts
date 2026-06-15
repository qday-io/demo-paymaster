import { createConfig, http } from "wagmi"
import { polygonAmoy } from "wagmi/chains"
import { injected } from "wagmi/connectors"
import { AMOY_RPC_URL } from "./config"

export const config = createConfig({
  chains: [polygonAmoy],
  connectors: [injected()],
  transports: {
    [polygonAmoy.id]: http(AMOY_RPC_URL),
  },
})
