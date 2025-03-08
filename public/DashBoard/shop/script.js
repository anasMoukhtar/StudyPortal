function updateCoinsDisplay(newCoins) {
    let currentCoins = parseInt(document.getElementById('Points').innerText);
    let interval = setInterval(() => {
        if (currentCoins > newCoins) {
            currentCoins -= 5;
            document.getElementById('Points').innerText = currentCoins;
        } else {
            clearInterval(interval);
        }
    }, 10); // Adjust speed if needed
}
function showToast(message) {
    let toast = document.getElementById('toast');
    toast.innerText = message;
    toast.classList.add('show-toast');
    setTimeout(() => toast.classList.remove('show-toast'), 4000);
}
document.addEventListener('DOMContentLoaded', () => {
    let myCoins = JSON.parse(localStorage.getItem('myCoins')) ?? 0;
    const points = document.getElementById('Points');
    points.innerText = myCoins;
    
    window.buy = (coins) => { 
        if (myCoins >= coins) {
            myCoins -= coins;
            localStorage.setItem('myCoins', JSON.stringify(myCoins));
            updateCoinsDisplay(myCoins); // Update displayed coins
            console.log(myCoins);
        } else {
            showToast("Not enough coins! ❌");
        }
    };
});
