import Input from "../../components/input/input";
import EmailIcon from "../../components/IconComponents/EmailIcon";
import { useLocation } from "preact-iso";
import { useSignal } from "@preact/signals";
import { ChangeEvent, Fragment, useContext } from "preact/compat";
import { emailRegex, passwordRegex } from "../../utils/validateInputs";
import { login } from "../../utils/http/authHttp";
import CircularLoadingSnippet from "../../components/CircularLoadingSnippet/CircularLoadingSnippet";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import { SetUserContext } from "../../contexts/userContext";

export default function LogIn() {
    const location = useLocation();

    const email = useSignal("");
    const isValidEmail = useSignal(false);

    const password = useSignal("");
    const isValidPassword = useSignal(false);

    const isFetching = useSignal(false);
    const errorMessage = useSignal(null);

    const setCurrentUser = useContext(SetUserContext);

    function onClickSignUp(event: MouseEvent) {
        event.preventDefault();
        location.route("/signUp");
    }

    function onEmailChange(event: ChangeEvent<HTMLInputElement>) {
        const target = event.target as HTMLInputElement;
        email.value = target.value;
        isValidEmail.value = emailRegex.test(email.value);
    }

    function onPasswordChange(event: ChangeEvent<HTMLInputElement>) {
        const target = event.target as HTMLInputElement;
        password.value = target.value;
        console.log(password.value);
        isValidPassword.value = passwordRegex.test(password.value);
    }

    async function onSubmitHandler(event: SubmitEvent) {
        event.preventDefault();

        if (!isValidEmail.value && !isValidPassword.value) return;
        isFetching.value = true;
        try {
            const response = await login({
                email: email.value,
                password: password.value,
            });
            console.log(response);
            errorMessage.value=null;

            setCurrentUser({
                email: response.email,
                username: response.username,
                _id: response._id,
                isAuthenticated: true
            });
            location.route("home");

        } catch (error) {
            console.error(error)
            errorMessage.value = error.toString();
        }
        isFetching.value = false;
    }

    return (
        <main class="auth-form__center">
            <form
                class="authentication-form__container"
                onSubmit={onSubmitHandler}
            >
                {errorMessage.value && <ErrorMessage message={errorMessage.value}/>}
                <h2 class="auth-form__title"> Welcome to your journal</h2>
                {isFetching.value && <CircularLoadingSnippet />}
                {!isFetching.value && (
                    <Fragment>
                        <div class="auth-form__group">
                            <label htmlFor="email-input">Email</label>
                            <Input
                                class={`full-width ${
                                    isValidEmail.value ? "valid" : "invalid"
                                }`}
                                label="Email"
                                id="email-input"
                                value={email}
                                onChange={onEmailChange}
                                required
                                type="email"
                                displayIcon
                                IconComponent={EmailIcon.bind(null, {
                                    fill: getComputedStyle(
                                        document.documentElement
                                    ).getPropertyValue("--primary-text-color"),
                                })}
                            />
                        </div>
                        <div class="auth-form__group">
                            <label htmlFor="password-input">Password</label>
                            <Input
                                class={`full-width ${
                                    isValidPassword.value ? "valid" : "invalid"
                                }`}
                                onChange={onPasswordChange}
                                label="Password"
                                id="password-input"
                                type="password"
                                value={password}
                                required
                            />
                        </div>
                    </Fragment>
                )}
                <div class="auth-form__group">
                    <button class="btn btn-solid btn-full-width btn-success">
                        Log In
                    </button>
                </div>
                <hr class="divider" />
                <div class="auth-form__group">
                    <p class="auth__secondary-text">Create an account</p>
                    <button
                        type="button"
                        onClick={onClickSignUp}
                        class="btn btn-outline btn-full-width"
                    >
                        Sign Up
                    </button>
                </div>
            </form>
        </main>
    );
}
