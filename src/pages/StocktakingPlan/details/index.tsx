import privateCall from '@/api/PrivateCaller';
import { inventoryReportPlanApi } from '@/api/services/inventoryReportPlanApi';
import { toast } from '@/hooks/use-toast';
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

type Props = {}

const StocktakingPlanDetails = (props: Props) => {
    const {id } = useParams();
    const fetchData = async () => {
        try {
            if (id) {
                const res = await privateCall(inventoryReportPlanApi.getOne(id));
                console.log(res);
            } else {
                toast({
                    title: 'error',
                    variant: 'destructive',
                    description: 'ID is undefined'
                });
            }
        } catch (error: any) {
            toast({
                title: 'error',
                variant: 'destructive',
                description: error.message
            })
        }
    }
    useEffect(() => {
        fetchData();
    }, [id]);
  return (
    <div className="mx-auto p-4 bg-white shadow-sm border rounded-md">
        
    </div>
  )
}

export default StocktakingPlanDetails