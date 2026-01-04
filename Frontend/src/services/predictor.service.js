import api from './api';

/**
 * Run college predictor
 * @param {Object} payload
 * @param {number} payload.rank
 * @param {string} payload.category
 * @param {string} payload.homeState
 * @param {string[]} payload.preferredBranches
 */
export const runPredictor = async (payload) => {
  try {
    console.log('🚀 [runPredictor] Starting API call...');
    console.log('📦 [runPredictor] Payload:', JSON.stringify(payload, null, 2));
    console.log('🌐 [runPredictor] API base URL:', api.defaults.baseURL);

    const response = await api.post('/predictor', payload);

    console.log('✅ [runPredictor] Success! Response:', response);
    console.log('📊 [runPredictor] Response data:', response.data);

    return response.data;
  } catch (error) {
    console.error('❌ [runPredictor] Error caught:', error);
    console.error('❌ [runPredictor] Error response:', error.response);
    console.error('❌ [runPredictor] Error message:', error.message);
    console.error('❌ [runPredictor] Error config:', error.config);

    const message =
      error.response?.data?.message || error.message || 'Prediction failed';
    throw new Error(message);
  }
};

export const predictorService = {
  getPredictions: runPredictor,
};

export default predictorService;
