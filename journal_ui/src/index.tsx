import { render } from 'preact';
import { LocationProvider, Router, Route } from 'preact-iso';

import { Header } from './components/Header/Header.js';
import { Home } from './pages/Home/Home.js';
import { NotFound } from './pages/_404.jsx';
import { JournalEditor } from './components/JournalEditor/JournalEditor.js';
import LogIn from './pages/LogIn/Login.js';
import SignUp from './pages/SignUp/SignUp.js';
import './style.css';
import { UserContext, UserProvider } from './contexts/userContext.js';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.js';
import JournalEditorPage from './pages/JournalEditorPage/JournalEditorPage.js';
import { useContext, useEffect } from 'preact/hooks';

export function App() {

	return (
		<div class="app_container">
			<LocationProvider>
				<UserProvider>
				<Header />
					<Router>
						<Route path="/login" component={LogIn} />
						<Route path="/signUp" component={SignUp} />
						<ProtectedRoute path="/home" component={Home} />
						<ProtectedRoute path="/journal_editor/:id" component={JournalEditorPage} />
						<Route default component={NotFound} />
					</Router>
				</UserProvider>
			</LocationProvider>
		</div>
		
	);
}

render(<App />, document.getElementById('app'));
