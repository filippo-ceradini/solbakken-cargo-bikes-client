<script>
    import {Route, Router} from "svelte-routing";
    import Navbar from "./components/Navbar.svelte";
    import HomePage from "./pages/HomePage.svelte";
    import io from "socket.io-client"
    import LandingPage from "./pages/LandingPage.svelte";
    import About from "./pages/About.svelte";
    import Contact from "./pages/Contact.svelte";
    import Account from "./pages/Account.svelte";
    import {onMount} from 'svelte';
    import { preferences } from './stores/globalstore.js';
    const socket = io(import.meta.env.BASE_URL)

    let loggedIn;
    preferences.subscribe(value => {
        loggedIn = value.loggedIn
    })
</script>

<main>
    <Navbar />
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


