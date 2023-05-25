<script>
    import {Route, Router} from "svelte-routing";
    import Navbarer from "./components/Navbarer.svelte";
    import HomePage from "./pages/HomePage.svelte";
    import io from "socket.io-client"
    import LandingPage from "./pages/LandingPage.svelte";
    import About from "./pages/About.svelte";
    import Contact from "./pages/Contact.svelte";
    import Account from "./pages/Account.svelte";
    import {onMount} from 'svelte';
    import {myUsername} from './stores/globalstore.js';

    const socket = io(import.meta.env.VITE_SOCKET_URL);
    let username;
    myUsername.subscribe(value => { username = value; });
    $: loggedIn = username !== null;

    let loggedIn = false;

    onMount(() => {
        const storedUsername = localStorage.getItem("username");
        myUsername.set(storedUsername || null);
        return myUsername.subscribe(value => {
            loggedIn = value !== null;
        });
    });

</script>

<main>
<!--    <Navbar />-->
    <Navbarer />
</main>


<Router>
    {#if loggedIn}
        <Route path="/" component={HomePage} />
        <Route path="/account" component={Account} />
    {:else}
        <Route path="/" component={LandingPage} />
    {/if}
    <Route path="/about" component={About} />
    <Route path="/contact" component={Contact} />
</Router>

<style>

</style>


