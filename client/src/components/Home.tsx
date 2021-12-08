import React from "react";
import { Link } from "react-router-dom";
import { Technology, Course } from "../types/api";
import "./home.scss";

const Home = ({ techs, courses }: HomeProps) => {
  return (
    <div>
      <h2>Home</h2>
      <div className="home">
        <div className="techs">
          <h2 className="techs__title">Technologies</h2>
          <ul className="techs__list">
            <li className="techs__add">
              <Link to="tech/add">Add Tech</Link>
            </li>
            {techs.map((tech: Technology) => {
              return (
                <li className="tech">
                  <Link to={`tech/edit/${tech._id}`}>Edit</Link>
                  <Link to={`tech/delete/${tech._id}`}>Delete</Link>
                  <h3 className="tech__name">{tech.name}</h3>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="courses">
          <h2 className="courses__title">Courses</h2>
          <ul className="courses__list">
            <li className="courses__add">
              <Link to="course/add">Add Course</Link>
            </li>
            {courses.map((course: Course) => {
              return (
                <div className="course" key={course._id}>
                  <Link to={`course/edit/${course._id}`}>Edit</Link>
                  <Link to={`course/delete/${course._id}`}>Delete</Link>
                  <h3 className="course__title">{course.name}</h3>
                </div>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

interface HomeProps {
  techs: Technology[];
  courses: Course[];
}

export default Home;
