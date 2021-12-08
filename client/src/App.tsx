import React, { useState, useEffect } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import "./App.css";
import { Technology, Course } from "./types/api";
import Home from "./components/Home";
import AddTech from "./components/AddTech";
import DeleteTech from "./components/DeleteTech";
import EditTech from "./components/EditTech";

const App = () => {
  const [techs, setTechs] = useState<Technology[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [feedback, setFeedback] = useState<string>("");

  const updateData = async () => {
    const response = await fetch("http://localhost:8080/get", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setTechs(data.technologies);
    setCourses(data.courses);
  };

  useEffect(() => {
    updateData();
  }, []);

  return (
    <div>
      <h1>Tech Roster Administration</h1>
      <span className="feedback">{feedback}</span>
      <Routes>
        <Route path="/" element={<Outlet />}>
          <Route path="" element={<Home techs={techs} courses={courses} />} />
        </Route>
        <Route path="/tech" element={<Outlet />}>
          <Route
            path="add"
            element={
              <AddTech
                setFeedback={setFeedback}
                courses={courses}
                updateData={updateData}
              />
            }
          />
          <Route
            path="edit/:_id"
            element={
              <EditTech
                setFeedback={setFeedback}
                courses={courses}
                techs={techs}
                updateData={updateData}
              />
            }
          />
          <Route
            path="delete/:_id"
            element={<DeleteTech setFeedback={setFeedback} techs={techs} />}
          />
        </Route>
        <Route path="/course" element={<Outlet />}>
          <Route path="add" element={<p>Add</p>} />
          <Route path="edit/:_id" element={<p>Edit</p>} />
          <Route path="delete/:_id" element={<p>Delete</p>} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
