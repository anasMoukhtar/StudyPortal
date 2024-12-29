import './Styles/footer.css'
import React from 'react';
// import { IonIcon } from '@ionic/react';
// import { logoIonic } from 'ionicons/icons';
function Footer(){
    return(
        <>
         <footer>
        <ul>
            <li><ion-icon name="logo-discord"></ion-icon></li>
            <li><ion-icon name="logo-github"></ion-icon></li>
            <li><ion-icon name="logo-youtube"></ion-icon></li>
            <li><ion-icon name="logo-reddit"></ion-icon></li>
        </ul>
    </footer>
        </>
    );
}
export default Footer;