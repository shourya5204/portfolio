document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    document.querySelector("#about").scrollIntoView({ behavior: "smooth" });
  }
});
