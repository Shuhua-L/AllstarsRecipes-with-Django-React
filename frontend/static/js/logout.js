// clear session storage after logging out
document.addEventListener("DOMContentLoaded", function () {
  const logout = document.getElementById("logout");
  if (logout) {
    logout.addEventListener("click", () => {
      //   sessionStorage.removeItem("userBoxes");
      //   sessionStorage.removeItem("popularRecipes");
      sessionStorage.clear();
    });
  }
});
