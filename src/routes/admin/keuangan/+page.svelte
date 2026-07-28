<script lang="ts">
	import { resolve } from '$app/paths';
	import { formatFinanceDate, formatRupiah } from '$lib/domain/finance';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
	const filterActive = $derived(
		Boolean(data.filters.fundId || data.filters.type || data.filters.from || data.filters.to)
	);
</script>

<svelte:head>
	<title>Keuangan | Ar-Rahmah</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<header class="flex flex-wrap items-end justify-between gap-4">
	<div>
		<p class="eyebrow">Amanah jamaah</p>
		<h1 class="font-display mt-2 text-4xl font-semibold text-navy">Keuangan</h1>
		<p class="mt-2 max-w-2xl text-sm text-slate">
			Catat pemasukan dan pengeluaran setiap dana secara terpisah dan transparan.
		</p>
	</div>
	<a href={resolve('/admin/keuangan/new')} class="button-primary">+ Transaksi baru</a>
</header>

{#if form?.message}
	<p class="mt-6 rounded-lg bg-red-50 p-3 text-sm font-bold text-red-700" role="alert">
		{form.message}
	</p>
{/if}

<section class="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="Saldo setiap dana">
	{#each data.fundSummaries as fund (fund.id)}
		<article class="border border-blue-100 bg-white p-5">
			<div class="flex items-start justify-between gap-3">
				<div>
					<p class="text-[.65rem] font-extrabold tracking-wider text-primary uppercase">
						Saldo dana
					</p>
					<h2 class="mt-1 font-bold text-navy">{fund.name}</h2>
				</div>
				<span
					class="grid size-9 shrink-0 place-items-center rounded-full bg-pale text-xs font-black text-primary"
				>
					Rp
				</span>
			</div>
			<strong class:negative={fund.balance < 0} class="font-display mt-5 block text-2xl text-navy">
				{formatRupiah(fund.balance)}
			</strong>
			<p class="mt-2 text-[.68rem] leading-relaxed text-slate">{fund.source}</p>
		</article>
	{/each}
	<article class="border border-navy bg-navy p-5 text-white sm:col-span-2 xl:col-span-1">
		<p class="text-[.65rem] font-extrabold tracking-wider text-sky uppercase">
			Total seluruh saldo
		</p>
		<strong class="font-display mt-5 block text-3xl">{formatRupiah(data.totalBalance)}</strong>
		<p class="mt-3 text-xs leading-relaxed text-blue-100">
			Akumulasi semua dana sejak pencatatan dimulai.
		</p>
	</article>
</section>

<section class="mt-8 border border-blue-100 bg-white p-5 sm:p-6">
	<div class="flex flex-wrap items-center justify-between gap-3">
		<div>
			<p class="eyebrow">Penyaringan laporan</p>
			<h2 class="font-display mt-1 text-2xl font-semibold text-navy">Cari transaksi</h2>
		</div>
		{#if filterActive}
			<a href={resolve('/admin/keuangan')} class="text-xs font-extrabold text-primary"
				>Hapus filter</a
			>
		{/if}
	</div>
	<form
		method="get"
		class="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-[1.2fr_1fr_1fr_1fr_auto] xl:items-end"
	>
		<label class="form-label">
			Dana
			<select class="form-control" name="fund">
				<option value="">Semua dana</option>
				{#each data.funds as fund (fund.id)}
					<option value={fund.id} selected={data.filters.fundId === fund.id}>{fund.name}</option>
				{/each}
			</select>
		</label>
		<label class="form-label">
			Transaksi
			<select class="form-control" name="type">
				<option value="">Semua</option>
				<option value="income" selected={data.filters.type === 'income'}>Pemasukan</option>
				<option value="expense" selected={data.filters.type === 'expense'}>Pengeluaran</option>
			</select>
		</label>
		<label class="form-label">
			Dari tanggal
			<input class="form-control" type="date" name="from" value={data.filters.from} />
		</label>
		<label class="form-label">
			Sampai tanggal
			<input class="form-control" type="date" name="to" value={data.filters.to} />
		</label>
		<button class="button-secondary min-h-12 justify-center" type="submit">Tampilkan</button>
	</form>
</section>

<section class="mt-5 grid gap-3 sm:grid-cols-3" aria-label="Ringkasan hasil filter">
	<article class="border border-emerald-100 bg-emerald-50 p-4">
		<p class="text-[.65rem] font-extrabold tracking-wider text-emerald-700 uppercase">Pemasukan</p>
		<strong class="mt-2 block text-lg text-emerald-900"
			>{formatRupiah(data.filteredSummary.income)}</strong
		>
	</article>
	<article class="border border-red-100 bg-red-50 p-4">
		<p class="text-[.65rem] font-extrabold tracking-wider text-red-700 uppercase">Pengeluaran</p>
		<strong class="mt-2 block text-lg text-red-900"
			>{formatRupiah(data.filteredSummary.expense)}</strong
		>
	</article>
	<article class="border border-blue-100 bg-pale p-4">
		<p class="text-[.65rem] font-extrabold tracking-wider text-primary uppercase">
			Selisih hasil filter
		</p>
		<strong class="mt-2 block text-lg text-navy"
			>{formatRupiah(data.filteredSummary.balance)}</strong
		>
	</article>
</section>

<div class="mt-8 flex flex-wrap items-center justify-between gap-4">
	<div>
		<p class="eyebrow">Buku kas</p>
		<h2 class="font-display mt-1 text-2xl font-semibold text-navy">
			{data.filteredSummary.count} transaksi
		</h2>
	</div>
	<div class="flex flex-wrap gap-2">
		<form method="get" action={resolve('/admin/keuangan/export.xlsx')}>
			{#if data.filters.fundId}<input type="hidden" name="fund" value={data.filters.fundId} />{/if}
			{#if data.filters.type}<input type="hidden" name="type" value={data.filters.type} />{/if}
			{#if data.filters.from}<input type="hidden" name="from" value={data.filters.from} />{/if}
			{#if data.filters.to}<input type="hidden" name="to" value={data.filters.to} />{/if}
			<button type="submit" class="button-secondary">Unduh Excel</button>
		</form>
		<form method="get" action={resolve('/admin/keuangan/export.pdf')}>
			{#if data.filters.fundId}<input type="hidden" name="fund" value={data.filters.fundId} />{/if}
			{#if data.filters.type}<input type="hidden" name="type" value={data.filters.type} />{/if}
			{#if data.filters.from}<input type="hidden" name="from" value={data.filters.from} />{/if}
			{#if data.filters.to}<input type="hidden" name="to" value={data.filters.to} />{/if}
			<button type="submit" class="button-secondary">Unduh PDF</button>
		</form>
	</div>
</div>

<div class="mt-4 hidden overflow-x-auto border border-blue-100 bg-white md:block">
	<table class="w-full min-w-5xl text-left text-sm">
		<thead class="bg-pale text-[.68rem] tracking-wider text-navy uppercase">
			<tr>
				<th class="p-4">Tanggal</th>
				<th class="p-4">Dana</th>
				<th class="p-4">Keterangan</th>
				<th class="p-4 text-right">Pemasukan</th>
				<th class="p-4 text-right">Pengeluaran</th>
				<th class="p-4 text-right">Aksi</th>
			</tr>
		</thead>
		<tbody class="divide-y divide-blue-50">
			{#each data.transactions as transaction (transaction.id)}
				<tr>
					<td class="p-4 text-xs whitespace-nowrap text-slate">
						{formatFinanceDate(transaction.transactionDate)}
					</td>
					<td class="p-4">
						<span class="font-bold text-navy">{transaction.fundName}</span>
						<span
							class:income={transaction.type === 'income'}
							class:expense={transaction.type === 'expense'}
							class="transaction-badge"
						>
							{transaction.type === 'income' ? 'Masuk' : 'Keluar'}
						</span>
					</td>
					<td class="max-w-sm p-4 text-slate">
						<p>{transaction.description}</p>
						<p class="mt-1 text-[.68rem]">
							{transaction.reference ?? 'Tanpa referensi'} · {transaction.createdByName}
						</p>
					</td>
					<td class="p-4 text-right font-bold text-emerald-700">
						{transaction.type === 'income' ? formatRupiah(transaction.amount) : '-'}
					</td>
					<td class="p-4 text-right font-bold text-red-700">
						{transaction.type === 'expense' ? formatRupiah(transaction.amount) : '-'}
					</td>
					<td class="p-4">
						<div class="flex justify-end gap-3">
							<a
								class="font-bold text-primary"
								href={resolve('/admin/keuangan/[id]/edit', { id: transaction.id })}>Edit</a
							>
							<form
								method="post"
								action="?/delete"
								onsubmit={(event) => !confirm('Hapus transaksi ini?') && event.preventDefault()}
							>
								<input type="hidden" name="id" value={transaction.id} />
								<button class="font-bold text-red-600" type="submit">Hapus</button>
							</form>
						</div>
					</td>
				</tr>
			{:else}
				<tr
					><td colspan="6" class="p-10 text-center text-slate"
						>Belum ada transaksi pada hasil filter ini.</td
					></tr
				>
			{/each}
		</tbody>
	</table>
</div>

<div class="mt-4 grid gap-3 md:hidden">
	{#each data.transactions as transaction (transaction.id)}
		<article class="border border-blue-100 bg-white p-4">
			<div class="flex items-start justify-between gap-3">
				<div>
					<p class="text-[.65rem] font-extrabold tracking-wider text-primary uppercase">
						{formatFinanceDate(transaction.transactionDate)}
					</p>
					<h3 class="mt-1 font-bold text-navy">{transaction.fundName}</h3>
				</div>
				<span
					class:income={transaction.type === 'income'}
					class:expense={transaction.type === 'expense'}
					class="transaction-badge"
				>
					{transaction.type === 'income' ? 'Masuk' : 'Keluar'}
				</span>
			</div>
			<strong
				class:expense-amount={transaction.type === 'expense'}
				class="mt-4 block text-xl text-emerald-700"
			>
				{transaction.type === 'expense' ? '-' : '+'}{formatRupiah(transaction.amount)}
			</strong>
			<p class="mt-3 text-sm leading-relaxed text-slate">{transaction.description}</p>
			<p class="mt-2 text-[.68rem] text-slate">
				{transaction.reference ?? 'Tanpa referensi'} · {transaction.createdByName}
			</p>
			<div class="mt-4 flex gap-4 border-t border-blue-50 pt-3 text-xs">
				<a
					class="font-extrabold text-primary"
					href={resolve('/admin/keuangan/[id]/edit', { id: transaction.id })}>Edit</a
				>
				<form
					method="post"
					action="?/delete"
					onsubmit={(event) => !confirm('Hapus transaksi ini?') && event.preventDefault()}
				>
					<input type="hidden" name="id" value={transaction.id} />
					<button class="font-extrabold text-red-600" type="submit">Hapus</button>
				</form>
			</div>
		</article>
	{:else}
		<p class="border border-blue-100 bg-white p-8 text-center text-sm text-slate">
			Belum ada transaksi pada hasil filter ini.
		</p>
	{/each}
</div>

<style>
	.negative,
	.expense-amount {
		color: #b91c1c;
	}
	.transaction-badge {
		display: inline-flex;
		margin-top: 0.4rem;
		border-radius: 999px;
		padding: 0.2rem 0.55rem;
		font-size: 0.62rem;
		font-weight: 800;
	}
	.transaction-badge.income {
		background: #dcfce7;
		color: #166534;
	}
	.transaction-badge.expense {
		background: #fee2e2;
		color: #991b1b;
	}
</style>
