import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { Course } from "../types/api";

const DeleteCourse = ({ courses, setFeedback }: Props) => {
  const { _id } = useParams();
  const course = courses.find((c: Course) => c._id === _id);
  const nav = useNavigate();

  const handleDelete = async () => {
    const response = await fetch("http://localhost:8080/course", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id }),
    });
    if (response.ok) {
      setFeedback("Course Delete Successful");
      nav("/");
    } else {
      setFeedback("Course Delete Failed");
      nav("/");
    }
  };

  useEffect(() => {
    setFeedback("");
  }, []);

  if (!course) {
    return (
      <div>
        <h1>Course not found</h1>
        <Link className="tech__button tech__buttuon--cancel" to="/">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="tech">
      <h2>Delete Course</h2>
      <p>Are you sure you want to delete this course?</p>
      <div className="">{course?.name}</div>
      <div className="tech__button-wrap">
        <button
          onClick={handleDelete}
          className="tech__button tech__button--confirm"
        >
          Delete
        </button>
        <Link to="/" className="tech__button tech__button--cancel">
          Cancel
        </Link>
      </div>
    </div>
  );
};

interface Props {
  courses: Course[];
  setFeedback: (feedback: string) => void;
}

export default DeleteCourse;
