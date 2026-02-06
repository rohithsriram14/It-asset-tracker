import api from './api';

const getInventoryReport = async () => {
    const response = await api.get('/reports/inventory');
    return response.data;
};

const getWarrantyReport = async () => {
    const response = await api.get('/reports/warranty-expiry');
    return response.data;
};

const getMaintenanceReport = async () => {
    const response = await api.get('/reports/maintenance-due');
    return response.data;
};

const reportService = {
    getInventoryReport,
    getWarrantyReport,
    getMaintenanceReport
};

export default reportService;
