const image_input = document.getElementById('img-input');
const image_container = document.querySelector('.image-container');
const loader = document.querySelector('.loader');
const deleteImageBtn = document.querySelector('.delete-image');
image_input.addEventListener('change', (event) => {
    image_container.style.backgroundImage = ''; // Clear previous image
    const file = event.target.files[0];

    loader.classList.remove('loader-hidden');
    loader.classList.add('loader');

    if (file && file.type.startsWith('image/')) {
        console.log(file);
        image_container.classList.add('visible');
        loadImage(event).then(() => {
            // Wait for the image to fully load before stopping the loader animation
            const img = new Image();
            img.src = image_container.style.backgroundImage.slice(4, -1).replace(/["']/g, ''); // Extract URL from `backgroundImage`
            img.onload = () => {
                loader.classList.add('loader-hidden');
            };
        });
    } else {
        loader.classList.remove('loader');
        loader.classList.add('loader-hidden');
        showToast('Only Images Allowed ❌');
    }
});

function loadImage(event) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            image_container.style.backgroundImage = `url(${e.target.result})`;
            resolve();
        };
        reader.readAsDataURL(event.target.files[0]);
    });
}