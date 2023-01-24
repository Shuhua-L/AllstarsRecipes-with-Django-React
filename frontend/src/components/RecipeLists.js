import React, { useEffect, useState } from "react";
import { Link, useParams, redirect } from "react-router-dom";

import { DEFAULT_RECIPE_IMAGE, BACKEND_BOX } from "../constants/constants";

import Message from "./Message";

const RecipeLists = (props) => {
  // props: blockTitle, recipes, boxID?, edits?

  /*
   * Parameters
   */
  const params = useParams();
  const edit = props.edit || false;

  /*
   * States
   */
  const [recipes, setRecipes] = useState(props.recipes);
  const [boxTitle, setBoxTitle] = useState(props.blockTitle);

  const [changeTitle, setChangeTitle] = useState(false);
  const [recipeToRemove, setRecipeToRemove] = useState([]);
  const [message, setMessgae] = useState(
    'Changes made on this box will only be save after clicking "Save"'
  );

  /*
   * States
   */
  useEffect(() => {
    setRecipes(recipes);
  }, []);

  useEffect(() => {
    setRecipes(props.recipes);
    setBoxTitle(props.blockTitle);
  }, [props]);

  /*
   * Handlers
   */
  // Update Recipes-to-remove:
  const handleCheck = (event) => {
    const target = event.target;
    if (target.checked === false) {
      // adding element to array
      setRecipeToRemove([...recipeToRemove, target.name]);
    } else {
      // removing element from array
      setRecipeToRemove(recipeToRemove.filter((id) => id !== target.name));
    }
  };

  // Submit Form: edit recipes in a box
  const handleSumbitSave = (event) => {
    event.preventDefault();

    const boxID = props.boxID;

    // Fetch PATCH request
    fetch(BACKEND_BOX, {
      method: "PATCH",
      body: JSON.stringify({
        box_id: boxID,
        box_title: boxTitle,
        remove_recipes: recipeToRemove,
      }),
    });

    // Update state: recipes
    setRecipes(
      recipes?.filter(
        (recipe) => recipeToRemove?.indexOf(recipe.id + "") === -1
      )
    );

    // Update session storage
    const prev = JSON.parse(sessionStorage.getItem("userBoxes"));
    const boxIndex = prev.findIndex((box) => box.id === parseInt(boxID));
    const recipeArray = prev[boxIndex]?.recipes;
    const filteredRecipes = recipeArray?.filter(
      (recipe) => recipeToRemove?.indexOf(recipe.id + "") === -1
    );
    prev[boxIndex].recipes = filteredRecipes;
    prev[boxIndex].title = boxTitle;
    sessionStorage.setItem("userBoxes", JSON.stringify(prev));

    // Update page content: display message
    setMessgae(`Box "${props.blockTitle}" is been updated. `);
  };

  const path = (recipeID) => {
    switch (location.pathname) {
      // Home Page
      case "/":
        return `/recipe/${recipeID}`;

      // Boxes Page
      default:
        // case "/my-recipes/:type/:id":
        return `/my-recipes/detail/${recipeID}`;
    }
  };

  /*
   * Render HTML
   */
  return (
    <>
      {edit && <Message message={message} />}

      <div className="container px-4 py-5">
        <form id="form-edit-box" onSubmit={handleSumbitSave}>
          {/* Block Title */}
          <div className="row justify-content-between">
            {changeTitle || (
              <h5 className="col pb-2" id="box-title">
                {boxTitle}

                {edit && (
                  <span
                    className="fa-regular fa-pen-to-square ms-2"
                    onClick={() => setChangeTitle(true)}
                  ></span>
                )}
              </h5>
            )}

            {changeTitle && (
              <h5 className="col-7">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control input-box-info"
                    id="boxTitle"
                    value={boxTitle}
                    onChange={(e) => setBoxTitle(e.target.value)}
                  />

                  <span
                    className="fa-regular fa-square-check ms-2 my-auto"
                    style={{ scale: "1.35", color: "#212529" }}
                    onClick={() => setChangeTitle(false)}
                  ></span>
                </div>
              </h5>
            )}

            {edit && (
              <button className="btn btn-secondary col-3" type="submit">
                Save
              </button>
            )}
          </div>

          {/* Recipe Cards */}
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 align-items-stretch gx-4 gy-5 py-4">
            {recipes?.map((recipe, id) => (
              <div className="col " key={id}>
                <div className="recipe-card">
                  <Link to={path(recipe.id)}>
                    <img
                      alt={recipe.title}
                      src={recipe.image || DEFAULT_RECIPE_IMAGE}
                    />
                    <div className="gradient"></div>
                  </Link>

                  <p className="cardTitle">
                    {recipe.title}
                    {edit && (
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        defaultChecked={true}
                        name={recipe.id}
                        onChange={handleCheck}
                      />
                    )}
                  </p>
                </div>
              </div>
            ))}

            {recipes?.length === 0 && !edit && (
              <div>
                <div className="ms-2 mb-2">No recipes yet.</div>
                <Link to={"/"}>
                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={() => {
                      if (window.location.pathname === "/") {
                        window.location.reload();
                      }
                    }}
                  >
                    Explore recipes
                  </button>
                </Link>
              </div>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default RecipeLists;
