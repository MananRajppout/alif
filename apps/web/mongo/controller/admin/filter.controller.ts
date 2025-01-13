

import { requireAdmin } from "../../middleware/authenticate"
import { createFilterService, getFiltersService } from "../../service/admin/filter.service"

// create a filter handller
export async function createFilter(reqQuery: any) {
    try {
        await requireAdmin(reqQuery.accessToken)

        const filter = await createFilterService(reqQuery.body)
        return filter
    } catch (e) {
        throw e
    }
}

// find all filters handller
export async function getFilters(req: Request, res: Response) {
    try {
        const filters = await getFiltersService()
        return filters
    } catch (e) {
        throw e
    }
}