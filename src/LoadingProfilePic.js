// 📌 Fetch Profile Picture from Backend
async function loadProfilePicture() {
    try {
        const response = await fetch("/Upload", {
            credentials: "include"
        });

        const user = await response.json();
        if(user){
            if (user.pfp !== "pfp.png") {
                document.getElementById("profilePicture").src = `data:image/png;base64,${user.pfp}`;
            }else {
                document.getElementById("profilePicture").src = `../Assets/pfp.png`;
            }
        }

    } catch (error) {
        console.error("Error fetching profile picture:", error);
    }
}

// Load profile picture on page load
loadProfilePicture();