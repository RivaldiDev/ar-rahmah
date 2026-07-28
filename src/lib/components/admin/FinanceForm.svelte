<script lang="ts">
	import { resolve } from '$app/paths';
	import { financeTransactionTypes, toFinanceDateInput } from '$lib/domain/finance';

	interface Fund {
		id: string;
		name: string;
		source: string;
	}
	interface Transaction {
		fundId: string;
		type: 'income' | 'expense';
		amount: number;
		transactionDate: Date;
		description: string;
		reference: string | null;
	}
	interface Props {
		funds: Fund[];
		transaction?: Transaction | null;
		submitLabel?: string;
		message?: string;
	}
	let {
		funds,
		transaction = null,
		submitLabel = 'Simpan transaksi',
		message = ''
	}: Props = $props();
	const defaultDate = $derived(toFinanceDateInput(transaction?.transactionDate ?? new Date()));
</script>

{#if message}
	<p class="mb-5 rounded-lg bg-red-50 p-3 text-sm font-bold text-red-700" role="alert">
		{message}
	</p>
{/if}

<form method="post" class="grid gap-7">
	<section class="grid gap-5 border border-blue-100 bg-white p-5 sm:p-7">
		<div class="grid gap-5 sm:grid-cols-2">
			<label class="form-label">
				Jenis dana
				<select class="form-control" name="fundId" required>
					{#each funds as fund (fund.id)}
						<option value={fund.id} selected={fund.id === (transaction?.fundId ?? funds[0]?.id)}>
							{fund.name}
						</option>
					{/each}
				</select>
			</label>
			<label class="form-label">
				Jenis transaksi
				<select class="form-control" name="type" required>
					{#each financeTransactionTypes as type (type.value)}
						<option value={type.value} selected={type.value === (transaction?.type ?? 'income')}
							>{type.label}</option
						>
					{/each}
				</select>
			</label>
		</div>

		<div class="grid gap-5 sm:grid-cols-2">
			<label class="form-label">
				Nominal (rupiah)
				<input
					class="form-control"
					name="amount"
					value={transaction?.amount ?? ''}
					inputmode="numeric"
					pattern="[0-9. ]+"
					placeholder="Contoh: 500000"
					maxlength="30"
					required
				/>
				<span class="mt-1 block text-[.7rem] font-normal text-slate">
					Boleh ditulis 500000 atau 500.000.
				</span>
			</label>
			<label class="form-label">
				Tanggal transaksi
				<input
					class="form-control"
					type="date"
					name="transactionDate"
					value={defaultDate}
					required
				/>
			</label>
		</div>

		<label class="form-label">
			Keterangan
			<textarea
				class="form-control min-h-28"
				name="description"
				maxlength="300"
				placeholder="Contoh: Hasil kotak infak Jumat pekan pertama"
				required>{transaction?.description ?? ''}</textarea
			>
		</label>

		<label class="form-label">
			Referensi <span class="font-normal text-slate">(opsional)</span>
			<input
				class="form-control"
				name="reference"
				value={transaction?.reference ?? ''}
				maxlength="120"
				placeholder="Nomor kuitansi, nama kolektor, atau catatan singkat"
			/>
		</label>
	</section>

	<section class="rounded-lg border border-sky/30 bg-pale p-5" aria-label="Keterangan sumber dana">
		<p class="text-xs font-extrabold tracking-wider text-navy uppercase">
			Sumber dana yang tersedia
		</p>
		<ul class="mt-3 grid gap-2 text-xs text-slate sm:grid-cols-2">
			{#each funds as fund (fund.id)}
				<li><strong class="text-navy">{fund.name}:</strong> {fund.source}</li>
			{/each}
		</ul>
	</section>

	<div class="flex flex-wrap gap-3">
		<button type="submit" class="button-primary">{submitLabel}</button>
		<a href={resolve('/admin/keuangan')} class="button-secondary">Batal</a>
	</div>
</form>
