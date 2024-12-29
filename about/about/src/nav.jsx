import './Styles/nav.css'
function Nav(){
return(
    <>
        <nav>
        <div class="left-section">
            <ul>
                <li><a href="index.html">Home</a></li>
                <li><a href="plans.html">Pricing</a></li>
                <li><a href="#">Support</a></li>
                <li><a href="#">Contact</a></li>
                <li><a href="#">More</a></li>
            </ul>
        </div>
        <div class="right-section">
            <button onclick="signUpButtonClick()" class="signup">Sign Up</button>
            <button class="signin">Sign In</button>
        </div>
     </nav> 
    </>
);
}
export default Nav;