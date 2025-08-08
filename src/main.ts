import { SearchApp } from "./SearchApp";

document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  if (app) {
    const searchApp = new SearchApp(app);
    searchApp.init();
  }
});
