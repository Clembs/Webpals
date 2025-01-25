<script lang="ts">
	import { Image } from 'phosphor-svelte';
	import type { Theme } from '../types';
	import ColorPicker from 'svelte-awesome-color-picker';

	let { theme = $bindable() }: { theme: Theme } = $props();

	let fileInput = $state<HTMLInputElement>();
</script>

<section>
	<ul class="tabs">
		<li>
			<input
				type="radio"
				id="color"
				name="background-type"
				value="color"
				bind:group={theme.background.type}
			/>
			<label for="color"> Color </label>
		</li>

		<li>
			<input
				type="radio"
				id="image"
				name="background-type"
				value="image"
				bind:group={theme.background.type}
			/>
			<label for="image"> Image </label>
		</li>
	</ul>

	{#if theme.background.type === 'image'}
		<label for="file-input">
			<input
				id="file-input"
				type="file"
				accept="image/*"
				bind:this={fileInput}
				onchange={() => {
					const file = fileInput?.files?.[0];
					if (!file) return;

					const reader = new FileReader();

					reader.onload = () => {
						if (theme.background.type === 'image') {
							theme.background.image_url = reader.result as string;
						}
					};

					reader.readAsDataURL(file);
				}}
			/>

			<div class="hover-text">
				<Image />
				Upload image
			</div>

			{#if theme.background.image_url}
				<img class="current-background" src={theme.background.image_url} alt="Background" />
			{:else}
				<div class="no-background"></div>
			{/if}
		</label>

		Recommended size: 1920x1080 pixels
	{:else if theme.background.type === 'color'}
		<ColorPicker isDialog={false} bind:hex={theme.background.color} label="Background color" />
	{/if}
</section>

<style lang="scss">
	.tabs {
		display: flex;
		gap: calc(var(--base-gap) * 0.5);
		list-style: none;
		background-color: var(--widgets-background-color-dim);
		border-radius: calc(var(--widgets-border-base-radius) + var(--base-padding) * 0.5);
		padding: calc(var(--base-padding) * 0.5);

		li {
			width: 100%;
		}

		label {
			width: 100%;
			padding: calc(var(--base-padding) * 0.75) calc(var(--base-padding) * 1.5);
			border-radius: var(--widgets-border-base-radius);
			cursor: pointer;
			text-align: center;

			&:hover {
				backdrop-filter: brightness(0.95);
			}
		}

		input {
			position: fixed;
			top: -1000px;

			&:checked + label {
				background: var(--buttons-primary-background-color);
				color: var(--buttons-primary-on-background-color);
			}

			&:focus + label {
				backdrop-filter: brightness(0.95);
			}
		}
	}

	[for='file-input'] {
		display: block;
		position: relative;
		cursor: pointer;

		.current-background {
			width: 100%;
			max-width: 100%;
			border-radius: var(--widgets-border-base-radius);
			aspect-ratio: 16 / 9;
			object-fit: cover;
		}

		&:has(.current-background) {
			.hover-text {
				display: none;
			}

			&:hover .hover-text {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				gap: 0.5rem;
				padding: calc(var(--base-padding) * 0.75) calc(var(--base-padding) * 1.5);
				border-radius: var(--widgets-border-base-radius);
				background: rgba(0, 0, 0, 0.5);
				backdrop-filter: blur(5px);
				color: var(--buttons-primary-on-background-color);
			}
		}

		input[type='file'] {
			position: fixed;
			top: -1000px;

			&:focus + .hover-text {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				gap: 0.5rem;
				padding: calc(var(--base-padding) * 0.75) calc(var(--base-padding) * 1.5);
				border-radius: var(--widgets-border-base-radius);
				background: rgba(0, 0, 0, 0.5);
				backdrop-filter: blur(5px);
				color: var(--buttons-primary-on-background-color);
			}
		}
	}
</style>
