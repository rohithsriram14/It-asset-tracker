import React, { useEffect, useState } from 'react';
import allocationService from '../../services/allocationService';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { format } from 'date-fns';
import { CheckCircle2, Circle } from 'lucide-react';

const MyHistory = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            const res = await allocationService.getMyHistory();
            setHistory(res.data);
        };
        fetchHistory();
    }, []);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Allocation History</h2>
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                {history.map((item, index) => (
                    <div key={item._id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-emerald-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4">
                            <div className="flex flex-col space-y-1">
                                <div className="font-bold text-slate-900 dark:text-slate-100">{item.status.toUpperCase()}</div>
                                <time className="font-caveat font-medium text-indigo-500">{format(new Date(item.assignedDate), 'PPP')}</time>
                                <div className="text-slate-500 dark:text-slate-400">
                                    {item.assetId ? `${item.assetId.brand} ${item.assetId.model}` : 'Unknown Asset'}
                                </div>
                                {item.remarks && <div className="text-sm text-slate-500 italic mt-2">"{item.remarks}"</div>}
                            </div>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyHistory;
