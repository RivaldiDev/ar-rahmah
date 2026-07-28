import type { PageServerLoad } from './$types';
import { getActivities } from '$lib/server/content';
export const load: PageServerLoad = async () => ({ activities: await getActivities() });
