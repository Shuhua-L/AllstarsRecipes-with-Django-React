import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { BACKEND_BOX } from "../constants/constants";
import Message from "../components/Message";

const CreateBoxPage = () => {
  const navigate = useNavigate();

  /*
   * States
   */
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  /*
   * Handlers
   */
  // Submit form: create a new box
  const handleSubmit = (event) => {
    event.preventDefault();

    const prev = JSON.parse(sessionStorage.getItem("userBoxes"));
    const index = prev.findIndex((box) => box.title === title);

    if (index !== -1) {
      // Input title already exists
      setMessage(`Box '${title}' already exists.`);

      // Create a new box
    } else {
      // Fetch POST request
      const fetchPOST = async () => {
        const response = await fetch(BACKEND_BOX, {
          method: "POST",
          body: JSON.stringify({
            title: title,
            // description: description,
          }),
        });
        const body = await response.json();
        return body;
      };

      fetchPOST().then((data) => {
        // Update session storage
        prev.push(data);
        sessionStorage.setItem("userBoxes", JSON.stringify(prev));

        const boxTitle = data.title.replace(/\s+/g, "-").toLowerCase();

        // redirect to box page
        navigate(`/my-recipes/list/${boxTitle}`, { state: { id: data.id } });
      });
    }
  };

  /*
   * Render HTML
   */
  return (
    <>
      <Message message={message} />

      <div className="container px-4 py-5">
        <h5 className="col pb-2">Create a new box</h5>
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-3">
            <label htmlFor="boxTitle" className="form-label">
              Box Title*
            </label>
            <input
              type="text"
              id="boxTitle"
              required
              autoComplete="off"
              className="form-control input-box-info"
              placeholder="Untitled"
              onChange={(e) => setTitle(e.target.value)}
            ></input>
          </div>
          {/* Description */}
          {/* <div className="mb-3">
            <label htmlFor="boxDescription" className="form-label">
              Description
            </label>
            <textarea
              className="form-control input-box-info"
              id="boxDescription"
              rows="3"
              placeholder="Optional"
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div> */}
          <button className="btn btn-secondary">Save</button>
        </form>
      </div>
    </>
  );
};

export default CreateBoxPage;
