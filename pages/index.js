import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import axios from 'axios'


export default function Home() {
  const [address, setAddress] = React.useState('');
  const [mintedNFTs, setMintedNFTs] = React.useState([]);

  const mintNFT = async () => {
    if (!address) {
      alert('Please enter an address')
      return
    }

    const nftPortApiKey = process.env.NEXT_PUBLIC_NFT_PORT_API_KEY;
    const urlToMint = "https://api.nftport.xyz/v0/mints/easy/urls";

    const body = {
      "chain": "rinkeby",
      "name": "Explorer NFT",
      "description": "An NFT for Explorer users",
      "file_url": "https://images.pexels.com/photos/187041/pexels-photo-187041.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
      "mint_to_address": address
    };

    const auth = {
        headers: {
          Authorization: nftPortApiKey
        }
    };

    const res = await axios.post(urlToMint, body, auth);
    console.log(res.data.transaction_external_url);
    setMintedNFTs([...mintedNFTs, res.data.transaction_external_url]);
  };  

  return (
    <div className={styles.container}>
      <h1>Blockchain Explorer</h1>
      <input type="text" placeholder="Enter an address" value={address} onChange={(e) => setAddress(e.target.value)} />
      <button onClick={mintNFT}>Claim Free NFT</button>
    </div>
  )
}
