<script>
    import { navigate } from 'svelte-routing';
    let signupName = '';
    let signupEmail = '';
    let signupPassword = '';

    function handleSignup() {
        // handle the signup logic here
        console.log(`Signing up with name: ${signupName}, email: ${signupEmail}, and password: ${signupPassword}`);
    }
    import toastr from 'toastr';

    import io from "socket.io-client"
    const socket = io("https://solbakken-cargo-server.onrender.com/");
    function handleLogin() {
        socket.emit('subscribe-email', {name: signupName, email: signupEmail, password: signupPassword});
    }

    //Log Messages
    socket.on('log-messages', function (data) {
        console.log(data);
        if (data.message) {
            toastr.success(data.message);
            navigate('/');
        } else {
            toastr.error(data.error);
        }
    })
</script>

<div class="signup">
    <h2>Signup</h2>
    <div class="mb-3">
        <label class="form-label">Name</label>
        <input bind:value={signupName} type="text" class="form-control" placeholder="Name" required/>
    </div>
    <div class="mb-3">
        <label class="form-label">Email</label>
        <input bind:value={signupEmail} type="email" class="form-control" placeholder="Email" required/>
    </div>
    <div class="mb-3">
        <label class="form-label">Password</label>
        <input bind:value={signupPassword} type="password" class="form-control" placeholder="Password" required/>
    </div>
    <button on:click={handleSignup} class="btn btn-primary">Signup</button>
</div>
