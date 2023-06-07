<script>
    import {onMount} from 'svelte';
    import toastr from 'toastr';
    import {navigate} from 'svelte-navigator';
    import io from "socket.io-client";
    import {socketConfig} from "../stores/globalStore.js";

    export let userId;
    export let uniqueString;
    let verified = false;

    let signupPassword = '';
    let signupPasswordCheck = '';

    const socket = io(socketConfig
        , {withCredentials: true});

    onMount(async () => {
        let response = await fetch(`${import.meta.env.VITE_API_URL}/reset-password/${userId}/${uniqueString}`);
        let data = await response.json();
        console.log(data)
        if (response.ok) {
            toastr.success(data.message);
            verified = true;
        } else {
            // Handle error here, maybe set a local state variable and display it in your component
            toastr.error(data.message);
        }
    });

    function handleNewPassword() {
        if (signupPassword !== signupPasswordCheck) {
            toastr.error('Passwords do not match');
            return;
        }
        socket.emit('reset-password', {
            userId: userId,
            uniqueString: uniqueString,
            password: signupPassword
        });
        socket.on('reset-password-message', (data) => {
            if (data.success) {
                toastr.success(data.message);
                navigate('/login');
            } else {
                toastr.error(data.message);
            }
        });
    }
</script>

<main>
    {#if (verified)}
        <form on:submit|preventDefault={handleNewPassword}>
            <div class="signup">
                <img src="https://solbakken.dk/wp-content/uploads/2017/05/cropped-cropped-Solbakken-Logo.png"
                     alt="Solbakken Logo"/>
                <div>
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
                        <input name="signupPassword2" type="password" class="form-control"
                               bind:value={signupPasswordCheck}
                               placeholder="Confirm Password" required minlength="8"/>
                        <div class="invalid-feedback">
                            Password must be at least 8 characters long.
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary">Signup</button>
                </div>
            </div>
        </form>
    {/if}
    {#if (!verified)}
        <h4>Verifying your account...</h4>
    {/if}
</main>



