function toggleForm() {
    let formContainer = document.getElementById("form-container");
    
    if (formContainer.style.display === "block") {
        formContainer.classList.add("collapsing");
        setTimeout(function() {
            formContainer.style.display = "none";
            formContainer.classList.remove("collapsing");
        }, 300);
    } else {
        formContainer.style.display = "block";
        formContainer.classList.remove("collapsing");
    }
}

function flipCard(card) {
    card.classList.toggle("flip");
}

function addCard() {
    let subject = document.getElementById("subject").value.trim();
    let description = document.getElementById("description").value.trim();
    
    if (subject === "" || description === "") {
        alert("Please enter both subject and description!");
        return;
    }

    let cardContainer = document.getElementById("card-container");

    let card = document.createElement("div");
    card.classList.add("card");
    card.onclick = function () {
        flipCard(this);
    };

    let frontFace = document.createElement("div");
    frontFace.classList.add("front-face");
    frontFace.innerHTML = `<h2>${subject}</h2>`;

    let backFace = document.createElement("div");
    backFace.classList.add("back-face");
    backFace.innerHTML = `<p>${description}</p>`;

    card.appendChild(frontFace);
    card.appendChild(backFace);
    cardContainer.appendChild(card);

    document.getElementById("subject").value = "";
    document.getElementById("description").value = "";
}
