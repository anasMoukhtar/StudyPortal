// Sample school data
const schools = [
    { name: 'Harvard University', zip: '02138' },
    { name: 'Stanford University', zip: '94305' },
    { name: 'Massachusetts Institute of Technology', zip: '02139' },
    { name: 'University of California, Berkeley', zip: '94720' },
    { name: 'Princeton University', zip: '08544' },
];

// Search functionality
function searchSchools(query) {
    return schools.filter(school =>
        school.name.toLowerCase().includes(query.toLowerCase()) ||
        school.zip.includes(query)
    );
}

// Display search results
function displayResults(results) {
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = '';

    if (results.length === 0) {
        resultsContainer.innerHTML = '<div class="no-result-item">No results found</div>';
    } else {
        results.forEach(school => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            resultItem.innerHTML = `<h3>${school.name}</h3><p>Zip: ${school.zip}</p>`;
            resultItem.addEventListener('click', () => showSchoolDetails(school));
            resultsContainer.appendChild(resultItem);
        });
    }
}

// Show selected school details
function showSchoolDetails(school) {
    const selected = document.getElementById('selected');
    selected.innerHTML = `<h2>${school.name}</h2><p>Zip: ${school.zip}</p>`;
    selected.classList.add('show');
}

// Debounced search input
function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

// Event listeners
const searchInput = document.getElementById('searchInput');
const debouncedSearch = debounce((event) => {
    const query = event.target.value;
    const results = searchSchools(query);
    displayResults(results);
}, 300);

searchInput.addEventListener('input', debouncedSearch);
searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const query = searchInput.value;
        const results = searchSchools(query);
        displayResults(results);
    }
});

// Close selected school details when clicking outside
document.addEventListener('click', (event) => {
    const selected = document.getElementById('selected');
    if (!selected.contains(event.target) && event.target !== searchInput) {
        selected.classList.remove('show');
    }
});