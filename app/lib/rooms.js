import subscribeRooms from './methods/subscriptions/rooms';
import log from '../utils/log';

const Rooms = {
	async subscribeRooms() {
		if (!this.roomsSub) {
			try {
				this.roomsSub = await subscribeRooms.call(this);
			} catch (error) {
				log(error);
			}
		}
	},
	unsubscribeRooms() {
		if (this.roomsSub) {
			this.roomsSub.stop();
			this.roomsSub = null;
		}
	}
};

export default Rooms;
