import apiClient from '../http-common';

export async function getUserData(username){
    return await apiClient.post('/user', {username})
}

export async function getAdminLocationData() {
    return await apiClient.get('/admin/locations');
}

export async function getFileMetadataTypes() {
    return await apiClient.get('/admin/file_metadata');
}

export async function getStatisticTypes() {
    return await apiClient.get('/admin/statistics');
}

export async function getFileList() {
    return await apiClient.get('/file_list');
}

export async function getSongData(songId, highlightOccurrenceId) {
    return await apiClient.get(`/song?id=${songId}&highlight=${highlightOccurrenceId}`);
}

export async function getResultsData(occurrences) {
    return await apiClient.post(`/results`, {occurrences});
}

export async function getGroupsData() {
    return await apiClient.get('/group_data');
}

export async function updateGroupsData(updatedGroups) {
    return await apiClient.post('/group_data', {updatedGroups});
}
