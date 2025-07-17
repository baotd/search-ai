import { SearchApp } from "./SearchApp.ts";

document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  if (app) {
    const searchApp = new SearchApp(app);
    searchApp.init();
  }
});
