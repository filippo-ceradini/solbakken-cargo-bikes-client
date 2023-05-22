<script>
    import toastr from 'toastr';
    import Login from "./components/Login.svelte";
    import Signup from "./components/Signup.svelte";
    import Navbar from "./components/Navbar.svelte";
    let showSignup = false;

    import io from "socket.io-client"
    const socket = io("https://solbakken-cargo-server.onrender.com/");
</script>

<main>
    <Navbar />
    <img src="https://solbakken.dk/wp-content/uploads/2017/05/cropped-cropped-Solbakken-Logo.png" alt="Solbakken Logo" />
    <h1>Solbakken Cargo Bikes</h1>
    <p>
        Login and have Fun!
    </p>
    {#if !showSignup}
        <Login />
        <p>Don't have an account? <a href="#" on:click|preventDefault={() => showSignup = true}>Sign up</a></p>
    {/if}
    {#if showSignup}
        <Signup />
        <p>Already have an account? <a href="#" on:click|preventDefault={() => showSignup = false}>Log in</a></p>
    {/if}
</main>

<style>
    /* Add your global styles here */
</style>
