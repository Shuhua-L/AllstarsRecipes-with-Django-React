import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { BACKEND_BOX, DEFAULT_RECIPE_IMAGE } from "../constants/constants";
import Message from "./Message";

const RecipeDetail = ({ recipe }) => {
  // props: recipe

  /*
   * Parameters
   */
  const user = document.getElementById("usr");
  const myBoxes = JSON.parse(sessionStorage.getItem("userBoxes"));

  /*
   * States
   */
  const [boxes, setBoxes] = useState(myBoxes || []);
  const [activeTab, setActiveTab] = useState("instructions");
  const [message, setMessgae] = useState({
    msg: "",
    url: "",
  });

  /*
   * Effects
   */
  useEffect(() => {
    if (user) {
      const fetchBoxes = async () => {
        const response = await fetch(BACKEND_BOX);
        const body = await response.json();
        return body;
      };

      fetchBoxes().then((response) => {
        setBoxes(response);
        sessionStorage.setItem("userBoxes", JSON.stringify(response));
      });
    }
  }, []);

  /*
   * Handlers
   */
  // Add a recipe to a box
  const handleClick = (box) => {
    // Fetch PUT request
    fetch(BACKEND_BOX, {
      method: "PUT",
      body: JSON.stringify({
        box_id: box.id,
        recipe_id: recipe.id,
        recipe_title: recipe.title,
        recipe_image: recipe.image,
      }),
    });

    // Update session storage
    const prev = JSON.parse(sessionStorage.getItem("userBoxes"));
    const boxIndex = prev.findIndex((obj) => obj.id === parseInt(box.id));
    const recipeArray = prev[boxIndex].recipes;
    const index = recipeArray.findIndex((object) => object.id === recipe.id);
    // // ensure no duplicates
    if (index === -1) {
      recipeArray.push({
        title: recipe.title,
        id: recipe.id,
        image: recipe.image,
      });
    }
    sessionStorage.setItem("userBoxes", JSON.stringify(prev));

    const boxTitle = box.title.replace(/\s+/g, "-").toLowerCase();

    // Update page content
    setMessgae({
      msg: `Recipe has been added to box "${box.title}"`,
      url: `/my-recipes/list/${boxTitle}`,
      boxID: box.id,
      // url: `/my-recipes/list/${box.id}`,
    });
  };

  /*
   * Render HTML
   */
  return (
    <>
      <Message message={message.msg} url={message.url} boxID={message.boxID} />

      <div className="container px-4 py-5 recipe-wrapper">
        {/* Recipe NOT Found */}
        {Object.keys(recipe).length === 0 && (
          <div>
            <h1>No recipes found.</h1>
            <Link to={"/"}>
              <button className="btn btn-secondary">Back to HomePage</button>
            </Link>
          </div>
        )}

        {/* Render Recipe Details */}
        {Object.keys(recipe).length != 0 && (
          <div>
            {/* Title, Image, and buttons */}
            <div className="mb-2">
              <h2>{recipe.title}</h2>
              <div className="row">
                <div className="col-9">
                  <img src={recipe.image} alt={recipe.title} />
                </div>

                {/* USER-ONLY Buttons */}
                {user && (
                  <div className="col-2 d-grid gap-3 ">
                    {/* MeanPlan */}
                    {/* <button className="btn btn-sm btn-light" type="button">
                      Meal Plan
                    </button> */}

                    {/* Default box: Save for Later */}
                    <button
                      className="btn btn-sm btn-light"
                      type="button"
                      onClick={() => handleClick(boxes[0])}
                    >
                      Save for Later
                    </button>

                    {/* Add to other boxes */}
                    <div className="d-grid dropdown dropend">
                      <button
                        className="btn btn-sm btn-light dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Add to boxes
                      </button>
                      <ul className="dropdown-menu">
                        {boxes?.map((box) => (
                          <li
                            key={box.id}
                            className="dropdown-item btn btn-sm"
                            onClick={() => handleClick(box)}
                          >
                            {box.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Instructions, Ingredients */}
            <div>
              <ul className="nav nav-tabs my-2">
                <li>
                  <button
                    className={
                      activeTab === "instructions"
                        ? "nav-link active"
                        : "nav-link"
                    }
                    onClick={() => setActiveTab("instructions")}
                  >
                    Instructions
                  </button>
                </li>
                <li>
                  <button
                    className={
                      activeTab === "ingredients"
                        ? "nav-link active"
                        : "nav-link"
                    }
                    onClick={() => setActiveTab("ingredients")}
                  >
                    Ingredients
                  </button>
                </li>
              </ul>

              {activeTab === "instructions" && (
                <div>
                  {recipe.analyzedInstructions?.length > 0 ? (
                    <ol>
                      {recipe.analyzedInstructions[0]?.steps?.map(
                        (step, id) => (
                          <li key={id}>{step.step}</li>
                        )
                      )}
                    </ol>
                  ) : (
                    <p> No instructions provided yet.</p>
                  )}
                </div>
              )}

              {activeTab === "ingredients" && (
                <div>
                  {recipe.extendedIngredients?.length > 0 ? (
                    <ul>
                      {recipe.extendedIngredients?.map((ingredient, id) => (
                        <li key={id}>{ingredient.original}</li>
                      ))}
                    </ul>
                  ) : (
                    <p> No ingredients provided yet.</p>
                  )}
                </div>
              )}
            </div>

            {/* Similar Recipes */}
            {/* <div className="mt-3">
              <ul className="nav nav-tabs my-2">
                <li>
                  <button className="nav-link active">Similar Recipes</button>
                </li>
              </ul>
              
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 align-items-stretch gx-4 gy-5 py-4">
                {recipe.similarRecipes?.map((recipe, id) => (
                  <div className="col " key={id}>
                    <div className="recipe-card">
                      <Link to={`/my-recipes/detail/${recipe.id}`}>
                        <img
                          alt={recipe.title}
                          src={recipe.image || DEFAULT_RECIPE_IMAGE}
                        />
                        <div className="gradient"></div>
                      </Link>

                      <p className="cardTitle">{recipe.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div> */}
          </div>
        )}
      </div>
    </>
  );
};

export default RecipeDetail;
