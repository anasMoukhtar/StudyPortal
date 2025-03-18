document.addEventListener("DOMContentLoaded", () => {
    const themeSwitch = document.getElementById("theme-switch");
  
    // Toggle Dark Mode
    const toggleDarkMode = () => {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      if (isDark) {
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("darkmode", "inactive");
      } else {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("darkmode", "active");
      }
    };
  
    // Apply dark mode if active in localStorage
    if (localStorage.getItem("darkmode") === "active") {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  
    // Event listener for the switch
    themeSwitch.addEventListener("click", toggleDarkMode);
  });
  