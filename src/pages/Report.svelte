<script>
    import {preferences} from "../stores/globalStore.js";
    import toastr from 'toastr';
    import {navigate} from "svelte-navigator";

    let message = "";
    let email = $preferences.username;
    let photoFile;



    const onSubmit = async () => {
        toastr.info('Sending report...');
        const formData = new FormData();
        formData.append('email', email); // replace this with the user's actual email
        formData.append('message', message);
        formData.append('photo', photoFile);

        const response = await fetch(import.meta.env.VITE_API_URL+'/upload', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: formData,
        });

        if (response.ok) {
            toastr.success('Your report has been sent');
            navigate('/')
        } else {
            toastr.error('Something went wrong');
        }
    }

    const onFileChange = (event) => {
        photoFile = event.target.files[0];
    }

</script>

<main>
    <img src="https://solbakken.dk/wp-content/uploads/2017/05/cropped-cropped-Solbakken-Logo.png" alt="Solbakken Logo"/>
    <h1>Report a Problem</h1>
    <p>
        Please send a message and snap a photo of the bike
    </p>

    <form on:submit|preventDefault={onSubmit}>
        <div class="input-group">
            <label for="message">Message:</label>
            <textarea id="message" bind:value={message} placeholder="Tell us what the problem is.."></textarea>
        </div>
        <p>Snap a photo if you can!</p>
        <div class="form-group">
            <label>Select Photo:</label>
            <input accept="image/*" capture="camera" class="form-control" id="photo" name="photo" type="file" on:change={onFileChange}>
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

    .progress {
        width: 100%;
        height: 10px;
        background-color: #f5f5f5;
        border-radius: 4px;
        margin-top: 10px;
    }

    .progress-bar {
        height: 100%;
        background-color: #007bff;
        border-radius: 4px;
        transition: width 0.3s ease-in-out;
    }
</style>
