import api from './api';

const assignAsset = async (data) => {
    const response = await api.post('/allocations/assign', data);
    return response.data;
};

const transferAsset = async (data) => {
    const response = await api.post('/allocations/transfer', data);
    return response.data;
};

const returnAsset = async (data) => {
    const response = await api.post('/allocations/return', data);
    return response.data;
};

const getAssetHistory = async (assetId) => {
    const response = await api.get(`/allocations/history/${assetId}`);
    return response.data;
};

const getMyHistory = async () => {
    const response = await api.get('/allocations/my-history');
    return response.data;
}

const allocationService = {
    assignAsset,
    transferAsset,
    returnAsset,
    getAssetHistory,
    getMyHistory
};

export default allocationService;
