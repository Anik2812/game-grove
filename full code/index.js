 // Get the modals
        var loginModal = document.getElementById("loginModal");
        var registerModal = document.getElementById("registerModal");

        // Get the button that opens the login modal
        var loginBtn = document.getElementById("loginBtn");

        // Get the <span> elements that close the modals
        var spans = document.getElementsByClassName("close");

        // Get the links to switch between login and register
        var showRegisterLink = document.getElementById("showRegister");
        var showLoginLink = document.getElementById("showLogin");

        // Get the cards
        var gamesCard = document.getElementById("gamesCard");
        var eventsCard = document.getElementById("eventsCard");
        var menuCard = document.getElementById("menuCard");

        // Function to open login modal
        function openLoginModal() {
            loginModal.style.display = "block";
        }

        // When the user clicks on the login button or any card, open the login modal
        loginBtn.onclick = openLoginModal;
        gamesCard.onclick = openLoginModal;
        eventsCard.onclick = openLoginModal;
        menuCard.onclick = openLoginModal;

        // When the user clicks on <span> (x), close the modal
        for (var i = 0; i < spans.length; i++) {
            spans[i].onclick = function() {
                loginModal.style.display = "none";
                registerModal.style.display = "none";
            }
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == loginModal) {
                loginModal.style.display = "none";
            }
            if (event.target == registerModal) {
                registerModal.style.display = "none";
            }
        }

        // Switch to register modal
        showRegisterLink.onclick = function() {
            loginModal.style.display = "none";
            registerModal.style.display = "block";
        }

        // Switch to login modal
        showLoginLink.onclick = function() {
            registerModal.style.display = "none";
            loginModal.style.display = "block";
        }

        // Prevent form submission (for demonstration purposes)
        document.getElementById("loginForm").onsubmit = function(e) {
            e.preventDefault();
            alert("Login functionality would be implemented here.");
        }

        document.getElementById("registerForm").onsubmit = function(e) {
            e.preventDefault();
            alert("Registration functionality would be implemented here.");
        }

       