<script>
    import { navigate } from 'svelte-routing';
    import { socket} from "../stores/globalStore.js";
    import toastr from 'toastr';

    let signupName = '';
    let signupEmail = '';
    let signupPassword = '';

    function handleSignup() {
        $socket.emit('subscribe-email', {username: signupName, email: signupEmail, password: signupPassword});
        console.log(`Signing up with name: ${signupName}, email: ${signupEmail}, and password: ${signupPassword}`);
    }

    //Log Messages
    $socket.on('subscribe-messages', function (data) {
        console.log(data);
        if (data.message) {
            toastr.success(data.message);
            if (data.loginPageUrl) {
                navigate(data.loginPageUrl); // navigate to the login page
            }
        } else {
            toastr.error(data.error);
        }
    })
</script>

<div class="signup">
    <img src="https://solbakken.dk/wp-content/uploads/2017/05/cropped-cropped-Solbakken-Logo.png" alt="Solbakken Logo"/>
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
