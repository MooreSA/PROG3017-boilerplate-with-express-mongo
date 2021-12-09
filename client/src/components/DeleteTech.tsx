import React, { useEffect } from "react";
import { useParams } from "react-router";
import { Link, useNavigate } from "react-router-dom";
import { Technology } from "../types/api";
import "./tech.scss";

const DeleteTech = ({ techs, setFeedback, setIsLoading }: Props) => {
  const { _id } = useParams();
  const nav = useNavigate();
  const tech = techs.find((t) => t._id === _id);

  const handleDelete = async () => {
    setIsLoading(true);
    const response = await fetch("http://localhost:8080/tech", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id }),
    });
    if (response.ok) {
      setFeedback("Technology deleted");
      setIsLoading(false);
      nav("/");
    } else {
      setFeedback("Error deleting technology");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setFeedback("");
  }, []);

  if (!tech)
    return (
      <div>
        <h1>Technology not found</h1>
        <Link to="/">Back to home</Link>
      </div>
    );

  return (
    <div className="tech">
      <h2>Delete Tech</h2>
      <p>Are you sure you want to delete this technology?</p>
      <div className="">{tech?.name}</div>
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
  techs: Technology[];
  setFeedback: Function;
  setIsLoading: Function;
}

export default DeleteTech;
