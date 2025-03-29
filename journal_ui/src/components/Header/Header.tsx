import { useLocation } from 'preact-iso';
import "./Header.css";

export function Header() {
	const { url } = useLocation();

	return (
		<header>
			<nav class="navbar__container">
				<div class="navbar__app">
					Journal
				</div>
				<div class="navbar__menu">
					<a href="/login" class={url == "/login" && "active"}>
						Log In
					</a>
					<a href="/signUp" class={url == "/signUp" && "active"}>
						Sign Up
					</a>
				</div>
			</nav>
		</header>
	);
}
