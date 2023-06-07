<script>
    import { onMount } from 'svelte';
    import toastr from 'toastr';
    import { navigate } from 'svelte-navigator';
    export let userId;
    export let uniqueString;
    let verified = false;

    onMount(async () => {
        let response = await fetch(`${import.meta.env.VITE_API_URL}/verify/${userId}/${uniqueString}`);
        let data = await response.json();
        console.log(data)
        if (response.ok) {
            toastr.success(data.message);
            verified = true;
            setTimeout(() => {
                navigate('/');
            }, 3000);
        } else {
            // Handle error here, maybe set a local state variable and display it in your component
            toastr.error(data.message);
        }
    });
</script>

{#if (verified)}
    <h4>Verified!</h4>
<!--    <a on:keypress on:click={() =>{navigate('/')}}>Home</a>-->
{/if}

{#if (!verified)}
    <h4>Verifying your account...</h4>
{/if}
