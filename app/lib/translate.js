const Translate = {
    async canAutoTranslate() {
		const db = database.active;
		try {
			const AutoTranslate_Enabled = reduxStore.getState().settings && reduxStore.getState().settings.AutoTranslate_Enabled;
			if (!AutoTranslate_Enabled) {
				return false;
			}
			const permissionsCollection = db.collections.get('permissions');
			const autoTranslatePermission = await permissionsCollection.find('auto-translate');
			const userRoles = (reduxStore.getState().login.user && reduxStore.getState().login.user.roles) || [];
			return autoTranslatePermission.roles.some(role => userRoles.includes(role));
		} catch (e) {
			log(e);
			return false;
		}
	},
	saveAutoTranslate({
		rid, field, value, options
	}) {
		return this.methodCallWrapper('autoTranslate.saveSettings', rid, field, value, options);
	},
	getSupportedLanguagesAutoTranslate() {
		return this.methodCallWrapper('autoTranslate.getSupportedLanguages', 'en');
	},
	translateMessage(message, targetLanguage) {
		return this.methodCallWrapper('autoTranslate.translateMessage', message, targetLanguage);
	}
}

export default Translate;