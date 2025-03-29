import Input from "../../components/input/input";
import EmailIcon from "../../components/IconComponents/EmailIcon";
import UserIcon from "../../components/IconComponents/UserIcon";
import { useLocation } from 'preact-iso';
import { useSignal } from "@preact/signals";
import { ChangeEvent } from "preact/compat";
import { emailRegex, passwordRegex, usernameRegex } from "../../utils/validateInputs";
import { signUp } from "../../utils/http/authHttp";




export default function SignUp() {
    const location = useLocation();

    const email = useSignal("");
    const isValidEmail = useSignal(false);

    const username = useSignal("");
    const isValidUsername = useSignal(false);

    const password = useSignal("");
    const isValidPassword = useSignal(false);

    const repeatPassword = useSignal("");
    const isValidRepeatPassword = useSignal(false);

    function onClickLogIn (event: MouseEvent) {
        location.route("/login");
    }

    function onEmailChange (event: ChangeEvent<HTMLInputElement>) {
        const target = event.target as HTMLInputElement;
        email.value = target.value;
        isValidEmail.value = emailRegex.test(email.value);
    }

    function onChangeUserName (event: ChangeEvent<HTMLInputElement>) {
        const target = event.target as HTMLInputElement;
        username.value = target.value;
        isValidUsername.value = usernameRegex.test(username.value);
    }

    function onPasswordChange (event: ChangeEvent<HTMLInputElement>) {
        const target = event.target as HTMLInputElement;
        password.value = target.value;
        console.log(password.value)
        isValidPassword.value = passwordRegex.test(password.value);
    }

    function onRepeatPasswordChange (event: ChangeEvent<HTMLInputElement>) {
        const target = event.target as HTMLInputElement;
        repeatPassword.value = target.value;
        isValidRepeatPassword.value = isValidPassword.value && repeatPassword.value === password.value
    }

    async function onSubmitHandler (event: SubmitEvent) {
        event.preventDefault();
        if(!(isValidEmail.value && isValidPassword.value && isValidUsername && isValidRepeatPassword)) return;

        const message = await signUp({
            email: email.value,
            username: username.value,
            password: password.value 
        });

        console.log(message);
    }

    return (
        <main class="auth-form__center">
            <form class="authentication-form__container" onSubmit={onSubmitHandler}>
                <h2 class="auth-form__title"> Welcome to your journal</h2>
                <div class="auth-form__group">
                    <label htmlFor="email-input">Email</label>
                    <Input
                        class= {`full-width ${isValidEmail.value ? "valid" : "invalid"}`}
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
                    <label htmlFor="user-input">Username</label>
                    <Input
                        class= {`full-width ${isValidUsername.value ? "valid" : "invalid"}`}
                        label="Email"
                        id="user-input"
                        value={username}
                        onChange={onChangeUserName}
                        required
                        type="text"
                        displayIcon
                        IconComponent={UserIcon.bind(null, {
                            fill: getComputedStyle(
                                document.documentElement
                            ).getPropertyValue("--primary-text-color"),
                        })}
                    />
                </div>
                <div class="auth-form__group">
                    <label htmlFor="password-input">Password</label>
                    <Input
                        class= {`full-width ${isValidPassword.value ? "valid" : "invalid"}`}
                        onChange={onPasswordChange}
                        label="Password"
                        id="password-input"
                        type="password"
                        value={password}
                        required
                    />
                </div>
                <div class="auth-form__group">
                    <label htmlFor="repeatPassword-input">Repeat Password</label>
                    <Input
                        class= {`full-width ${isValidRepeatPassword.value ? "valid" : "invalid"}`}
                        onChange={onRepeatPasswordChange}
                        label="Repeat password"
                        id="repeatPassword-input"
                        type="password"
                        value={repeatPassword}
                        required
                    />
                </div>
                <div class="auth-form__group">
                    <button class="btn btn-solid btn-full-width btn-success">
                        Create Account
                    </button>
                </div>
                <hr class="divider" />
                <div class="auth-form__group">
                    <p class="auth__secondary-text">If you already have an account</p>
                    <button type="button" onClick={onClickLogIn}  class="btn btn-outline btn-full-width">
                        Log In
                    </button>
                </div>
            </form>
        </main>
    );
}
