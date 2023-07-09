import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useDropzone } from 'react-dropzone';
import pdfjs from 'pdfjs-dist';
import axios from "axios";
import Sidebar from "../Sidebar"
import ClassBtn from "../ClassBtn"
import AddBtn from '../AddBtn';
import logo from '../../logo.svg';
import '../../App.css';
import ReactCardFlip from 'react-card-flip';

function Course({ course }) {
    let { courseName } = useParams();

    const [flashcards, setFlashcards] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [flip, setFlip] = useState(false);
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        // let courseData = {"Calculus": {"flashcards": [{"question": "What dog is it?", "answer": "Teddy dog.", "bin": 1, "timeLastReviewed": new Date()}]}}
        // localStorage.setItem("courseData", JSON.stringify(courseData))
        let courseData = JSON.parse(localStorage.getItem("courseData"));
        if (courseData[courseName] == null) {
            courseData[courseName] = { "flashcards": [] };
            localStorage.setItem("courseData", JSON.stringify(courseData))
        }
        try {
            setFlashcards(courseData[courseName].flashcards);
        } catch {
            setFlashcards(null);
        }
    }, [])

    const [selected, setSelected] = useState('flashcard');
    const [currentBin, setCurrentBin] = useState(1);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fileUploaded, setFileUploaded] = useState(false);
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({ multiple: false });

    const handleChange = (event, newSelected) => {
        if (newSelected) {
            setSelected(newSelected);
        }
    };

    function submitFile() {
        let file = acceptedFiles[0];

        if (file) {
            let data = new FormData();
            data.append('pdf', file);
            axios.post('http://127.0.0.1:5000/read', data, {
                'content-type': 'multipart/form-data'
            }).then((response) => {
                console.log(response.data["response"]);
                let data = response.data;
                let new_flashcards = [];
                for (let raw_flashcard of data["response"]) {
                    let answer = raw_flashcard["answer"];
                    let question = raw_flashcard["question"];
                    new_flashcards.push({
                        "question": question,
                        "answer": answer,
                        "timeLastReviewed": new Date(),
                        "bin": 1,
                    });
                }
                console.log(new_flashcards);
                setFlashcards(flashcards => [...flashcards, ...new_flashcards]);
                let currentData = JSON.parse(localStorage.getItem("courseData"));
                currentData[courseName].flashcards = new_flashcards;
                localStorage.setItem("courseData", JSON.stringify(currentData))
            });
            // axios.post('http://127.0.0.1:5000/make_test', data, {
            //     'content-type': 'multipart/form-data'
            // }).then((response) => {
            //     console.log("practice test:")
            // });
        }
    }

    function nextFlashcard() {
        setFlashcards((flashcards) => flashcards.filter((_, index) => index !== 0));
        console.log(flashcards)
    }

    function getFlashcardsInBin(bin) {
        let flashcardLoaded = JSON.parse(localStorage.getItem("courseData"))[courseName].flashcards;

        return flashcardLoaded.filter((flashcard) => flashcard.bin == bin);
    }

    function getNextFlashcard() {
        let currentFlashcardsBins = getFlashcardsInBin(currentBin);
        setCurrentIndex(currentIndex + 1);
        if (currentIndex >= currentFlashcardsBins.length - 1) {
            if (getFlashcardsInBin(currentBin + 1).length == 0) {
                setFinished(true);
                return;
            }
            setCurrentBin(currentBin + 1);
            setCurrentIndex(0);
        }

        let currentFlashcard = currentFlashcardsBins[currentIndex];

        if (currentFlashcard.timeLastReviewed != null) {
            if (currentBin !== 1) {
                const millisecondsPerDay = 86400000;
                const dayLastReviewed = Math.floor((Date.now() - currentFlashcard.timeLastReviewed) / millisecondsPerDay);
            }
        }

        currentFlashcard.timeLastReviewed = Date.now();
    }

    function correctAnswer() {
        getFlashcardsInBin(currentBin)[currentIndex].bin = currentBin + 1;

        // let courseData = JSON.parse(localStorage.getItem("courseData"));
        // courseData[courseName].flashcards = flashcards;

        // localStorage.setItem("courseData", JSON.stringify(courseData));

        getNextFlashcard();
        setFlip(false);
    }

    function incorrectAnswer() {
        getFlashcardsInBin(currentBin)[currentIndex].bin = 1;

        // let courseData = JSON.parse(localStorage.getItem("courseData"));
        // courseData[courseName].flashcards = flashcards;

        // localStorage.setItem("courseData", JSON.stringify(courseData));

        getNextFlashcard();
        setFlip(false);
    }

    if (isLoading) {
        return (<div></div>)
    }
    return (
        <div className="App">
            <Sidebar />
            <div className="Home-page App-center">
                <div className="Header" style={{ "display": "flex", "flexDirection": "column" }}>
                    <div className="Title">
                        {courseName}
                    </div>
                    <div style={{ "display": "flex" }}>
                        <div className="Subtitle" style={{ "paddingBottom": "1rem", "color": "gray" }}>
                            Your next test:
                        </div>
                        <div>

                        </div>
                    </div>
                    <div className="Button-container">
                        <ToggleButtonGroup
                            color="success"
                            value={selected}
                            exclusive
                            onChange={handleChange}
                            aria-label="Platform"
                        >
                            <ToggleButton value="textbook">Upload Textbook Excerpt</ToggleButton>
                            <ToggleButton value="flashcard">Flashcard Practice</ToggleButton>
                            <ToggleButton value="test">Practice Test</ToggleButton>
                        </ToggleButtonGroup>
                    </div>

                    <div>
                        {selected == "textbook" ?
                            <div className="Course-selection-div">
                                <div style={{ background: "#c8e4e2", padding: "20px", borderRadius: "20px", borderWidth: 3, borderStyle: 'dashed', borderColor: '#506450', }} {...getRootProps({ className: 'dropzone' })}>
                                    <input {...getInputProps()} type="file"
                                        accept="application/pdf" />
                                    <p>
                                        {
                                            acceptedFiles.length == 0 ? "Drag and drop some files here, or click to select files" : `File Uploaded: ${acceptedFiles[0].path}`
                                        }
                                    </p>
                                </div>
                                <br />
                                <Button disabled={acceptedFiles.length == 0} variant="contained" color="primary" onClick={submitFile}>Submit</Button>
                            </div>
                            : null}

                        {selected == "flashcard" ?
                            <div className="Course-selection-div">
                                {flashcards && flashcards.length > 0 ?
                                    finished ? <div><h1>Finished</h1><Button onClick={() => { console.log(1); setCurrentIndex(0); setCurrentBin(0); setFinished(false); }} style={{ fontSize: 20 }} variant="text">↻ Restart Studying</Button></div> : <div>
                                        <ReactCardFlip isFlipped={flip}
                                            flipDirection="vertical">
                                            <div className="Flashcard">
                                                <div style={{ "padding": "2rem" }}>
                                                    <h3>Question</h3>
                                                    {getFlashcardsInBin(currentBin)[currentIndex].question}
                                                </div>
                                            </div>
                                            <div className="Flashcard">
                                                <div style={{ "padding": "2rem" }}>
                                                    <h3>Answer</h3>
                                                    {getFlashcardsInBin(currentBin)[currentIndex].answer}
                                                </div>
                                            </div>
                                        </ReactCardFlip>
                                        <div className="Flashcard-options">
                                            <div onClick={() => incorrectAnswer()} className="Circle-btn">
                                                X
                                            </div>
                                            <div onClick={() => setFlip(!flip)} className="Flip-btn">
                                                Flip Card
                                            </div>
                                            <div onClick={() => correctAnswer()} className="Circle-btn">
                                                O
                                            </div>
                                        </div>
                                    </div>
                                    : <div>Click on "UPLOAD TEXTBOOK EXCERPT to begin!</div>}

                            </div>
                            : null}

                        {selected == "test" ?
                            <div className="Course-selection-div">
                                <div className="Subtitle">
                                    Practice test here!
                                </div>
                            </div>
                            : null}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Course;
