import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import "./ComponentStyles.css"

export default function ClassBtn({course, onClick}) {
    return (
        <div className="ClassBtn" onClick={onClick}>
            <div style={{"fontSize": "1.5em", "fontWeight": "bold"}}>{course}</div>
        </div>
    )
}