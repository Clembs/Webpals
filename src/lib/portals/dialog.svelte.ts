import type { Snippet } from 'svelte';

type DialogStateSnapshot = {
	component: Snippet<[unknown]>;
	props?: Record<string, unknown>;
	options: {
		allowClickOutside: boolean;
	};
};

class DialogPortal {
	current = $state<DialogStateSnapshot>();
	history = $state<DialogStateSnapshot[]>([]);
	previous = $state<DialogStateSnapshot>();

	// the previous attribute is only used to keep track of the last dialog for a sec
	// we do this because the Esc key always closes a dialog, but if we want to
	// close something else with Esc, the dialog always closes first
	// so we can't check if the dialog is open by checking if there's a current dialog
	// because it will always be false, therefore we keep the previous dialog for a sec
	//
	// hope it makes sense and that im just not a bad programmer lmaao
	wasOpened() {
		return this.previous !== undefined;
	}

	openDialog(
		component: Snippet,
		props?: Record<string, unknown>,
		options: DialogStateSnapshot['options'] = { allowClickOutside: true }
	) {
		this.current = { component, props, options };
		this.history = [...this.history, this.current];
	}

	closeDialog() {
		this.history = this.history.slice(0, -1);
		this.previous = this.current;
		this.current = this.history.at(-1);
		setTimeout(() => {
			this.previous = undefined;
		}, 1000);
	}

	clearHistory() {
		// remove dialogs one by one with a 100ms delay
		const clear = () => {
			if (this.history.length > 0) {
				this.closeDialog();
				setTimeout(clear, 100);
			}
		};

		clear();
	}
}

export const dialogPortal = new DialogPortal();
