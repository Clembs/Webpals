<script lang="ts">
	import { X, MusicNote, XLogo, Globe, ArrowSquareOut } from 'phosphor-svelte';
	import BasePlaceholderWidget from './BasePlaceholderWidget.svelte';
	import AudioPlayer from '$lib/components/AudioPlayer.svelte';

	let {
		showPicker = $bindable(false)
	}: {
		showPicker: boolean;
	} = $props();

	let addWidgetMenuScroll = $state(0);
	let dialogEl = $state<HTMLDialogElement>();

	$effect(() => {
		if (showPicker) {
			dialogEl?.showModal();
		} else {
			dialogEl?.close();
		}
	});
</script>

<dialog bind:this={dialogEl} id="widget-picker" oncancel={() => (showPicker = false)}>
	<div class="header" class:scrolling={addWidgetMenuScroll}>
		<h2>Add a widget to your profile</h2>

		<form method="dialog">
			<button class="close-btn" onclick={() => (showPicker = false)}>
				<X weight="bold" />
			</button>
		</form>
	</div>

	<div
		class="scrollable"
		onscroll={(ev) => (addWidgetMenuScroll = (ev.target as HTMLUListElement).scrollTop)}
	>
		<ul class="widgets">
			<BasePlaceholderWidget widget-id="about-me">
				<h3>About me</h3>
				<p>Write a little bit about yourself.</p>
			</BasePlaceholderWidget>
			<BasePlaceholderWidget widget-id="music">
				<div class="music-widget-heading">
					<MusicNote />
					<h3>Music <span class="subtext"> Artist </span></h3>
				</div>

				<AudioPlayer
					file="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
					type="audio/mpeg"
				/>
			</BasePlaceholderWidget>
			<BasePlaceholderWidget widget-id="connections">
				<h3>Connections</h3>

				<ul class="connections-widget-list">
					<li>
						<a href="https://twitter.com">
							<div class="left">
								<XLogo weight="bold" />
								<div class="text">
									X/Twitter
									<div class="subtext">@username</div>
								</div>
							</div>
							<ArrowSquareOut />
						</a>
					</li>
					<li>
						<a href="https://twitter.com">
							<div class="left">
								<Globe />
								<div class="text">
									Website
									<div class="subtext">example.com</div>
								</div>
							</div>
							<ArrowSquareOut />
						</a>
					</li>
				</ul>
			</BasePlaceholderWidget>
		</ul>
	</div>
</dialog>

<style lang="scss">
	#widget-picker {
		bottom: var(--base-padding);
		top: auto;
		left: 50%;
		transform: translateX(-50%);

		flex-direction: column;
		background-color: var(--widgets-background-color);
		border-radius: calc(var(--widgets-border-base-radius) * 1.25);
		box-shadow: var(--widgets-box-shadow-x) var(--widgets-box-shadow-y)
			var(--widgets-box-shadow-blur) var(--widgets-box-shadow-color);
		border: var(--widgets-border-width) solid var(--widgets-border-color);
		max-height: 40vh;
		max-width: 800px;
		width: 100%;

		&[open] {
			display: flex;
		}

		.close-btn {
			background: none;
			border: none;
			cursor: pointer;
			padding: calc(var(--base-padding) * 0.5);
		}

		.header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			gap: var(--base-gap);
			padding: calc(var(--base-padding) * 1.25);
			border-bottom: var(--widgets-border-width) solid transparent;
			transition: border-color 200ms;

			&.scrolling {
				border-bottom: var(--widgets-border-width) solid var(--widgets-border-color);
			}
		}

		.scrollable {
			display: flex;
			flex-direction: column;
			overflow-y: scroll;
		}

		.widgets {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: var(--base-gap);
			list-style: none;
			padding: calc(var(--base-padding) * 1.25);
			padding-top: 0;
			margin: 0;

			@media (max-width: 950px) {
				grid-template-columns: 1fr;
			}

			.music-widget-heading {
				display: flex;
				gap: calc(var(--base-gap) * 0.5);
				align-items: center;

				.subtext {
					margin-left: calc(var(--base-gap) * 0.25);
				}
			}

			.connections-widget-list {
				display: flex;
				flex-direction: column;
				list-style: none;
				padding: 0;
				margin: 0;
				width: 100%;

				li {
					a {
						display: flex;
						justify-content: space-between;
						gap: var(--base-gap);
						text-decoration: none;
						background-color: var(--widgets-background-color-dim);
						padding: calc(var(--base-padding) * 0.75);
						// border: var(--widgets-border-width) solid var(--widgets-border-color);
						border-top: var(--widgets-border-width) solid var(--widgets-border-color);

						.left {
							display: flex;
							gap: calc(var(--base-gap) * 0.75);

							.text {
								display: flex;
								flex-direction: column;
								// gap: calc(var(--base-gap) * 0.25);
							}
						}
					}

					&:first-child a {
						border-radius: calc(var(--widgets-border-base-radius) * 0.5)
							calc(var(--widgets-border-base-radius) * 0.5) 0 0;
						border-top: none;
					}

					&:last-child a {
						border-radius: 0 0 calc(var(--widgets-border-base-radius) * 0.5)
							calc(var(--widgets-border-base-radius) * 0.5);
					}
				}
			}
		}

		@media (max-width: 800px) {
			max-height: 60vh;
			border-radius: calc(var(--widgets-border-base-radius) * 1.25)
				calc(var(--widgets-border-base-radius) * 1.25) 0 0;
			bottom: 0;
		}

		&::backdrop {
			background: rgba(0, 0, 0, 0.5);
			// display: none;

			// @media (max-width: 800px) {
			// }
		}
	}
</style>
