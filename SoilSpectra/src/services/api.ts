export interface SoilSample {
  id: number;
  region_name: string;
  N: number;
  P: number;
  K: number;
  npk_ratio: number;
  pH: number;
  soil_texture: string;
  reflectance: {
    "940": number;
    "1020": number;
    "1200": number;
    "1300": number;
    "1550": number;
    "1650": number;
  };
  adc: {
    "940": number;
    "1020": number;
    "1200": number;
    "1300": number;
    "1550": number;
    "1650": number;
  };
}

export interface ApiResponse {
  total_matching_samples: number;
  offset: number;
  limit: number;
  samples: SoilSample[];
}

const API_BASE_URL = 'https://ei2940l20h.execute-api.us-east-1.amazonaws.com/default/Soil_spectra_data_api';

export async function fetchSoilData(params?: {
  region?: string;
  texture?: string;
  sample_id?: number;
  limit?: number;
  offset?: number;
}): Promise<ApiResponse> {
  const url = new URL(API_BASE_URL);
  
  if (params) {
    if (params.region) url.searchParams.append('region', params.region);
    if (params.texture) url.searchParams.append('texture', params.texture);
    if (params.sample_id !== undefined) url.searchParams.append('sample_id', params.sample_id.toString());
    if (params.limit !== undefined) url.searchParams.append('limit', params.limit.toString());
    if (params.offset !== undefined) url.searchParams.append('offset', params.offset.toString());
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`API returned status: ${response.status}`);
  }
  
  return await response.json();
}
