<script>
    import {navigate} from 'svelte-routing';
    import {socketConfig, toastr1000, toastr4000} from "../stores/globalStore.js";
    import toastr from 'toastr';
    import io from "socket.io-client";

    export let onClose;


    const socket = io(socketConfig
        , {withCredentials: true});

    let signupName = '';
    let signupEmail = '';
    let signupEmailCheck = '';
    let signupPassword = '';
    let signupPasswordCheck = '';

    function handleSignUp() {
        if (!signupName || !signupEmail || !signupEmailCheck || !signupPassword || !signupPasswordCheck) {
            toastr.error('Please fill out all fields');
            return;
        }
        if (signupEmail !== signupEmailCheck) {
            toastr.error('Emails do not match');
            return;
        }
        if (signupPassword !== signupPasswordCheck) {
            toastr.error('Passwords do not match');
            return;
        }
        onClose();
        socket.emit('subscribe-email', {username: signupName, email: signupEmail, password: signupPassword});
        console.log(`Signing up with name: ${signupName}, email: ${signupEmail}, and password: ${signupPassword}`);
    }

    //Log Messages
    socket.on('subscribe-messages', function (data) {
        if (data.message) {
            toastr.options = toastr4000
            if (data.message === 'Mail sent successfully, awaiting verification') {
                toastr.info(data.message);
                return;
            } else if (data.message === 'User already exists') {
                toastr.warning(data.message);
                return;
            }
            //toastr.success(data.message);
            toastr.options = toastr1000
        } else {
            toastr.error(data.error);
        }
    })
</script>

<main>
    <form on:submit|preventDefault={handleSignUp}>
        <div class="signup">
            <img src="https://solbakken.dk/wp-content/uploads/2017/05/cropped-cropped-Solbakken-Logo.png"
                 alt="Solbakken Logo"/>
            <div>
                <div class="mb-3">
                    <label class="form-label">Name</label>
                    <input name="signupName" bind:value={signupName} type="text" class="form-control" placeholder="Name"
                           required/>
                </div>
                <div class="mb-3">
                    <label class="form-label">Email</label>
                    <input name="signupEmail1" bind:value={signupEmail} type="email" class="form-control"
                           placeholder="Email" required pattern="[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+"/>
                    <div class="invalid-feedback">
                        Please enter a valid email address.
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Confirm Email</label>
                    <input name="signupEmail2" type="email" bind:value={signupEmailCheck} class="form-control"
                           placeholder="Confirm Email" required pattern="[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+"/>
                    <div class="invalid-feedback">
                        Please enter a valid email address.
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Password</label>
                    <input name="signupPassword1" type="password" bind:value={signupPassword} class="form-control"
                           placeholder="Password" required minlength="8"/>
                    <div class="invalid-feedback">
                        Password must be at least 8 characters long.
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Confirm Password</label>
                    <input name="signupPassword2" type="password" class="form-control" bind:value={signupPasswordCheck}
                           placeholder="Confirm Password" required minlength="8"/>
                    <div class="invalid-feedback">
                        Password must be at least 8 characters long.
                    </div>
                </div>
                <button type="submit" class="btn btn-primary">Signup</button>
            </div>
        </div>
    </form>
</main>



