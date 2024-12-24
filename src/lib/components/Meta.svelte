<script lang="ts">
	import { page } from '$app/state';

	type OGMediaProps = {
		url: string;
		type: string;
		width: number;
		height: number;
		alt: string;
	};

	let {
		title,
		description,
		image,
		video,
		robotsIndexing = false
	}: {
		title?: string;
		description: string;
		image?: string | OGMediaProps;
		video?: OGMediaProps;
		robotsIndexing?: boolean;
	} = $props();
</script>

<svelte:head>
	<!-- title  -->
	{#if title}
		<title>{title} | Islands</title>
		<meta name="title" content={title} />
		<meta property="og:title" content={title} />
		<meta name="twitter:title" content={title} />
	{:else}
		<title>Islands</title>
		<meta name="title" content="Islands" />
		<meta property="og:title" content="Islands | Fun mini profiles for everyone" />
		<meta name="twitter:title" content="Islands | Fun mini profiles for everyone" />
	{/if}

	<!-- description -->
	<meta name="description" content={description} />
	<meta property="og:description" content={description} />
	<meta name="twitter:description" content={description} />

	<!-- url -->
	<link rel="canonical" href={page.url.href} />
	<meta property="og:url" content={page.url.href} />

	<!-- site name -->
	<meta property="og:site_name" content="Islands" />
	<meta name="author" content="Islands" />

	<!-- indexing -->
	<!-- TODO: robots.txt -->
	{#if robotsIndexing}
		<meta name="robots" content="follow,index" />
		<meta name="googlebot" content="follow,index" />
	{:else}
		<meta name="robots" content="noindex,nofollow" />
		<meta name="googlebot" content="noindex,nofollow" />
	{/if}

	<!-- image -->
	{#if image}
		{#if typeof image === 'string'}
			<meta property="og:image" content={image} />
			<meta name="image" content={image} />
			<meta name="twitter:image" content={image} />
			<meta name="twitter:card" content="summary_large_image" />
		{:else}
			<meta name="image" content={image.url} />
			<meta name="twitter:image" content={image.url} />
			<meta
				name="twitter:image"
				content={image.width !== image.height ? 'summary_large_image' : 'summary_small_image'}
			/>
			<meta property="og:image:url" content={image.url} />
			<meta property="og:image:type" content={image.type} />
			<meta property="og:image:width" content={image.width.toString()} />
			<meta property="og:image:height" content={image.height.toString()} />
			<meta property="og:image:alt" content={image.alt} />
		{/if}
	{/if}

	<!-- video -->
	{#if video}
		<meta property="og:video:url" content={video.url} />
		<meta property="og:video:type" content={video.type} />
		<meta property="og:video:width" content={video.width.toString()} />
		<meta property="og:video:height" content={video.height.toString()} />
		<meta property="og:video:alt" content={video.alt} />
	{/if}

	<!-- misc -->
	<meta property="og:type" content="website" />
	<meta name="twitter:site" content="@clembsv" />
</svelte:head>
