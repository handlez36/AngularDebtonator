export enum TABLE_MODE {
	VIEW,
	ADD,
	EDIT,
}

export const SETUP_UPDATE_MODE = {
	ADD: 'ADD',
	EDIT: 'EDIT',
};

export const SETUP_SAVE_STATES = {
	IDLE: 'IDLE',
	UPDATING: 'UPDATING ',
	SAVING: 'Saving...',
	SAVED: 'Saved!',
	ERROR: 'Error saving',
	CANCEL: 'CANCEL',
};
