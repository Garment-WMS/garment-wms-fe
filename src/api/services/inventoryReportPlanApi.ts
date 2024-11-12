import { InventoryReportPlan } from "@/types/InventoryReport";
import { get, post } from "../ApiCaller";
const inventoryReportPlanApiPath = '/inventory-report-plan'; 
export const inventoryReportPlanApi ={
    createInventoryReportPlan(data: InventoryReportPlan) {
        return post(inventoryReportPlanApiPath, data);
    },
    getOne(id: string) {
        return get(`${inventoryReportPlanApiPath}/${id}`);
    },
    getAllInTimeRange: (queryString: string) => {
        get(`${inventoryReportPlanApiPath}/${queryString}`)
    }
}