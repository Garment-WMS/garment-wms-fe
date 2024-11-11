import { InventoryReportPlan } from "@/types/InventoryReport";
import { post } from "../ApiCaller";
const inventoryReportPlanApiPath = '/inventory-report-plan'; 
export const inventoryReportPlanApi ={
    createInventoryReportPlan(data: InventoryReportPlan) {
        return post(inventoryReportPlanApiPath, data);
    }
}