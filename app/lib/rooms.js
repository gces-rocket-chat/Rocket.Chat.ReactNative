const Room = {

    getRoomTitle(room) {
		const { UI_Use_Real_Name: useRealName, UI_Allow_room_names_with_special_chars: allowSpecialChars } = reduxStore.getState().settings;
		const { username } = reduxStore.getState().login.user;
		if (RocketChat.isGroupChat(room) && !(room.name && room.name.length)) {
			return room.usernames.filter(u => u !== username).sort((u1, u2) => u1.localeCompare(u2)).join(', ');
		}
		if (allowSpecialChars && room.t !== 'd') {
			return room.fname || room.name;
		}
		return ((room.prid || useRealName) && room.fname) || room.name;
	},
	getRoomAvatar(room) {
		if (RocketChat.isGroupChat(room)) {
			return room.uids?.length + room.usernames?.join();
		}
		return room.prid ? room.fname : room.name;
    }
    
}

export default Room;