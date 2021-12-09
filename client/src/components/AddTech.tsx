import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Course } from "../types/api";
import "./tech.scss";

const AddTech = ({ courses, setFeedback, setIsLoading }: Props) => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [difficulty, setDifficulty] = useState<number>(1);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleCheckboxChange = (course: Course) => {
    // if the course is already selected, remove it
    if (selectedCourses.includes(course)) {
      setSelectedCourses(selectedCourses.filter((c) => c !== course));
    } else {
      // otherwise add it
      setSelectedCourses([...selectedCourses, course]);
    }
  };

  const formIsValid = () => {
    if (name.length === 0 || name.length > 50) {
      setError("Name must be between 1 and 50 characters");
      return false;
    } else if (description.length === 0 || description.length > 500) {
      setError("Description must be between 1 and 500 characters");
      return false;
    } else if (difficulty < 1 || difficulty > 5) {
      setError("Difficulty must be between 1 and 5");
      return false;
    } else if (selectedCourses.length === 0) {
      setError("You must select at least one course");
      return false;
    }
    setError("");
    return true;
  };

  const submitForm = async () => {
    const response = await fetch("http://localhost:8080/tech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description,
        difficulty,
        courses: selectedCourses.map((c) => {
          return {
            name: c.name,
            code: c.code,
          };
        }),
      }),
    });
    if (response.ok) {
      setFeedback("Tech added successfully");
      navigate("/");
    } else {
      setFeedback("Error adding tech");
    }
  };

  const handleSubmit = async () => {
    if (formIsValid()) {
      setIsLoading(true);
      await submitForm();
      setIsLoading(false);
      navigate("/");
    }
  };

  useEffect(() => {
    setFeedback("");
  }, []);

  return (
    <div className="tech">
      <h2>Add Tech</h2>
      <div className="form__error">{error}</div>
      <div className="tech__form">
        <div className="form__input-wrap">
          <label className="form__label" htmlFor="name">
            Name:
          </label>
          <input
            className="form__input"
            type="text"
            name="name"
            placeholder="Name"
            maxLength={50}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form__input-wrap">
          <label className="form__label" htmlFor="description">
            Description:
          </label>
          <textarea
            className="form__text-area"
            name="description"
            value={description}
            maxLength={500}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="form__input-wrap">
          <label className="form__label" htmlFor="course">
            Difficulty:
          </label>
          <select
            className="form__select"
            name="difficulty"
            value={difficulty}
            onChange={(e) => {
              setDifficulty(parseInt(e.target.value));
            }}
          >
            <option className="form__option" value="1">
              1
            </option>
            <option className="form__option" value="2">
              2
            </option>
            <option className="form__option" value="3">
              3
            </option>
            <option className="form__option" value="4">
              4
            </option>
            <option className="form__option" value="5">
              5
            </option>
          </select>
        </div>
        <div className="form__input-wrap">
          <span className={"form__label"}>Used in Courses</span>
          {courses.map((course: Course, i) => {
            return (
              <div className="form__check-wrap" key={`course-wrap-${i}`}>
                <input
                  className="form__check"
                  type="checkbox"
                  name="course"
                  id={`course-${i}`}
                  value={course._id}
                  onChange={() => handleCheckboxChange(course)}
                />{" "}
                <label className="form__label" htmlFor={`course-${i}`}>
                  {course.name}
                </label>
              </div>
            );
          })}
        </div>
        <div className="form__button-wrap">
          <button className="form__button" type="submit" onClick={handleSubmit}>
            Add Tech
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
  courses: Course[];
  setFeedback: Function;
  setIsLoading: Function;
}

export default AddTech;
