document.addEventListener("DOMContentLoaded", () => {
    // API endpoint
    const API_URL = "http://127.0.0.1:8000";

    // Select all the important elements from the HTML
    const genreSelect = document.getElementById("genre-select");
    const episodeInput = document.getElementById("episode-input");
    const examplesCheck = document.getElementById("examples-check");
    const generateBtn = document.getElementById("generate-btn");
    const generatorForm = document.getElementById("generator-form");
    const loadingSpinner = document.getElementById("loading-spinner");
    const resultsContainer = document.getElementById("results-container");

    // Fetch genres from the API when the page loads
    async function fetchGenres() {
        try {
            const response = await fetch(`${API_URL}/genres`);
            if (!response.ok) throw new Error("Network response was not ok");
            const data = await response.json();
            
            // Populate the dropdown
            genreSelect.innerHTML = '<option value="" disabled selected>Select a genre</option>';
            data.genres.forEach(genre => {
                const option = document.createElement("option");
                option.value = genre;
                option.textContent = genre.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
                genreSelect.appendChild(option);
            });
        } catch (error) {
            console.error("Failed to fetch genres:", error);
            genreSelect.innerHTML = '<option value="" disabled selected>Could not load genres</option>';
        }
    }

    // Handle the form submission
    async function handleGenerate(event) {
        event.preventDefault(); // Prevent page refresh

        const selectedGenre = genreSelect.value;
        if (!selectedGenre) {
            alert("Please select a genre first.");
            return;
        }

        // Show loading spinner and disable button
        loadingSpinner.classList.remove("hidden");
        generateBtn.disabled = true;
        generateBtn.textContent = "Generating...";
        resultsContainer.innerHTML = "";

        // Get form values
        const requestBody = {
            genre: selectedGenre,
            mode: document.querySelector('input[name="mode"]:checked').value,
            episode: episodeInput.value || null,
            examples: examplesCheck.checked
        };

        try {
            const response = await fetch(`${API_URL}/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "API request failed");
            }

            const data = await response.json();
            displayResults(data.result);

        } catch (error) {
            console.error("Generation failed:", error);
            resultsContainer.innerHTML = `<div class="result-card"><p><strong>Error:</strong> ${error.message}</p></div>`;
        } finally {
            // Hide spinner and re-enable button
            loadingSpinner.classList.add("hidden");
            generateBtn.disabled = false;
            generateBtn.textContent = "Generate";
        }
    }

    // Display the results from the API
    function displayResults(results) {
        if (!results || results.length === 0) {
            resultsContainer.innerHTML = "<p>No results returned.</p>";
            return;
        }

        results.forEach(item => {
            const card = document.createElement("div");
            card.className = "result-card";

            // Use the 'marked' library to convert Markdown to HTML
            const generatedHtml = marked.parse(item.generated);

            card.innerHTML = `
                <h3>Episode Range: ${item.episode}</h3>
                <p><strong>Brief:</strong> ${item.description}</p>
                <p><strong>Tropes:</strong> ${item.tropes.join(", ")}</p>
                <hr>
                <div>${generatedHtml}</div>
            `;
            resultsContainer.appendChild(card);
        });
    }
    
    // Attach event listener to the form
    generatorForm.addEventListener("submit", handleGenerate);

    // Initial call to load genres
    fetchGenres();
});