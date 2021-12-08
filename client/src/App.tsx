import React, { useState, useEffect } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import "./App.css";
import { Technology, Course } from "./types/api";
import Home from "./components/Home";
import AddTech from "./components/AddTech";
import DeleteTech from "./components/DeleteTech";
import EditTech from "./components/EditTech";
import DeleteCourse from "./components/DeleteCourse";
import EditCourse from "./components/EditCourse";
import AddCourse from "./components/AddCourse";

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
          <Route
            path=""
            element={
              <Home techs={techs} courses={courses} updateData={updateData} />
            }
          />
        </Route>
        <Route path="/tech" element={<Outlet />}>
          <Route
            path="add"
            element={<AddTech setFeedback={setFeedback} courses={courses} />}
          />
          <Route
            path="edit/:_id"
            element={
              <EditTech
                setFeedback={setFeedback}
                courses={courses}
                techs={techs}
              />
            }
          />
          <Route
            path="delete/:_id"
            element={<DeleteTech setFeedback={setFeedback} techs={techs} />}
          />
        </Route>
        <Route path="/course" element={<Outlet />}>
          <Route path="add" element={<AddCourse setFeedback={setFeedback} />} />
          <Route
            path="edit/:_id"
            element={<EditCourse setFeedback={setFeedback} courses={courses} />}
          />
          <Route
            path="delete/:_id"
            element={
              <DeleteCourse courses={courses} setFeedback={setFeedback} />
            }
          />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
