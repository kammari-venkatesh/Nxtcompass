/**
 * Alternative predictor service using native fetch instead of axios
 * Use this if axios is causing issues
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Run college predictor using native fetch
 * @param {Object} payload
 * @param {number} payload.rank
 * @param {string} payload.category
 * @param {string} payload.homeState
 * @param {string[]} payload.preferredBranches
 */
export const runPredictorFetch = async (payload) => {
  const url = `${API_BASE_URL}/predictor`;

  try {
    console.log('==========================================');
    console.log('🚀 [runPredictorFetch] FETCH API CALL START');
    console.log('==========================================');
    console.log('🌐 Full URL:', url);
    console.log('📦 Payload:', payload);
    console.log('📦 Payload JSON:', JSON.stringify(payload));
    console.log('🔧 API_BASE_URL:', API_BASE_URL);
    console.log('🔧 import.meta.env.VITE_API_URL:', import.meta.env.VITE_API_URL);
    console.log('------------------------------------------');

    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    console.log('🔧 Fetch options:', fetchOptions);
    console.log('------------------------------------------');

    console.log('⏳ Sending request...');
    const response = await fetch(url, fetchOptions);

    console.log('✅ Response received!');
    console.log('📊 Status:', response.status);
    console.log('📊 Status Text:', response.statusText);
    console.log('📊 OK:', response.ok);
    console.log('📊 Headers:', [...response.headers.entries()]);
    console.log('------------------------------------------');

    if (!response.ok) {
      console.error('❌ Response not OK!');
      const errorText = await response.text();
      console.error('❌ Error text:', errorText);

      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { message: errorText };
      }

      console.error('❌ Error data:', errorData);
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const responseText = await response.text();
    console.log('📄 Raw response text length:', responseText.length);

    const data = JSON.parse(responseText);
    console.log('✅ Parsed data:', {
      success: data.success,
      count: data.count,
      hasResults: !!data.results,
      resultsCount: data.results?.length
    });
    console.log('==========================================');
    console.log('🎉 FETCH API CALL SUCCESS');
    console.log('==========================================');

    return data;
  } catch (error) {
    console.log('==========================================');
    console.error('❌ FETCH API CALL FAILED');
    console.log('==========================================');
    console.error('❌ Error type:', error.constructor.name);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    console.error('❌ Full error:', error);
    console.log('==========================================');

    throw error;
  }
};

export default runPredictorFetch;
