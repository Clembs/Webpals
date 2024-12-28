<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import type { LayoutServerData } from '../$types';
	import UsernameSection from './UsernameSection.svelte';
	import { Envelope } from 'phosphor-svelte';
	import '../layout.scss';

	let { data }: { data: LayoutServerData } = $props();
</script>

<UsernameSection {data} />

<section id="email" class="settings-section">
	<h3>Email</h3>

	{#snippet email(size: number)}
		<Envelope {size} weight="regular" />
	{/snippet}

	<TextInput name="email" value={data.currentUser.email} prefixIcon={email} />

	<p>
		Your email is used to log in and receive notifications. I won't share your email address with
		anyone.
	</p>
</section>

<section id="passkeys" class="settings-section">
	<h3>Passkeys</h3>

	<p>TODO: when I implement passkeys, show them here and give options to edit/delete them.</p>
</section>

<section id="sessions" class="settings-section">
	<h3>Sessions</h3>

	<p>TODO: view a list of sessions and add controls to revoke them.</p>
</section>

<section id="delete-account" class="settings-section">
	<h3>Delete account</h3>

	<p>
		Deleting your account will permanently remove all your data from the platform. This action is
		irreversible. You may want to <a href="/settings/privacy#download">download your data</a> before
		proceeding.
	</p>

	<Button inline variant="urgent">Delete account</Button>
</section>
