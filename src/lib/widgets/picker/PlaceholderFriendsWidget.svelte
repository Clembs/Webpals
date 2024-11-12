<script lang="ts">
	import Avatar from '$lib/components/Avatar.svelte';
	import BasePlaceholderWidget from './BasePlaceholderWidget.svelte';

	let { showPicker = $bindable(false) } = $props();
</script>

<BasePlaceholderWidget bind:showPicker widget-id="friends">
	<h3>Friends</h3>
	<ul class="friends">
		<li class="friend">
			<Avatar user={{ displayName: 'placeholder' }} size="48px" />

			<div class="text">
				<div class="display-name heading">Lorem</div>
				<div class="username subtext">@lorem</div>
			</div>
		</li>
		<li class="friend">
			<Avatar user={{ displayName: 'placeholder' }} size="48px" />

			<div class="text">
				<div class="display-name heading">Ipsum</div>
				<div class="username subtext">@ipsum</div>
			</div>
		</li>
		<li class="friend">
			<Avatar user={{ displayName: 'placeholder' }} size="48px" />

			<div class="text">
				<div class="display-name heading">Dolor sit amet</div>
				<div class="username subtext">@dolor-sit-amet</div>
			</div>
		</li>
	</ul>
</BasePlaceholderWidget>

<style lang="scss">
	@use '../../../styles/mixins.scss';

	.friends {
		@include mixins.fancy-list;
		display: grid;

		.friend {
			display: flex;
			padding: calc(var(--base-padding) * 0.5) calc(var(--base-padding) * 0.75);
			gap: calc(var(--base-gap) * 0.5);
			align-items: center;
		}
	}
</style>
