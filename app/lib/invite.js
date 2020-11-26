const Invite = {

    findOrCreateInvite({ rid, days, maxUses }) {
		// RC 2.4.0
		return this.post('findOrCreateInvite', { rid, days, maxUses });
	},
	validateInviteToken(token) {
		// RC 2.4.0
		return this.post('validateInviteToken', { token });
	},
	useInviteToken(token) {
		// RC 2.4.0
		return this.post('useInviteToken', { token });
	}

}

export default Invite;
