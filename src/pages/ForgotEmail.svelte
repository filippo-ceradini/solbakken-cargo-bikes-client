<script>
    import { onMount } from 'svelte';
    import toastr from 'toastr';
    import { navigate } from 'svelte-navigator';
    export let userId;
    export let uniqueString;
    let verified = false;

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
</script>

{#if (verified)}
    <!-- insert new password-->
    <h4>Hello ${userId}</h4>
    <br>
    <p>You can insert your new password here</p>
    <input>

{/if}

{#if (!verified)}
    <h4>Verifying your account...</h4>
{/if}
