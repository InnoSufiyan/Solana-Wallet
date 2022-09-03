import {
  ConnectionProvider,
  WalletProvider,
  useAnchorWallet,
} from '@solana/wallet-adapter-react'
import {
  WalletAdapterNetwork,
  WalletNotConnectedError,
} from '@solana/wallet-adapter-base'
import {
  WalletModalProvider,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import React, { FC, ReactNode, useMemo, useState } from 'react'
import './App.css'
import '@solana/wallet-adapter-react-ui/styles.css'
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Program, AnchorProvider, web3, BN } from '@project-serum/anchor'

function App() {
  return (
    <Context>
      <Content />
    </Context>
  )
}

export default App

const Context: FC<{ children: ReactNode }> = ({ children }) => {
  // const network = WalletAdapterNetwork.Devnet;
  // const endpoint = useMemo(() => clusterApiUrl(network), [network])
  // const endpoint = 'localhost:8899' // local cluster override

  const network = WalletAdapterNetwork.Devnet

  const endpoint = useMemo(() => clusterApiUrl(network), [network])

  const wallets = useMemo(() => [new PhantomWalletAdapter()], [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

const Content: FC = () => {
  const [userSOLBalance, setSOLBalance] = useState<any>()
  const wallet = useAnchorWallet()

  const network = WalletAdapterNetwork.Devnet

  const connection = new Connection(clusterApiUrl(network))

  if (wallet?.publicKey) {
    const SOL = connection.getAccountInfo(wallet.publicKey)
    SOL.then((res) => setSOLBalance(res && res.lamports / LAMPORTS_PER_SOL))
  }
  console.log(userSOLBalance)

  return (
    <div className="container">
      <div className="wrapper">
        <h1 className="title">Click here to connect Your Wallet</h1>
        {/* <button className="button">Wallet Connection</button> */}
        <WalletMultiButton className="button" />
        {userSOLBalance && (
          <>
            <h1 className="title">Your Balance</h1>
            <button className="button">{userSOLBalance} Sol</button>
          </>
        )}
      </div>
    </div>
  )
}
