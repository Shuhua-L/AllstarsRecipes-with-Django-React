import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";

import RecipePage from "./RecipePage";
import RecipeLists from "../components/RecipeLists";
import CreateBoxPage from "./CreateBoxPage";

import { BACKEND_BOX } from "../constants/constants";

const RecipeBox = () => {
  /*
   * Parameters
   */
  const navigate = useNavigate();
  const { state } = useLocation();
  const params = useParams();

  const myBoxes = JSON.parse(sessionStorage.getItem("userBoxes"));
  const URLparams = {
    type: params.type,
    id: state?.id || params.id || 0,
  };

  /*
   * States
   */
  const [lists, setLists] = useState(myBoxes || []);
  const [active, setActive] = useState({ type: "", id: 0 });
  const [edit, setEdit] = useState(false);

  /*
   * Effects
   */
  useEffect(() => {
    // fetchXXX function have responsibility to only fetch data and return a json
    const fetchBoxes = async () => {
      const response = await fetch(BACKEND_BOX);
      const body = await response.json();
      return body;
    };

    // use .then to get promise response and update state
    fetchBoxes().then((response) => {
      setLists(response);
      sessionStorage.setItem("userBoxes", JSON.stringify(response));
    });
  }, []);

  useEffect(() => {
    setLists(myBoxes);
  }, [sessionStorage.getItem("userBoxes")]);

  useEffect(() => {
    if (URLparams.type) {
      setActive(URLparams);
    }
  }, [location.pathname]);

  /*
   * Handlers
   */
  // Submit: delete a box
  const handleSubmitDelete = (boxID) => {
    // Fetch DELETE request
    fetch(BACKEND_BOX, {
      method: "DELETE",
      body: JSON.stringify({
        box_id: boxID,
      }),
    });

    // Update session storage
    const prev = JSON.parse(sessionStorage.getItem("userBoxes"));
    const removed = prev.filter((box) => box.id !== boxID);
    sessionStorage.setItem("userBoxes", JSON.stringify(removed));

    // redirect to main box page
    navigate(`/my-recipes/list`);
  };

  // Click: render a box
  const handleClickBox = (boxTitle, boxID) => {
    boxTitle = boxTitle.replace(/\s+/g, "-").toLowerCase();

    // redirect to box page
    navigate(`/my-recipes/list/${boxTitle}`, {
      state: { id: boxID },
    });
  };

  const UpdateContent = () => {
    // List view
    if (active.type === "list" && active.id !== 0) {
      const box = lists.find((box) => box.id === parseInt(active.id));
      if (box) {
        return (
          <RecipeLists
            blockTitle={box.title}
            recipes={box.recipes}
            boxID={box.id}
            edit={edit}
          />
        );
      } else {
        return (
          <div className="container px-4 py-5">
            <h5 className="col pb-2">List not found.</h5>
          </div>
        );
      }

      // Detail View
    } else if (active.type === "detail" && active.id !== 0) {
      return <RecipePage recipeID={active.id} />;

      // Create View
    } else if (active.type === "new") {
      return <CreateBoxPage />;

      // Default
    } else
      return (
        <div className="container px-4 py-5">
          <h5 className="col pb-2">Select or create a box to start.</h5>
        </div>
      );
  };

  /*
   * Render HTML
   */
  return (
    <div className="row container-xl ">
      {/* Sidebar */}
      <div className="sidebar col-md-3 col-sm-4">
        <h3 className="mt-1">My Boxes</h3>
        <ul className="list-unstyled ps-0">
          {edit ||
            lists?.map((box, id) => (
              // Box
              <li className="mb-1" key={id}>
                <button
                  className="btn btn-toggle box-title d-inline-flex align-items-center border-0 collapsed"
                  data-bs-toggle="collapse"
                  data-bs-target={"#box" + box.id}
                  aria-expanded="false"
                  onClick={() => handleClickBox(box.title, box.id)}
                >
                  <span>{box.title}</span>
                </button>

                {/* Recipes in the box */}
                <div className="collapse" id={"box" + box.id}>
                  <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                    {box.recipes?.map((recipe) => (
                      <li
                        key={recipe.id}
                        onClick={() =>
                          navigate(`/my-recipes/detail/${recipe.id}`)
                        }
                      >
                        {recipe.title}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}

          {edit &&
            lists?.map((box, id) => (
              // Box
              <li className="mb-1" key={id}>
                <button
                  className="btn btn-toggle d-inline-flex align-items-center border-0"
                  onClick={() => handleClickBox(box.title, box.id)}
                >
                  {id == 0 || (
                    <i
                      className="fa-regular fa-trash-can me-1"
                      style={{ scale: "1.2" }}
                      data-bs-toggle="modal"
                      data-bs-target={"#Modal" + box.id}
                    ></i>
                  )}
                  <span>
                    {box.title}
                    {id == 0 && <> (default)</>}
                  </span>
                </button>

                {/* Confirm Delete Modal */}
                <div
                  className="modal fade"
                  id={"Modal" + box.id}
                  tabIndex="-1"
                  aria-hidden="true"
                >
                  <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                      <div className="modal-body text-center">
                        <button
                          type="button"
                          className="btn-close "
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                        <div>
                          Please confirm your action: Delete box "{box.title}
                          ".
                        </div>
                        <button
                          type="button"
                          className="btn btn-outline-danger mt-2"
                          data-bs-dismiss="modal"
                          onClick={() => handleSubmitDelete(box.id)}
                        >
                          Confirm
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}

          <li className="border-top my-3"></li>

          {/* Account */}
          {edit || (
            <>
              <li className="mb-1">
                <Link
                  className="btn btn-toggle d-inline-flex border-0"
                  to={"/my-recipes/new"}
                >
                  <span>Add a New Box</span>
                </Link>
              </li>
              <li className="mb-1">
                <Link
                  to={"/my-recipes/list"}
                  className="btn btn-toggle d-inline-flex border-0"
                  onClick={() => setEdit(true)}
                >
                  <span>Edit my Boxes</span>
                </Link>
              </li>
            </>
          )}

          {edit && (
            <li className="mb-1">
              <button
                className="btn btn-secondary"
                onClick={() => setEdit(false)}
              >
                <span>Finish Editing</span>
              </button>
            </li>
          )}
        </ul>
      </div>

      {/* Content */}
      <div className="content col-md-9 col-sm-8 mx-auto">
        <UpdateContent />
      </div>
    </div>
  );
};

export default RecipeBox;
