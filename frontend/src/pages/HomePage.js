import React, { useState, useEffect } from "react";
import RecipeLists from "../components/RecipeLists";

import {
  API_URL_SEARCH,
  API_URL_RANDOM,
  QUERY_NUM,
  DEFAULT_RECIPE_IMAGE,
} from "../constants/constants";

const HomePage = () => {
  /*
   * Parameters
   */
  const popular = sessionStorage.getItem("popularRecipes");

  /*
   * States
   */
  const [recipes, setRecipes] = useState(JSON.parse(popular) || []);
  const [blockTitle, setBlockTitle] = useState("Try these popular ones!");
  const [searchTerm, setSearchTerm] = useState("");
  const [loadMore, setLoadMore] = useState(true);
  const [scrollTop, setScrollTop] = useState(false);

  // Scroll to Top on Reload
  if (history.scrollRestoration) {
    history.scrollRestoration = "manual";
  } else {
    window.onbeforeunload = function () {
      window.scrollTo(0, 0);
    };
  }

  /*
   * Effects
   */
  useEffect(() => {
    setSearchTerm("");
    popularRecipes();

    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 50) {
        setScrollTop(true);
      } else {
        setScrollTop(false);
      }
    });
  }, []);

  /*
   * Functions
   */
  const popularRecipes = (offset = 0) => {
    if (popular && offset == 0) {
      setRecipes(JSON.parse(popular));
    } else {
      const fetchPopular = async () => {
        const response = await fetch(
          `${API_URL_RANDOM}?number=${QUERY_NUM}&apiKey=${process.env.API_KEY}`
        );
        const body = await response.json();
        return body;
      };

      fetchPopular().then((data) => {
        setRecipes([...recipes, ...data.recipes]);

        // Update session storage
        sessionStorage.setItem(
          "popularRecipes",
          JSON.stringify([...recipes, ...data.recipes])
        );

        updateStorage(data.recipes);
      });
    }

    setBlockTitle("Try these popular ones!");
  };

  const searchRecipes = (offset = 0) => {
    const fetchSearch = async () => {
      const response = await fetch(
        `${API_URL_SEARCH}?query=${searchTerm}&number=${QUERY_NUM}&offset=${offset}&apiKey=${process.env.API_KEY}`
      );
      const body = await response.json();
      return body;
    };

    fetchSearch().then((data) => {
      if (offset == 0) {
        setRecipes(data.results);
      } else {
        if (data.results.length < QUERY_NUM) {
          setLoadMore(false);
        }

        setRecipes([...recipes, ...data.results]);
      }

      setBlockTitle(
        data.results.length > 0
          ? `Recipes including "${searchTerm}":`
          : `Recipes including "${searchTerm}": Not found.`
      );

      // Update session storage
      updateStorage(data.results);
    });
  };

  // Save an array of recipes to session storage
  const updateStorage = (array) => {
    array.forEach((recipe) => {
      const tem = {
        id: recipe.id,
        title: recipe.title,
        image: recipe.image || DEFAULT_RECIPE_IMAGE,
        extendedIngredients: recipe.extendedIngredients,
        analyzedInstructions: recipe.analyzedInstructions,
      };
      sessionStorage.setItem(`Recipe${recipe.id}`, JSON.stringify(tem));
    });
  };

  const getRecipes = (offset = 0) => {
    searchTerm.length > 0 ? searchRecipes(offset) : popularRecipes(offset);
  };

  /*
   * Render HTML
   */
  return (
    <div className="container mt-4">
      <form
        id="form-search-recipes"
        className="search"
        onSubmit={(e) => {
          e.preventDefault();
          getRecipes();
        }}
      >
        <input
          value={searchTerm}
          name="searchInput"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for recipes"
          type="text"
          autoComplete="off"
        />
        <input
          type="image"
          src="./static/assets/search.svg"
          alt="submitSearch"
        />
      </form>

      <RecipeLists blockTitle={blockTitle} recipes={recipes} />

      {/* Load More Button */}
      {recipes.length > 0 && loadMore && (
        <div className="text-center">
          <button
            className="btn btn-secondary mb-3"
            onClick={() => getRecipes(recipes.length)}
          >
            Load More
          </button>
        </div>
      )}

      {/* Back To Top Button */}
      {scrollTop && (
        <button
          className="backToTop"
          onClick={() => {
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
        >
          <i className="fa-solid fa-angles-up"></i>
        </button>
      )}
    </div>
  );
};

export default HomePage;
