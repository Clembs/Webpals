<script lang="ts">
	let {
		name,
		selectedTab = $bindable(),
		tabs
	}: {
		name: string;
		selectedTab: string;
		tabs: {
			value: string;
			label: string;
		}[];
	} = $props();
</script>

<ul class="tabs">
	{#each tabs as tab (tab.value)}
		<li>
			<input type="radio" id={tab.value} {name} value={tab.value} bind:group={selectedTab} />
			<label for={tab.value}> {tab.label} </label>
		</li>
	{/each}
</ul>

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
</style>
