<script>
    import {preferences, socket} from "../stores/globalStore.js";
    import toastr from "toastr";

    async function login() {
        console.log("login")
        const response = await fetch('http://localhost:8080/login', {

            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // This is important for sending and receiving cookies
            body: JSON.stringify({
                email: 'murray88mph@gmail.com',
                password: 'password',
            }),
        });

        const data = await response.json();
        console.log(data); // Log the server's response to the console
    }


    async function testSession() {
        try {
            const response = await fetch('http://localhost:8080/user', {
                method: 'GET',
                credentials: 'include', // Needed to include the session cookie in the request
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data); // This will log the response data (the user's email) to the console

        } catch (error) {
            console.log('Error:', error);
            toastr.error("Oops! Something went wrong.");
        }
        $socket.emit("session", "test")
    }

    function logout(){
        console.log("logout")
    }

</script>


<main>
    <nav class="navbar navbar-expand-lg navbar-dark bg-light fixed-top ">
        <a class="navbar-brand" href="#">Navbar</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse"
                data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
                <li class="nav-item active">
                    <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Link</a>
                </li>

                <li class="nav-item">
                    <a class="nav-link disabled" href="#">Disabled</a>
                </li>
            </ul>
            <ul class="navbar-nav ml-auto">
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Dropdown
                    </a>
                    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                        <a class="dropdown-item" href="#">Action</a>
                        <a class="dropdown-item" href="#">Another action</a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" href="#">Something else here</a>
                    </div>
                </li>
            </ul>
        </div>
    </nav>
    <button on:click={login}>Test Login</button>
    <button on:click={testSession}>Check Session</button>
    <button on:click={logout}>Logout</button>
</main>