<script lang="ts">
	import { ArrowSquareOut, Globe } from 'phosphor-svelte';
	import BasePlaceholderWidget from './BasePlaceholderWidget.svelte';
	import XLogo from '$icons/brands/XLogo.svelte';

	let { showPicker = $bindable(false) } = $props();
</script>

<BasePlaceholderWidget bind:showPicker widget-id="connections">
	<h3>Connections</h3>

	<ul class="connections-widget-list">
		<li>
			<a href="https://twitter.com">
				<div class="left">
					<XLogo weight="regular" />
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

<style lang="scss">
	@use '../../../styles/mixins.scss';

	.connections-widget-list {
		@include mixins.fancy-list;

		li {
			a {
				display: flex;
				justify-content: space-between;
				gap: var(--base-gap);
				text-decoration: none;
				padding: calc(var(--base-padding) * 0.75);

				.left {
					display: flex;
					gap: calc(var(--base-gap) * 0.75);
				}
			}
		}
	}
</style>
