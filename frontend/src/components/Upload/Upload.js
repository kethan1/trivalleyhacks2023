import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import logo from '../../logo.png';
import Sidebar from "../Sidebar"
import '../../App.css';
import axios from "axios";

function Upload() {

  const [cards, setCards] = useState([]);
  const [currentCard, setCurrentCard] = useState(0);
  // function renderCards() {
  //   return cards.map((question, index) => (
  //     <div key={index}>
  //       <p>{question[0]}</p>
  //       <p>{question[1]}</p>
  //     </div>
  //   ));
  // }
  return (
    <div className="App">
      <Sidebar />
      {/* <CircularProgress /> */}
      <div className="Home-page">
        <div className="Header">
          <div className="Title">
            Coursify
          </div>
          <div className="Subtitle">
            Upload a pdf of textbooks
          </div>
        </div>
        <input
          style={{ display: "none" }}
          id="contained-button-file"
          type="file"
          onChange={uploadFile}
          accept="application/pdf"
        />
        <label htmlFor="contained-button-file">
          <Button variant="contained" color="primary" component="span">
            Upload
          </Button>
        </label>
        <br />
        <TextField inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />
        <p>{cards[currentCard]}</p>
      </div>        
    </div>
  );

  function uploadFile(event) {
    let file = event.target.files[0];
    console.log(file);

    if (file) {
      let data = new FormData();
      data.append('pdf', file);
      axios.post('http://127.0.0.1:5000/make_test', data, {
        'content-type': 'multipart/form-data'
      }).then((response) => {
        // console.log(response.data)
        setCards(response.data["response"])
        console.log(cards)
        // alert(response.data)
      });
    }
  }
}

export default Upload;