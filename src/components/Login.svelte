<script>
    import toastr from 'toastr';
    let login_email = '';
    let login_password = '';
    import io from "socket.io-client"
    const socket = io("https://solbakken-cargo-server.onrender.com/");
    function handleLogin() {
        socket.emit('login', {email: login_email, password: login_password});
        console.log(`Logging in with email: ${login_email} and password: ${login_password}`);
    }

    //Log Messages
    socket.on('log-messages', function (data) {
        console.log(data);
        if (data.message) {
            toastr.success(data.message);
        } else {
            toastr.error(data.error);
        }
    })
</script>

<div class="login">
    <h2>Login</h2>
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
