<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SlowYou.net</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css">
    <link rel="stylesheet" href="styles.css">
</head>
<body class="d-flex flex-column pt-5 hero-background">
    
    <div id="menu-container"></div> <!-- Placeholder for the menu -->

    <section id="hero" class="mt-4">
        <div class="container">
            <h2 class="display-2 text-center mb-4" id="maintitlefirstpage">SlowYou</h2>

            <h1 class="display-4 text-center mb-4" id="heroTitle">Effortless Being, Boundless Living.</h1>
            <h2 class="lead text-center mb-4" id="heroSubtitle">The Journey Inward</h2>
            <p class="text-white p-5 rounded mx-auto text-center d-flex justify-content-center align-items-center flex-column h-auto overflow-hidden" style="background-color: rgba(108, 117, 125, 0.8);" id="heroText1">
              Effortless Being, Boundless Living" is more than a principle; it is a way of life. It invites you to step into a world where each action is infused with meaning, and every moment is an opportunity for growth and joy. It calls you to a life where you are no longer a bystander but a vibrant participant in the dance of creation.
            </p>
            
            <p class="bg-dark text-white p-5 rounded mx-auto text-center d-flex justify-content-center align-items-center flex-column h-auto overflow-hidden" id="heroText2">
                This philosophy does not ask you to change who you are but to become more profoundly what you truly are—a being of light, love, and infinite potential. As you turn the pages of this website and your life, remember that the path to a boundless existence lies in the effortless simplicity of being true to your nature. Let this knowledge guide you as you navigate the complexities of the world with grace and poise, embracing the limitless joy of simply being.
            </p>
            <a href="#about" class="btn btn-primary" id="learnMoreButton">Learn More</a>
        </div>
    </section>

    <div class="content d-flex justify-content-center align-items-center container mt-4">
        <!-- Your other content -->
    </div>

    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.bundle.min.js"></script>

    <script>
        function loadLanguage(language) {
            fetch(`/languages/${language}.json`)
                .then(response => response.json())
                .then(data => {
                    document.getElementById('navHome').innerText = data.navHome;
                    document.getElementById('navFeatures').innerText = data.navFeatures;
                    document.getElementById('navPricing').innerText = data.navPricing;
                    document.getElementById('navFAQs').innerText = data.navFAQs;
                    document.getElementById('navAbout').innerText = data.navAbout;
                    document.getElementById('loginButton').innerText = data.loginButton;
                    document.getElementById('signupButton').innerText = data.signupButton;
                    document.getElementById('titlelanguage').innerText = data.titlelanguage;
                    document.getElementById('heroTitle').innerText = data.heroTitle;
                    document.getElementById('heroSubtitle').innerText = data.heroSubtitle;
                    document.getElementById('heroText1').innerText = data.heroText1;
                    document.getElementById('heroText2').innerText = data.heroText2;
                    document.getElementById('learnMoreButton').innerText = data.learnMoreButton;
                    document.getElementById('maintitlefirstpage').innerText = data.maintitlefirstpage;
                });
        }
    
        function initializeLanguageSelector() {
            console.log("Initializing language selector");
            document.getElementById('languageSelector').addEventListener('change', function() {
                const selectedLanguage = this.value;
                localStorage.setItem('preferredLanguage', selectedLanguage);
                loadLanguage(selectedLanguage);
            });
    
            const preferredLanguage = localStorage.getItem('preferredLanguage') || 'en';
            document.getElementById('languageSelector').value = preferredLanguage;
            loadLanguage(preferredLanguage);
        }
    
        function getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
        }
    
        function checkAuthStatus() {
            console.log("Checking auth status");
            const token = getCookie('jwtToken');
            console.log('Token found:', token);
    
            if (token) {
                document.getElementById('auth-buttons').classList.add('d-none');
                document.getElementById('logout-buttons').classList.remove('d-none');
                document.getElementById('logoutButton').addEventListener('click', () => {
                    document.cookie = 'jwtToken=; Max-Age=0; path=/; SameSite=Lax;'; // Clear the cookie
                    location.reload();
                });
            } else {
                document.getElementById('auth-buttons').classList.remove('d-none');
                document.getElementById('logout-buttons').classList.add('d-none');
            }
        }
    
        function loadMenu() {
            fetch('./menu.html')
                .then(response => response.text())
                .then(data => {
                    document.getElementById('menu-container').innerHTML = data;
                    initializeLanguageSelector(); // Initialize the language selector after loading the menu
                    checkAuthStatus(); // Check auth status after loading the menu
                })
                .catch(error => console.error('Error loading menu:', error));
        }
    
        document.addEventListener('DOMContentLoaded', () => {
            console.log("DOM fully loaded and parsed");
            loadMenu();
        });
    </script>
    
</body>
</html>
