import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate, useParams } from "react-router";
import { Course, Technology } from "../types/api";

const EditTech = ({ setFeedback, courses, techs, setIsLoading }: Props) => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [difficulty, setDifficulty] = useState<number>(1);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();
  const { _id } = useParams();

  const tech = techs.find((t) => t._id === _id);

  const handleCheckboxChange = (course: Course) => {
    // if the box is checked, add the course to the list of selected courses
    if (selectedCourses.find((c) => c.name === course.name)) {
      setSelectedCourses(selectedCourses.filter((c) => c.name !== course.name));
    } else {
      setSelectedCourses([
        ...selectedCourses,
        { name: course.name, code: course.code },
      ]);
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
    const response = await fetch("/tech", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id,
        name,
        description,
        difficulty,
        courses: selectedCourses.map((c) => {
          return {
            code: c.code,
            name: c.name,
          };
        }),
      }),
    });
    if (response.ok) {
      setFeedback("Technology updated successfully");
      navigate("/");
    } else {
      setFeedback("Error updating technology");
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
    if (tech === undefined) {
      setFeedback("Technology not found");
    } else {
      setName(tech.name);
      setDescription(tech.description);
      setDifficulty(tech.difficulty);
      setSelectedCourses(
        tech.courses.map((c) => {
          return { name: c.name, code: c.code };
        })
      );
    }
  }, [tech]);

  const courseMatches = (course: Course) => {
    return selectedCourses.some((c) => c.name === course.name);
  };

  return tech ? (
    <div className="tech">
      <h2>Edit Tech</h2>
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
          {courses.map((course: Course, i) => (
            <div className="form__check-wrap" key={`course-wrap-${i}`}>
              <input
                className="form__check"
                type="checkbox"
                name="course"
                checked={courseMatches(course)}
                id={`course-${i}`}
                value={course._id}
                onChange={() => handleCheckboxChange(course)}
              />{" "}
              <label className="form__label" htmlFor={`course-${i}`}>
                {course.name}
              </label>
            </div>
          ))}
        </div>
        <div className="form__button-wrap">
          <button className="form__button" type="submit" onClick={handleSubmit}>
            Edit Tech
          </button>
          <Link to="/" className="form__button form__button--green">
            Cancel
          </Link>
        </div>
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

interface Props {
  setFeedback: Function;
  setIsLoading: Function;
  courses: Course[];
  techs: Technology[];
}

export default EditTech;
