import apiClient from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';
import { IS_PREVIEW_MODE } from '../utils/mockData';

export const fileUploadService = {
  /**
   * Uploads a file (document or image) to CloudinaryService
   * @param {File} file - Native File object from file input
   * @param {Object} options - Metadata for the upload
   * @param {string} [options.folder='chat/messages'] - Cloudinary folder path
   * @param {string} [options.resourceType='auto'] - 'auto' | 'image' | 'raw'
   * @param {string} [options.ownerId] - User ID uploading the file
   * @param {string} [options.entityType='CHAT_MESSAGE'] - Entity type
   * @param {string} [options.entityId] - Target conversation ID
   * @param {function} [onProgress] - Optional progress callback
   */
  uploadFile: async (file, options = {}, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);

    const folder = options.folder || 'chat/class-conversations';
    const resourceType = options.resourceType || (file.type.startsWith('image/') ? 'image' : 'auto');
    formData.append('folder', folder);
    formData.append('resourceType', resourceType);

    if (options.ownerId) formData.append('ownerId', options.ownerId);
    if (options.entityType) formData.append('entityType', options.entityType);
    if (options.entityId) formData.append('entityId', options.entityId);

    try {
      const response = await apiClient.post(`${API_ENDPOINTS.FILES.BASE}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percent);
          }
        },
      });

      return response.data;
    } catch (err) {
      // If CloudinaryService is offline or preview mode is active, simulate upload response
      if (IS_PREVIEW_MODE || err?.response?.status === 404 || !err?.response) {
        console.warn('CloudinaryService not reachable or in preview mode. Using local blob URL fallback.');
        
        // Generate a local browser blob URL so the user can see their image/document immediately
        const localBlobUrl = URL.createObjectURL(file);
        
        return {
          fileId: `file-${Date.now()}`,
          publicId: `chat/${Date.now()}_${file.name}`,
          originalFileName: file.name,
          resourceType: file.type.startsWith('image/') ? 'image' : 'raw',
          mimeType: file.type,
          size: file.size,
          secureUrl: localBlobUrl,
          folder,
          ownerId: options.ownerId || 'current_user',
          entityType: options.entityType || 'CHAT_MESSAGE',
          entityId: options.entityId || null,
          createdAt: new Date().toISOString(),
          isMockPreview: true,
        };
      }
      throw err;
    }
  },

  /**
   * Get metadata for an uploaded file by ID
   */
  getFileMetadata: async (fileId) => {
    const response = await apiClient.get(`${API_ENDPOINTS.FILES.BASE}/${fileId}`);
    return response.data;
  },

  /**
   * Delete file from Cloudinary and database
   */
  deleteFile: async (fileId) => {
    const response = await apiClient.delete(`${API_ENDPOINTS.FILES.BASE}/${fileId}`);
    return response.data;
  },
};
