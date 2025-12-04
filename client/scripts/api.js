const API = {
    async request(url, options = {}) {
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    entries: {
        
        async getAll() {
            const url = `${API_CONFIG.baseURL}${API_ENDPOINTS.entries.getAll}`;
            return await API.request(url);
        },

        async getByPayer(payerName) {
            const url = `${API_CONFIG.baseURL}${API_ENDPOINTS.entries.getByPayer(payerName)}`;
            return await API.request(url);
        },

        async add(entry) {
            const url = `${API_CONFIG.baseURL}${API_ENDPOINTS.entries.add}`;
            return await API.request(url, {
                method: 'POST',
                body: JSON.stringify(entry)
            });
        },

        async update(entry) {
            const url = `${API_CONFIG.baseURL}${API_ENDPOINTS.entries.update}`;
            return await API.request(url, {
                method: 'PUT',
                body: JSON.stringify(entry)
            });
        },

        async delete(entryId) {
            const url = `${API_CONFIG.baseURL}${API_ENDPOINTS.entries.delete(entryId)}`;
            return await API.request(url, {
                method: 'DELETE'
            });
        }
    },

    stalls: {
        async getAll() {
            const url = `${API_CONFIG.baseURL}${API_ENDPOINTS.stalls.getAll}`;
            return await API.request(url);
        },

        async getByPayer(payerName) {
            const url = `${API_CONFIG.baseURL}${API_ENDPOINTS.stalls.getByPayer(payerName)}`;
            return await API.request(url);
        },

        async add(stall) {
            const url = `${API_CONFIG.baseURL}${API_ENDPOINTS.stalls.add}`;
            return await API.request(url, {
                method: 'POST',
                body: JSON.stringify(stall)
            });
        },

        async update(stall) {
            const url = `${API_CONFIG.baseURL}${API_ENDPOINTS.stalls.update}`;
            return await API.request(url, {
                method: 'PUT',
                body: JSON.stringify(stall)
            });
        },

        async delete(stallId) {
            const url = `${API_CONFIG.baseURL}${API_ENDPOINTS.stalls.delete(stallId)}`;
            return await API.request(url, {
                method: 'DELETE'
            });
        }
    },

    shavingsOrders: {
        
        async getAll() {
            const url = `${API_CONFIG.baseURL}${API_ENDPOINTS.shavings.getAll}`;
            return await API.request(url);
        },

        async getByPayer(payerName) {
            const url = `${API_CONFIG.baseURL}${API_ENDPOINTS.shavings.getByPayer(payerName)}`;
            return await API.request(url);
        },

        async add(order) {
            const url = `${API_CONFIG.baseURL}${API_ENDPOINTS.shavings.add}`;
            return await API.request(url, {
                method: 'POST',
                body: JSON.stringify(order)
            });
        },

        async update(order) {
            const url = `${API_CONFIG.baseURL}${API_ENDPOINTS.shavings.update}`;
            return await API.request(url, {
                method: 'PUT',
                body: JSON.stringify(order)
            });
        },

        async delete(orderId) {
            const url = `${API_CONFIG.baseURL}${API_ENDPOINTS.shavings.delete(orderId)}`;
            return await API.request(url, {
                method: 'DELETE'
            });
        }
    },

    paidTimes: {
        
        async getAll() {
            const url = `${API_CONFIG.baseURL}${API_ENDPOINTS.paidTimes.getAll}`;
            return await API.request(url);
        },

        async getByPayer(payerName) {
            const url = `${API_CONFIG.baseURL}${API_ENDPOINTS.paidTimes.getByPayer(payerName)}`;
            return await API.request(url);
        },

        async add(paidTime) {
            const url = `${API_CONFIG.baseURL}${API_ENDPOINTS.paidTimes.add}`;
            return await API.request(url, {
                method: 'POST',
                body: JSON.stringify(paidTime)
            });
        },

        async update(paidTime) {
            const url = `${API_CONFIG.baseURL}${API_ENDPOINTS.paidTimes.update}`;
            return await API.request(url, {
                method: 'PUT',
                body: JSON.stringify(paidTime)
            });
        },

        async delete(paidTimeId) {
            const url = `${API_CONFIG.baseURL}${API_ENDPOINTS.paidTimes.delete(paidTimeId)}`;
            return await API.request(url, {
                method: 'DELETE'
            });
        }
    }
};