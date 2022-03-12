import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import axios from 'axios'
import { connect } from "@textile/tableland"
import React from 'react'


export default function Home() {
  const [address, setAddress] = React.useState('');
  const [mintedNFTs, setMintedNFTs] = React.useState([]);
  const [covalentData, setCovalentData] = React.useState([]);
  const [tableLandData, setTableLandData] = React.useState(null);

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

  const displayData = async () => {
    const covalent = "https://api.covalenthq.com/v1/1/address/" + address + "/transactions_v2/?quote-currency=USD&format=JSON&block-signed-at-asc=false&no-logs=false&key=" + process.env.NEXT_PUBLIC_COVALENT_API_KEY;
    const covalentRes = await axios.get(covalent);
    setCovalentData(covalentRes.data.data);
  };

  const displayTableLandData = async () => {
    displayData();
    const tbl = await connect({ network: "testnet" });

    const createRes = await tbl.create(
      `CREATE TABLE mytable (name text, id int, primary key (id));`
    );

    // `queryableName` will be the table name you chose with the
    // table id separated by and underscore 
    const queryableName = createRes.name;
    console.log(queryableName); // e.g. mytable_1

    const insertRes = await tbl.query(`INSERT INTO ${queryableName} (id, name) VALUES (0, '${JSON.stringify(covalentData)}');`);

    const queryRes = await tbl.query(`SELECT * FROM ${queryableName};`);
    setTableLandData(queryRes.data);
  };

  return (
    <div className={styles.container}>
      <h1>Blockchain Explorer</h1>
      <input type="text" placeholder="Enter an address" value={address} onChange={(e) => setAddress(e.target.value)} />
      <button onClick={mintNFT}>Claim Free NFT</button>
      <button onClick={displayTableLandData}>View my data</button>
      {
        tableLandData && JSON.stringify(tableLandData)
      }
      {
        covalentData && JSON.stringify(covalentData)
      }
    </div>
  )
}
