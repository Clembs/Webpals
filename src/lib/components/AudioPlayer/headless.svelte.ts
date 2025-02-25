export class AudioPlayer {
	public audioEl: HTMLAudioElement;
	// internal state for paused state (so you can dynamically get/set it)
	private pausedState = $state(true);

	/**
	 * creates a headless audio player
	 * @param audioElOrSrc an audio element, or a string URL (used as the source)
	 * @param metadata metadata for the mediaSession API
	 */
	constructor(audioElOrSrc?: HTMLAudioElement, metadata?: MediaMetadataInit);
	constructor(audioElOrSrc?: string, metadata?: MediaMetadataInit);
	constructor(
		audioElOrSrc?: string | HTMLAudioElement,
		public metadata?: MediaMetadataInit
	) {
		if (audioElOrSrc && audioElOrSrc instanceof HTMLAudioElement) {
			this.audioEl = audioElOrSrc;
			this.createMediaSession();
		} else {
			this.audioEl = new Audio(audioElOrSrc);
			this.createMediaSession();
		}

		this.audioEl.addEventListener('ended', () => {
			this.destroy();
		});
	}

	// toggles playback
	// when paused, it plays and creates mediaSession metadata & handlers
	public togglePlayback() {
		if (this.pausedState) {
			this.play();
			// pause audio from all other players
			document.querySelectorAll('audio').forEach((el) => {
				if (el !== this.audioEl) el.pause();
			});
			// create mediaSession metadata & handlers for the playing audio
			this.createMediaSession();
		} else {
			this.pause();
		}
	}

	public play() {
		this.audioEl.play();
		this.pausedState = false;
	}

	public pause() {
		this.audioEl.pause();
		this.pausedState = true;
	}

	public toggleMute() {
		this.audioEl.muted = !this.audioEl.muted;
	}

	// creates mediaSession metadata & handlers
	private createMediaSession() {
		if (!navigator.mediaSession || !this.metadata) return;
		navigator.mediaSession.metadata = new MediaMetadata(this.metadata);

		navigator.mediaSession.setActionHandler('play', () => this.play());
		navigator.mediaSession.setActionHandler('pause', () => this.pause());
		navigator.mediaSession.setActionHandler('seekbackward', () => {
			this.audioEl.currentTime -= 10;
		});
		navigator.mediaSession.setActionHandler('seekforward', () => {
			this.audioEl.currentTime += 10;
		});
		navigator.mediaSession.setActionHandler('previoustrack', () => {
			this.audioEl.currentTime = 0;
		});
		navigator.mediaSession.setActionHandler('nexttrack', () => {
			this.audioEl.currentTime = this.audioEl.duration;
		});
		navigator.mediaSession.setActionHandler('stop', () => {
			this.pause();
			this.audioEl.currentTime = 0;
		});
	}

	public destroy() {
		this.pause();
		this.audioEl.remove();

		// cleans up mediaSession metadata & handlers
		if (!navigator.mediaSession || !this.metadata) return;
		navigator.mediaSession.metadata = null;
		navigator.mediaSession.setActionHandler('play', null);
		navigator.mediaSession.setActionHandler('pause', null);
		navigator.mediaSession.setActionHandler('seekbackward', null);
		navigator.mediaSession.setActionHandler('seekforward', null);
		navigator.mediaSession.setActionHandler('previoustrack', null);
		navigator.mediaSession.setActionHandler('nexttrack', null);
		navigator.mediaSession.setActionHandler('stop', null);
	}

	// getter & setter for paused state
	get paused() {
		return this.pausedState;
	}

	set paused(val: boolean) {
		this.pausedState = val;
	}
}
