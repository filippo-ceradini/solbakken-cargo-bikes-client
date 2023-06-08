<script>
    import toastr from "toastr";
    import io from "socket.io-client";

    const socket = io(import.meta.env.VITE_SOCKET_URL, {withCredentials: true} );
    socket.on("connect", () => {
        socket.emit("test", {message: "test"})
    });

    async function login() {
        try {
            const response = await fetch(import.meta.env.VITE_API_URL +'/user', {
                method: 'GET',
                credentials: 'include', // Needed to include the session cookie in the request
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            console.log(data); // This will log the response data (the user's email) to the console
            if (data.user.email) {
                toastr.success("You are logged in as " + data.user.email);
            }
        } catch (error) {
            console.log('Error:', error);
            toastr.error("Oops! Something went wrong.");
        }
        socket.emit("session", "test")
    }


    async function testSession() {
        try {
            const response = await fetch(import.meta.env.VITE_API_URL +'/api/user', {
                method: 'GET',
                credentials: 'include', // Needed to include the session cookie in the request
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            console.log(data); // This will log the response data (the user's email) to the console
            if (data.user.email) {
                toastr.success("You are logged in as " + data.user.email);
            }
        } catch (error) {
            console.log('Error:', error);
            toastr.error("Oops! Something went wrong.");
        }
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
        socket.on("session", (data) => {
            console.log(data)
            if (data.user.email) {
                toastr.success("You are logged in as " + data.user.email);
            } else if (data){
                toastr.error("You are not logged in");
            }
        })
    }

    function logoutSocket(){
        console.log("logout socket")
        // socket.emit("logout", "test")
    }
</script>


<main>
    <div>
        <button on:click={login}>Check express unauth</button>
        <button on:click={testSession}>Check Session express</button>
        <button on:click={logout}>Logout express</button>
    </div>
    <div>
        <button on:click={loginSocket}>Test Login Socket</button>
        <button on:click={testSessionSocket}>Check Session Socket</button>
        <button on:click={logoutSocket}>Logout Socket</button>
    </div>
</main>