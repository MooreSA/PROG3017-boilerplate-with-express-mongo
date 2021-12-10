import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Course } from "../types/api";

const AddCourse = ({ setFeedback, setIsLoading }: Props) => {
  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [error, setError] = useState("");
  const nav = useNavigate();

  const formIsValid = () => {
    if (courseName.length === 0 || courseName.length > 50) {
      setError("Course name must be between 1 and 50 characters");
      return false;
    } else if (courseCode.length === 0 || courseCode.length > 50) {
      setError("Course code must be between 1 and 50 characters");
      return false;
    }
    setError("");
    return true;
  };

  const submitForm = async () => {
    const response = await fetch("/course", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: courseName,
        code: courseCode,
      }),
    });
    if (response.ok) {
      setFeedback("Course added successfully");
      nav("/");
    } else {
      setFeedback("Error adding course");
    }
  };

  const handleSubmit = async () => {
    if (formIsValid()) {
      setIsLoading(true);
      submitForm();
      setIsLoading(false);
    }
  };

  return (
    <div className="tech">
      <h2>Add Course</h2>
      <div className="form__error">{error}</div>
      <div className="tech__form">
        <div className="tech__input-wrap">
          <label htmlFor="code" className="form__lable">
            Code:
          </label>
          <input
            type="text"
            name="code"
            placeholder="Course Code"
            maxLength={50}
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            className="form__input"
          />
        </div>
        <div className="form__input-wrap">
          <label htmlFor="name" className="form__label">
            Name:
          </label>
          <input
            type="text"
            name="name"
            placeholder="Course Name"
            maxLength={50}
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            className="form__input"
          />
        </div>
        <div className="form__button-wrap">
          <button className="form__button" onClick={handleSubmit} type="submit">
            Add Course
          </button>
          <Link to="/" className="form__button form__button--green">
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

interface Props {
  setFeedback: (feedback: string) => void;
  setIsLoading: Function;
}

export default AddCourse;
