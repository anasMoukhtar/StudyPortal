// sign up button click
function signUpButtonClick(){
    window.open('./Sign-up/sign-up.html','_blank')
}

// Helper function to fetch schools from a local JSON file
async function fetchSchools(query) {
    try {
        const response = await fetch("schools.json");
        const schools = await response.json();
        
        // Filter schools based on the search query
        return schools.filter(school =>
            school.name.toLowerCase().includes(query.toLowerCase())
        );
    } catch (error) {
        console.error("Error fetching schools:", error);
        return [];
    }
}

// Function to display results in the search container
function displayResults(results) {
    const resultsContainer = document.getElementById("searchResults");
    resultsContainer.innerHTML = ""; // Clear previous results

    if (results.length === 0) {
        showNoResultsMessage();
    } else {
        results.forEach(school => {
            const resultItem = createResultItem(school);
            resultsContainer.appendChild(resultItem);
        });
    }

    // Show results container if there are any results
    if (results.length > 0) {
        resultsContainer.style.display = "block";
    }
}

// Show message if no results are found
function showNoResultsMessage() {
    const resultsContainer = document.getElementById("searchResults");
    const noResultItem = document.createElement("div");
    noResultItem.className = "no-result-item";
    noResultItem.innerText = "No results found";
    resultsContainer.appendChild(noResultItem);
}

// Create a single result item to display a school
function createResultItem(school) {
    const resultItem = document.createElement("div");
    resultItem.className = "result-item";

    const img = createImageElement(school);
    resultItem.appendChild(img);

    const name = document.createElement("h3");
    name.innerText = school.name;
    resultItem.appendChild(name);

    return resultItem;
}

// Create image element with fallback logic
// Create image element with fallback logic
function createImageElement(school) {
    const img = document.createElement("img");
    img.src = school.image || "placeholder.jpg"; // Default to placeholder image if no image
    img.alt = school.alt || `Image of ${school.name} not available`; // Provide alt text or fallback message

    // If the image is a placeholder, modify its alt text
    if (img.src === "placeholder.jpg") {
        img.alt = `No image available for ${school.name}`;  // Custom alt text for placeholder image
    }

    return img;
}

// Debounced search input to limit API calls
function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

// Search handler for input event
async function handleSearchInput(event) {
    const query = event.target.value;
    const schools = await fetchSchools(query);
    displayResults(schools);
}

// Event listener for input field
const searchInput = document.getElementById("searchInput");
const debouncedSearch = debounce(handleSearchInput, 300);
searchInput.addEventListener("input", debouncedSearch);

// Trigger search when pressing Enter key
searchInput.addEventListener("keypress", async (event) => {
    if (event.key === "Enter") {
        const query = searchInput.value;
        const schools = await fetchSchools(query);
        displayResults(schools);
    }
});

// Hide results when input loses focus
searchInput.addEventListener("blur", () => {
    const resultsContainer = document.getElementById("searchResults");
    setTimeout(() => {
        resultsContainer.style.display = "none"; // Hide results after blur
    }, 200); // Delay to allow click on result item
});

// Optional: Keep results visible when the input is focused again
searchInput.addEventListener("focus", () => {
    const resultsContainer = document.getElementById("searchResults");
    if (resultsContainer.innerHTML !== "") {
        resultsContainer.style.display = "block"; // Show results when focus is back
    }
});
