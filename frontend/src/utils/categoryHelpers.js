import api from "../api";


export const getElectiveGroups = async () => {
    try {
        const response = await api.get(`semestercourses/elective-groups`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch elective groups:', error);
        throw error;
    }
};


export const createElectiveGroup = async (categoryName) => {
    try {
        const response = await api.post(`semestercourses/elective-groups`, { name: categoryName });
        return response.data;
    } catch (error) {
        console.error('Failed to create elective group:', error);
        throw error;
    }
};


export const deleteElectiveGroup = async (groupId) => {
    try {
        const response = await api.delete(`semestercourses/elective-groups/${groupId}`);
        return response.data;
    } catch (error) {
        console.error('Failed to delete elective group:', error);
        throw error;
    }
};


export const updateElectiveGroup = async (groupId, newName) => {
    try {
        const response = await api.put(`semestercourses/elective-groups/${groupId}`, { new_name: newName });
        return response.data;
    } catch (error) {
        console.error('Failed to update elective group:', error);
        throw error;
    }
};