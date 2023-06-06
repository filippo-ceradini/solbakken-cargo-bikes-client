<script>
    import {preferences } from "../stores/globalStore.js";
    import toastr from "toastr";
    import io from "socket.io-client";

    const socket = io(import.meta.env.VITE_SOCKET_URL);
    socket.on("connect", () => {
        socket.emit("test", {message: "test"})
    });

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
            const response = await fetch(import.meta.env.VITE_API_URL +'/user', {
                method: 'GET',
                credentials: 'include', // Needed to include the session cookie in the request
                headers: {
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
        socket.emit("session", "test")
    }

    function logout(){
        console.log("logout")
    }

    function loginSocket(){
        console.log("login socket")
        socket.emit("login", {email: "billy", password: "password"})
    }

    function testSessionSocket(){
        console.log("test socket session")
        socket.emit("test socket session", "test")
    }

    function logoutSocket(){
        console.log("logout socket")
        // socket.emit("logout", "test")
    }
</script>


<main>
    <div>
        <button on:click={login}>Test Login express</button>
        <button on:click={testSession}>Check Session express</button>
        <button on:click={logout}>Logout express</button>
    </div>
    <div>
        <button on:click={loginSocket}>Test Login Socket</button>
        <button on:click={testSessionSocket}>Check Session Socket</button>
        <button on:click={logoutSocket}>Logout Socket</button>
    </div>
</main>