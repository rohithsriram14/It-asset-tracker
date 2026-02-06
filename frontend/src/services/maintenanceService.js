import api from './api';

const addMaintenance = async (data) => {
    const response = await api.post('/maintenance', data);
    return response.data;
};

const closeMaintenance = async (id) => {
    const response = await api.put(`/maintenance/${id}/close`);
    return response.data;
};

const getMaintenanceRecords = async () => {
    const response = await api.get('/maintenance');
    return response.data;
};

const getAssetMaintenance = async (assetId) => {
    const response = await api.get(`/maintenance/${assetId}`);
    return response.data;
};

const maintenanceService = {
    addMaintenance,
    closeMaintenance,
    getMaintenanceRecords,
    getAssetMaintenance
};

export default maintenanceService;
