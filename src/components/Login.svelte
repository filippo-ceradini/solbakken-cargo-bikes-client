<script>
    import toastr from "toastr";
    import { preferences,socket } from "../stores/globalStore";
    let login_email = '';
    let login_password = '';
    async function handleLogin() {
        try {
            const response = await fetch(import.meta.env.VITE_API_URL+ '/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    password: login_password,
                    email: login_email
                }),
            });
            if (response.status === 200) {
                await preferences.update(value => {
                    console.log("data.user", login_email)
                    return {username: login_email}
                });
                await preferences.update(value => {
                    return {...value, loggedIn: true};
                });
                await preferences.update(value => {
                    return {...value, showLogin: false,};
                });
                toastr.success('Logged in successfully');
            } else if (response.status !== 200 ) {
                const errorData = await response.json();
                toastr.error(errorData.message || 'Oops! Something went wrong.');
            }
        } catch (error) {
            console.error(error);
            toastr.error("Oops! Something went wrong.");
        }
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
