import { takeLatest, select } from 'redux-saga/effects';

import RocketChat from '../lib/rocketchat';
import { setBadgeCount } from '../notifications/push';
import log from '../utils/log';
import { localAuthenticate, saveLastLocalAuthenticationSession } from '../utils/localAuthentication';
import { APP_STATE } from '../actions/actionsTypes';
import { ROOT_OUTSIDE } from '../actions/app';

function* getApplicationRoot() {
	const applicationRoot = yield select(state => state.app.root);

	return applicationRoot;
}

function* getAuthentication() {
	const authentication = yield select(state => state.login.isAuthenticated);

	return authentication;
}

function* getLocalAuthentication() {
	const localAuthenticated = yield select(state => state.login.isLocalAuthenticated);

	return localAuthenticated;
}

const appHasComeBackToForeground = function* appHasComeBackToForeground() {
	if (getApplicationRoot() === ROOT_OUTSIDE || !getAuthentication()) {
		return;
	}

	try {
		const server = yield select(state => state.server.server);
		yield localAuthenticate(server);
		setBadgeCount();
		return yield RocketChat.setUserPresenceOnline();
	} catch (e) {
		log(e);
	}
};

const appHasComeBackToBackground = function* appHasComeBackToBackground() {
	if (getApplicationRoot() === ROOT_OUTSIDE || !getAuthentication() || !getLocalAuthentication()) {
		return;
	}

	try {
		const server = yield select(state => state.server.server);
		yield saveLastLocalAuthenticationSession(server);

		yield RocketChat.setUserPresenceAway();
	} catch (e) {
		log(e);
	}
};

const root = function* root() {
	yield takeLatest(APP_STATE.FOREGROUND, appHasComeBackToForeground);
	yield takeLatest(APP_STATE.BACKGROUND, appHasComeBackToBackground);
};

export default root;
