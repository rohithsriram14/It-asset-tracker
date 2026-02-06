import api from './api';

const getAssets = async (params) => {
    const response = await api.get('/assets', { params });
    return response.data;
};

const getAsset = async (id) => {
    const response = await api.get(`/assets/${id}`);
    return response.data;
};

const createAsset = async (assetData) => {
    const response = await api.post('/assets', assetData);
    return response.data;
};

const updateAsset = async (id, assetData) => {
    const response = await api.put(`/assets/${id}`, assetData);
    return response.data;
};

const deleteAsset = async (id) => {
    const response = await api.delete(`/assets/${id}`);
    return response.data;
};

const getMyAssets = async () => {
    const response = await api.get('/assets/my-assets');
    return response.data;
}

const assetService = {
    getAssets,
    getAsset,
    createAsset,
    updateAsset,
    deleteAsset,
    getMyAssets
};

export default assetService;
