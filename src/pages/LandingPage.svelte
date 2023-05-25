<script>
    import Login from "../components/Login.svelte";
    import Signup from "../components/Signup.svelte";
    import Modal from "../components/Modal.svelte";
    let data;
    let showLogin = false;
    let showSignUp = false;

    const onShowLogin = () => {
        showLogin = true;
    }

    const onShowSignUp = () => {
        showSignUp = true;
    }

    const onPopupClose = () => {
        showLogin = false;
        showSignUp = false;
    }



</script>


<main>
    <img src="https://solbakken.dk/wp-content/uploads/2017/05/cropped-cropped-Solbakken-Logo.png" alt="Solbakken Logo"/>
    <h1>Solbakken Cargo Bikes</h1>
    <p>
        You can use this website to check the availability of the bikes here at Solbakken.
        <br/>

        Login and have Fun!


    </p>
    <button type="button" class="btn-dark" on:click={onShowLogin}>Login</button>
    <button type="button" class="btn-dark" on:click={onShowSignUp}>SignUp</button>


    <Modal open={showLogin} title="Login" onClosed={(data) => onPopupClose(data)}>
        <Login/>
    </Modal>
    <Modal open={showSignUp} title="Sign-up" onClosed={(data) => onPopupClose(data)}>
        <Signup/>
    </Modal>

</main>