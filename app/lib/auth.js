import RocketChat from './rocketchat';
import { loginRequest } from '../actions/login';
import reduxStore from './createStore';

export function loginWithPassword({ user, password }) {
	let params = { user, password };
	const state = reduxStore.getState();

	if (state.settings.LDAP_Enable) {
		params = {
			username: user,
			ldapPass: password,
			ldap: true,
			ldapOptions: {}
		};
	} else if (state.settings.CROWD_Enable) {
		params = {
			username: user,
			crowdPassword: password,
			crowd: true
		};
	}

	return RocketChat.loginTOTP(params, true);
}
export async function loginOAuthOrSso(params) {
	const result = await RocketChat.login(params);
	reduxStore.dispatch(loginRequest({ resume: result.token }));
}
