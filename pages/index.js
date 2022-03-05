import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

const mintNFT = () => {
  
};

export default function Home() {
  return (
    <div className={styles.container}>
      <h1>Blockchain Explorer</h1>
      <button onClick={mintNFT}>Claim Free NFT</button>
    </div>
  )
}
