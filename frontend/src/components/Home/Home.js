import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import axios from "axios";
import Sidebar from "../Sidebar"
import ClassBtn from "../ClassBtn"
import AddBtn from '../AddBtn';
import logo from '../../logo.png';
import '../../App.css';

function Home() {
  const [render, reRender] = useState(false);
  const navigate = useNavigate();

  let courses = JSON.parse(localStorage.getItem("courses"));
  let sidebarData = [];
  if (courses != null) {
    sidebarData = courses.map(course => {
      return {
        title: course,
        link: `/course/${course}`
      }
    });
  }

  const updateComponent = () => {
    reRender(!render);
  }

  window.addEventListener('coursesUpdated', () => {
    reRender(!render);
  });

  return (
    <div className="App">
      <Sidebar />
      <div className="Home-page">
        <div className="Header">
          <div className="Title">
            StudySmart
            {/* <img src= "https://th.bing.com/th/id/OIG.A9zCuHQKb9.VbDlK1GjJ?pid=ImgGn"/> */}
          </div>
          <div className="Subtitle">
            What are you studying today?
          </div>
        </div>
        <div className="Course-list">
          <AddBtn />
          {
            sidebarData.map(
              course => <ClassBtn course={course.title} onClick={() => {
                navigate(course.link)
              }} />)
          }
          
        </div>
        
      </div>
    </div>
  );
}

export default Home;


// <!-- Display a list of courses -->
// <ul id="courses-list">
//     {% for course in courses %}
//         <li>
//             {{ course.name }}
//             <button class="delete-course" data-course-id="{{ course.id }}">Delete</button>
//         </li>
//     {% endfor %}
// </ul>

// <!-- Include jQuery -->
// <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

// <!-- Send a DELETE request to the server when a delete button is clicked -->
// <script>
//     $(document).ready(function() {
//         $('.delete-course').click(function() {
//             var courseId = $(this).data('course-id');
//             $.ajax({
//                 url: '/delete_course/' + courseId,
//                 type: 'DELETE',
//                 success: function(result) {
//                     // Remove the course from the list
//                     $(this).parent().remove();
//                 }
//             });
//         });
//     });
// </script>