import api from './api';

const getAuditLogs = async () => {
    const response = await api.get('/auditlogs');
    return response.data;
};

const auditService = {
    getAuditLogs
};

export default auditService;
