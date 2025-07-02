import "./footer.css";

const Footer = () => {

    const date = new Date();
    const year = date.getFullYear();

    return(
        
        <>
        
        <div className = "content">
        </div>

        <footer className="footer">
        <div className="footer-container">
            <div className="footer-section">
                <h3>About us</h3>
                <p>Book flight tickets quickly and easily! We offer the best deals to your favorite destinations.</p>
            </div>

            <div class="footer-section">
                <h3>Contact</h3>
                <ul>
                    <li>Email: support@flightbooking.com</li>
                    <li>Phone: +40 123 456 789</li>
                    <li>Address: Str. Aeroportului, Nr. 1, București</li>
                </ul>
            </div>

            <div className="footer-section">
                <h3>Follow us</h3>
                <div className="social-icons">
                    <a href="">🔵 Facebook</a>
                    <a href="">📷 Instagram</a>
                </div>
            </div>
        </div>

        <div className="footer-bottom">
            &copy; {year} FlightBooking | All rights reserved
        </div>
    </footer>
    </>

    );
}

export default Footer;