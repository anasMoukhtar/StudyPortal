document.getElementById("pfp-input").addEventListener("change", async function () {
    const file = this.files[0];
    // Check file size
    if(file.size < 1048576 * 0.1 * 2 // max size 2 MB
        ){
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = async function () {
            const base64String = reader.result.split(",")[1]; 
    
            try {
                const response = await fetch("/Upload", {
                    method: "POST",
                    credentials: "include", 
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ pfp: base64String })
                });
    
                const result = await response.json();
                // Reload profile picture
                loadProfilePicture();
    
            } catch (error) {
                console.error("Error uploading profile picture:", error);
            }
        };
    
        reader.readAsDataURL(file);
    }else{
        alert("Profile picture size exceeds 2MB. Please choose a smaller image.");
        this.value = "";  // Reset file input field
    }

});