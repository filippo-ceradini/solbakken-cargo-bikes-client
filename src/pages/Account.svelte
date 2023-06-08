<script>
    import io from "socket.io-client"
    import {preferences, socketConfig, toastr1000, toastr4000} from "../stores/globalStore.js";
    import toastr from "toastr";
    import {navigate} from "svelte-navigator";
    import {onMount} from "svelte";

    let name = '';
    let email = '';
    let password = '';
    let userId = '';

    const socket = io(socketConfig, {
        withCredentials: true
    });
    onMount(async ()=>{
        //Retrieve data from the server
        const response = await fetch(import.meta.env.VITE_API_URL + '/api/user-info', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        // This will log the response data (the user's email) to the console
        if (data !== undefined) {
            toastr.info("User information retrieved.");
            name = data.username;
            email = data.email;
            userId = data.id;
        } else {
            toastr.info("Troubles retrieving user information. Please login again.");
            $preferences.loggedIn = false;
        }
    })
    const onSubmit = () => {
        toastr.info("Updating user profile...");
        const data = {
            id: userId,
            username: name,
            email: email}
        socket.emit("updateUser", data);
        socket.on("user-messages", function (data) {
            if (data.status === 200) {
                toastr.options = toastr4000;
                toastr.success(data.message);
                toastr.options = toastr1000;
                name = '';
                email = '';
                password = '';
                navigate("/");
            } else {
                toastr.error("Error: " + data.message);
            }
        });
    }
</script>

<main>
    <img src="https://solbakken.dk/wp-content/uploads/2017/05/cropped-cropped-Solbakken-Logo.png" alt="Solbakken Logo"/>
    <h1>{$preferences.username} Profile</h1>
    <p>
        You can use the following to update your information.
    </p>

    <form on:submit|preventDefault={onSubmit}>
        <div class="input-group">
            <label for="name">Name:</label>
            <input id="name" type="text" placeholder={name} bind:value={name} required/>
        </div>

        <div class="input-group">
            <label for="email">Email:</label>
            <input id="email" type="email" placeholder={email} bind:value={email} required/>
        </div>

        <div class="btn-group-vertical">
            <button type="submit" class="btn-dark">Update</button>
        </div>
    </form>
</main>

<style>
    .input-group {
        display: flex;
        flex-direction: column;
        margin-bottom: 1em;
    }

    .input-group label {
        margin-bottom: 0.5em;
    }

    .input-group input, .input-group textarea {
        width: 100%;
        padding: 0.5em;
    }

    .btn-group-vertical {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .btn-dark {
        margin: 5px;
    }
</style>
