import { Q } from '@nozbe/watermelondb';
import reduxStore from './createStore';
import database from './database';
import returnAnArray from './rocketchat';
import log from '../utils/log';

export async function hasPermission(permissions, rid) {
	const db = database.active;
	const subsCollection = db.collections.get('subscriptions');
	const permissionsCollection = db.collections.get('permissions');
	let roomRoles = [];
	try {
		const room = await subsCollection.find(rid);
		roomRoles = room.roles || [];
	} catch (error) {
		return permissions.reduce((result, permission) => {
			result[permission] = false;
			return result;
		}, {});
	}
	try {
		const permissionsFiltered = await permissionsCollection.query(Q.where('id', Q.oneOf(permissions))).fetch();
		const shareUser = reduxStore.getState().share.user;
		const loginUser = reduxStore.getState().login.user;
		const userRoles = (shareUser?.roles || loginUser?.roles) || [];
		const mergedRoles = [...new Set([...roomRoles, ...userRoles])];
		return permissions.reduce((result, permission) => {
			result[permission] = false;
			const permissionFound = permissionsFiltered.find(p => p.id === permission);
			if (permissionFound) {
				result[permission] = returnAnArray(permissionFound.roles).some(r => mergedRoles.includes(r));
			}
			return result;
		}, {});
	} catch (e) {
		log(e);
	}
}
