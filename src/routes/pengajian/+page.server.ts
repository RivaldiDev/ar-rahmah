import type { PageServerLoad } from './$types';
import { getUpcomingStudies } from '$lib/server/content';
export const load: PageServerLoad = async () => ({ studies: await getUpcomingStudies() });
