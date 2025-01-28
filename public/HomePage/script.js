// List of school objects (as an example)
const schools = [
    { name: 'Harvard University', zip: '02138' },
    { name: 'Stanford University', zip: '94305' },
    { name: 'Massachusetts Institute of Technology', zip: '02139' },
    { name: 'University of California, Berkeley', zip: '94720' },
    { name: 'Princeton University', zip: '08544' },
];
// Function to search for schools from the static list based on input query
function searchSchools(query) {
    return schools.filter(school =>
        school.name.toLowerCase().includes(query.toLowerCase()) ||
        school.zip.includes(query)
    );
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

    const name = document.createElement("h3");
    name.innerText = school.name;
    resultItem.appendChild(name);

    // Add event listener for clicking on the result item
    resultItem.addEventListener('click', () => {
        showSchoolDetails(school); // Show details of the selected school
    });

    return resultItem;
}

// Function to show more details about the selected school
function showSchoolDetails(school) {
    const selectedSchool = document.getElementById('selected');  // Get the div to display details

    // Add the 'show' class to make the div visible with transition
    selectedSchool.classList.add('show');

    // Display the school details in the selectedSchool div
    selectedSchool.innerHTML = `
        <h2>${school.name}</h2>
        <p>Zip Code: ${school.zip}</p>
    `;
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
    const results = searchSchools(query);
    displayResults(results);
}

// Event listener for input field
const searchInput = document.getElementById("searchInput");
const debouncedSearch = debounce(handleSearchInput, 300);
searchInput.addEventListener("input", debouncedSearch);

// Trigger search when pressing Enter key
searchInput.addEventListener("keypress", async (event) => {
    if (event.key === "Enter") {
        const query = searchInput.value;
        const results = searchSchools(query);
        displayResults(results);
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

// Close the #selected div when clicking outside of it
document.addEventListener('click', (event) => {
    const selectedSchool = document.getElementById('selected');
    const searchResults = document.getElementById('searchResults');
    const searchInput = document.getElementById('searchInput');
    
    // Check if the clicked element is not inside the #selected div or search result container
    if (!selectedSchool.contains(event.target) && !searchResults.contains(event.target) && event.target !== searchInput) {
        selectedSchool.classList.remove('show'); // Hide the #selected div
    }
});