const image_input = document.getElementById('img-input');
const image_container = document.querySelector('.image-container');
const loader = document.querySelector('.loader');
const deleteImageBtn = document.querySelector('.Delete-image');
let image = null; // Variable to store the image data URL

image_input.addEventListener('change', (event) => {
    image_container.style.backgroundImage = '';
    image_container.style.animation = '';
    const file = event.target.files[0];

    loader.classList.remove('loader-hidden');
    loader.classList.add('loader');

    if (file && file.type.startsWith('image/')) {
        console.log(file);
        image_container.classList.add('visible');
        loadImage(event).then((dataUrl) => {
            image = dataUrl;
            const img = new Image();
            img.src = image_container.style.backgroundImage.slice(4, -1).replace(/["']/g, '');
            img.onload = () => {
                loader.classList.add('loader-hidden');
                deleteImageBtn.hidden = false;
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
            resolve(e.target.result);
        };
        reader.readAsDataURL(event.target.files[0]);
    });
}

deleteImageBtn.addEventListener('click', () => {
    image_container.style.animation = 'disappearing 0.5s ease-in-out forwards';
    image_input.value = '';
    deleteImageBtn.hidden = true;
    image = null;
    setTimeout(() => {
        image_container.classList.remove('visible');
    }, 500);
});

function getImageData() {
    return image;
}

function resetImageState() {
    image = null;
    image_container.style.backgroundImage = '';
    image_container.classList.remove('visible');
    deleteImageBtn.hidden = true;
    image_input.value = '';
}