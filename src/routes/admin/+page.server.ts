import type { PageServerLoad } from './$types';
import { getDashboardStats } from '$lib/server/content';
export const load: PageServerLoad = async () => getDashboardStats();
