import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { API_GET_RECIPE, DEFAULT_RECIPE_IMAGE } from "../constants/constants";

import RecipeDetail from "../components/RecipeDetail";

const RecipePage = (props) => {
  // props: recipeID?

  /*
   * Parameters
   */
  const ID = props.recipeID || useParams().id;

  /*
   * States
   */
  const [recipe, setRecipe] = useState({});

  /*
   * Effects
   */
  useEffect(() => {
    getRecipeDetail();
  }, []);

  /*
   * Functions
   */
  const getRecipeDetail = () => {
    const current = sessionStorage.getItem(`Recipe${ID}`);
    if (current) {
      setRecipe(JSON.parse(current));
    } else {
      const fetchDetail = async () => {
        const response = await fetch(
          `${API_GET_RECIPE}/${ID}/information?includeNutrition=false&apiKey=${process.env.API_KEY}`
        ).catch((err) => console.log(err));
        const body = await response.json();
        return body;
      };

      fetchDetail().then((data) => {
        // fetchSimilar().then((similar) => {
        //   console.log(similar);

        const simpleRecipe = {
          id: data.id,
          title: data.title,
          image: data.image || DEFAULT_RECIPE_IMAGE,
          // similarRecipes: similar,
          extendedIngredients: data.extendedIngredients,
          analyzedInstructions: data.analyzedInstructions,
        };
        sessionStorage.setItem(`Recipe${ID}`, JSON.stringify(simpleRecipe));
        setRecipe(simpleRecipe);
      });
    }
  };

  // const fetchSimilar = async () => {
  //   const response = await fetch(
  //     `${API_GET_RECIPE}/${ID}/similar?apiKey=${process.env.API_KEY}&number=3`
  //   ).catch((err) => console.log(err));
  //   const body = await response.json();
  //   return body;
  // };

  return <RecipeDetail recipe={recipe} />;
};

export default RecipePage;
