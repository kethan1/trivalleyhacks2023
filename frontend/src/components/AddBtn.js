import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Fab from '@mui/material/Fab';
// import AddIcon from '@mui/icons-material/Add';
import AddIcon from '@material-ui/icons/'
import "./ComponentStyles.css"

export default function AddBtn() {
  let navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function openModel() {
    navigate('upload');
  }
  return (
    <div style={{ color: "#FFFFF", "fontSize": "0.8em", "fontWeight": "bold" }}>
      <div className="AddBtn" onClick={() => { handleClickOpen() }}>
        +
        <br />
        Add Class
      </div>

      <SimpleDialog
        open={open}
        onClose={handleClose}
      />
    </div>
  )
}

function SimpleDialog(props) {
  const { onClose, selectedValue, open } = props;
  const valueRef = useRef("");

  const handleClose = () => {
    onClose();
  };

  const handleAddClass = () => {
    let newClassName = valueRef.current.value;

    let courseData = JSON.parse(localStorage.getItem("courseData"));
    if (courseData == null) {
      courseData = {};
    }
    courseData[newClassName] = {"flashcards": []};
    localStorage.setItem("courseData", JSON.stringify(courseData))

    let courses = JSON.parse(localStorage.getItem("courses"));
    if (courses == null) {
      localStorage.setItem("courses", JSON.stringify([]));
      courses = [];
    }

    

    if (newClassName === "" || courses.includes(newClassName)) {
      return;
    }

    courses.push(newClassName);
    localStorage.setItem("courses", JSON.stringify(courses));
    window.dispatchEvent(new Event("coursesUpdated"));
  



    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <div style={{ paddingRight: "50px", paddingLeft: "50px", paddingTop: "30px", paddingBottom: "50px" }}>
        <h1 style={{ paddingBottom: "20px", fontSize: 40 }}>Add Class</h1>
        <TextField style={{ paddingRight: "15px" }} inputRef={valueRef} id="class-name-field" label="Class Name" variant="outlined" />
        <Fab onClick={handleAddClass} color="primary" aria-label="add">
          {/* <AddIcon /> */}
          <p style={{ fontSize: "2.25em" }}>+</p>
        </Fab>
      </div>
    </Dialog>
  );
}