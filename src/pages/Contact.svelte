<script>
    import io from "socket.io-client"
    import {socketConfig, toastr1000, toastr4000} from "../stores/globalStore.js";
    import toastr from "toastr";
    import {navigate} from "svelte-navigator";

    let name = '';
    let email = '';
    let message = '';

    const socket = io(socketConfig, {
        withCredentials: true
    });

    const onSubmit = () => {
        // Handle form submission here
        toastr.info("Sending email...");
        // Send Email
        socket.emit("contact-email", {name, email, message});
        socket.on("contact-response", function (data) {
            if (data.status === 200) {
                toastr.options = toastr4000;
                toastr.success(data.message);
                toastr.options = toastr1000;
                name = '';
                email = '';
                message = '';
                navigate("/");
            } else {
                toastr.error("Error: " + data.message);
            }
        });
    }
</script>

<main>
    <img src="https://solbakken.dk/wp-content/uploads/2017/05/cropped-cropped-Solbakken-Logo.png" alt="Solbakken Logo"/>
    <h1>Contact Us</h1>
    <p>
        Please fill out the form below and we will get back to you as soon as possible.
    </p>

    <form on:submit|preventDefault={onSubmit}>
        <div class="input-group">
            <label for="name">Name:</label>
            <input id="name" type="text" bind:value={name} required/>
        </div>

        <div class="input-group">
            <label for="email">Email:</label>
            <input id="email" type="email" bind:value={email} required/>
        </div>

        <div class="input-group">
            <label for="message">Message:</label>
            <textarea id="message" bind:value={message} required></textarea>
        </div>

        <div class="btn-group-vertical">
            <button type="submit" class="btn-dark">Submit</button>
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
