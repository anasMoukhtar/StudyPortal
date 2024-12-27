// Fetch schools from the local JSON file
async function fetchSchools(query) {
    try {
        const response = await fetch("schools.json");
        const schools = await response.json();
        // Filter schools based on the query
        return schools.filter(school =>
            school.name.toLowerCase().includes(query.toLowerCase())
        );
    } catch (error) {
        console.error("Error fetching schools:", error);
        return [];
    }
}

// Display search results
async function displayResults(results) {
    const resultsContainer = document.getElementById("searchResults");
    resultsContainer.innerHTML = ""; // Clear previous results

    if (results.length === 0) {
        // Show "No results" if the search is empty
        const noResultItem = document.createElement("div");
        noResultItem.className = "no-result-item";
        noResultItem.innerText = "No results found";
        resultsContainer.appendChild(noResultItem);
    } else {
        results.forEach(school => {
            const resultItem = document.createElement("div");
            resultItem.className = "result-item";

            // Create an image element with fallback alt text
            const img = document.createElement("img");
            img.src = school.image || "placeholder.jpg"; // Use placeholder image if none provided
            img.alt = school.alt || `Image of ${school.name} not available`; // Use alt text or default message
            resultItem.appendChild(img);

            // Add school name below the image
            const name = document.createElement("h3");
            name.innerText = school.name;
            resultItem.appendChild(name);

            // Append the result item to the results container
            resultsContainer.appendChild(resultItem);
        });
    }
}

// Trigger search when typing in the input field
document.getElementById("searchInput").addEventListener("input", async () => {
    const query = document.getElementById("searchInput").value;
    const schools = await fetchSchools(query);
    displayResults(schools);
});

// Trigger search when pressing Enter in the input field
document.getElementById("searchInput").addEventListener("keypress", async (event) => {
    if (event.key === "Enter") {
        const query = document.getElementById("searchInput").value;
        const schools = await fetchSchools(query);
        displayResults(schools);
    }
});
