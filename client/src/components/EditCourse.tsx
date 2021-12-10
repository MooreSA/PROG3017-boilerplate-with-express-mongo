import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { Course } from "../types/api";

const EditCourse = ({ setFeedback, courses, setIsLoading }: Props) => {
  const { _id } = useParams();
  const nav = useNavigate();
  const [error, setError] = useState<string>("");
  const [courseName, setCourseName] = useState<string>("");
  const courseCode = useRef<string>("");
  const course = courses.find((c) => c._id === _id);

  const formIsValid = () => {
    if (courseName.length === 0 || courseName.length > 100) {
      setError("Course name must be between 1 and 100 characters");
      return false;
    }
    if (!course) {
      setError("Course not found");
      return false;
    }
    setError("");
    return true;
  };

  const submitForm = async () => {
    const response = await fetch("/course", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id,
        code: courseCode.current,
        name: courseName,
      }),
    });
  };

  const handleSubmit = async () => {
    if (formIsValid()) {
      setIsLoading(true);
      await submitForm();
      setIsLoading(false);
      nav("/");
    }
  };

  useEffect(() => {
    if (!course) {
      setFeedback("Course Not Found");
    } else {
      setFeedback("");
      setCourseName(course.name);
      courseCode.current = course.code;
    }
  }, [course]);

  return course ? (
    <div className="tech">
      <h2>Edit Course</h2>
      <div className="form__error">{error}</div>
      <div className="tech__form">
        <div className="form__input-wrap">
          <label htmlFor="code" className="form__label">
            Course Code
          </label>
          <input
            type="text"
            className="form__input"
            disabled
            name="code"
            value={course.code}
          />
        </div>
        <div className="form__input-wrap">
          <label htmlFor="name" className="form__label">
            Name:
          </label>
          <input
            type="text"
            name="name"
            className="form__input"
            maxLength={50}
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
          />
        </div>
        <div className="form__button-wrap">
          <button className="form__button" type="submit" onClick={handleSubmit}>
            Edit Course
          </button>

          <Link to="/" className="form__button form__button--green">
            Cancel
          </Link>
        </div>
      </div>
    </div>
  ) : (
    <div>Loading ...</div>
  );
};

interface Props {
  setFeedback: (feedback: string) => void;
  setIsLoading: Function;
  courses: Course[];
}

export default EditCourse;
