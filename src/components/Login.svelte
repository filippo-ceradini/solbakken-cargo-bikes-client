<script>
    let login_email = '';
    let login_password = '';
    import io from "socket.io-client"
    const socket = io(import.meta.env.VITE_SOCKET_URL);
    import {myUsername} from "../stores/globalStore";
    let username;
    myUsername.subscribe(value => { username = value; });
    $: loggedIn = username !== null;
    function handleLogin() {
        socket.emit('login', {email: login_email, password: login_password});
        socket.on('log-messages', (data) => {
            if (data.success) {
                myUsername.set(data.user);
                localStorage.setItem("username", data.user);
            } else {
                alert('Wrong email or password');
            }
        });
    }

</script>

<div class="login">
    <img src="https://solbakken.dk/wp-content/uploads/2017/05/cropped-cropped-Solbakken-Logo.png" alt="Solbakken Logo"/>
    <div class="mb-3">
        <label class="form-label" for="email">Email</label>
        <input id="email" bind:value={login_email} type="email" class="form-control" placeholder="Email" required/>
    </div>
    <div class="mb-3">
        <label class="form-label" for="password">Password</label>
        <input id="password" bind:value={login_password} type="password" class="form-control" placeholder="Password" required/>
    </div>
    <button on:click={handleLogin} class="btn btn-primary">Login</button>
</div>
