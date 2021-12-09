import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Technology, Course } from "../types/api";
import "@fortawesome/fontawesome-free/css/all.css";

import "./home.scss";

const Home = ({ techs, courses, updateData }: HomeProps) => {
  useEffect(() => {
    updateData();
  }, []);
  return (
    <div>
      <h2>Home</h2>
      <div className="home">
        <div className="techs">
          <h2 className="techs__title">Technologies</h2>
          <div className="techs__list">
            <div className="techs__add">
              <Link
                style={{ marginRight: "10px" }}
                className="fas fa-plus-square"
                to="tech/add"
              />
              <Link to="tech/add">Add Course</Link>
            </div>
            {techs.map((tech: Technology, i) => {
              return (
                <div className="tech__item" key={`tech-item-${i}`}>
                  <Link
                    className="fas fa-pen-square"
                    style={{ margin: "0 10px 0px 0px" }}
                    to={`tech/edit/${tech._id}`}
                  />
                  <Link
                    style={{ margin: "0 10px 0px 0px" }}
                    className="fas fa-minus-square"
                    to={`tech/delete/${tech._id}`}
                  />
                  <h3 className="tech__name">{tech.name}</h3>
                </div>
              );
            })}
          </div>
        </div>
        <div className="courses">
          <h2 className="courses__title">Courses</h2>
          <div className="courses__list">
            <div className="courses__add">
              <Link
                style={{ marginRight: "10px" }}
                className="fas fa-plus-square"
                to="course/add"
              />
              <Link to="course/add">Add Course</Link>
            </div>
            {courses.map((course: Course) => {
              return (
                <div className="course" key={course._id}>
                  <Link
                    className="fas fa-pen-square"
                    style={{ marginRight: "10px" }}
                    to={`course/edit/${course._id}`}
                  />
                  <Link
                    className="fas fa-minus-square"
                    style={{ marginRight: "10px" }}
                    to={`course/delete/${course._id}`}
                  />
                  <h3 className="course__title">{course.name}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

interface HomeProps {
  techs: Technology[];
  courses: Course[];
  updateData: Function;
}

export default Home;
