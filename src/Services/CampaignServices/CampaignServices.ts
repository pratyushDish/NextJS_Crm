// import { Campaign } from '@/types/Campaign/Campaign';
import { apiRequest } from '@/lib/api/api';
import { ApiResponse } from '@/types/ApiResponse';
import { User } from '@/types/User/User';
import { Campaign,EditCampaign,AddCampaign } from '@/types/Campaign/Campaign';

const apiUrl = "https://localhost:7289";
export const getCampaigns = (data: Partial<User>) => apiRequest<ApiResponse>( `${apiUrl}/api/CampaignBuilder/GetCampaign`, 'POST',data);
// export const getCampaignById = (id: string) => apiRequest<Campaign>(`/api/campaigns/${id}`, 'GET');
export const createCampaign = (data: Partial<AddCampaign>) => apiRequest<ApiResponse>(`${apiUrl}/api/CampaignBuilder/AddCampaign`, 'POST', data);
export const updateCampaign = (data: Partial<EditCampaign>) => apiRequest<ApiResponse>(`${apiUrl}/api/CampaignBuilder/CampaignEdit`, 'POST', data);
// export const deleteCampaign = (id: string) => apiRequest<{}>(`/api/campaigns/${id}`, 'DELETE');

export async function useCampaignList():Promise<Campaign[]|undefined> {
    try {
      const response = await getCampaigns({LoginId:"2"});
      const parsedData = JSON.parse(response.data); // <-- parses the "\r\n" string
        
      // Step 2: Map to your internal Campaign structure
      const mappedCampaigns: Campaign[] = parsedData.Campaigns.map((c: any) => ({
        id: String(c.CampaignId),
        title: c.CampaignName,
        fields: c.Fields ? JSON.parse(c.Fields) : [], // Fields might be a stringified array
      }));
      return mappedCampaigns
    } catch (error) {
      console.error('API Error:', error); // 👈 Logs error in console
    }
  }

  export async function useEditCampaign(editCampaign:EditCampaign):Promise<any> {
    try {
      console.log(editCampaign);
      const response = await updateCampaign(editCampaign);
      const parsedData = response.data; // <-- parses the "\r\n" string
      return parsedData;
    } catch (error) {
      console.error('API Error:', error); // 👈 Logs error in console
    }
  }

  export async function useAddCampaign(addCampaign:AddCampaign):Promise<any> {
    try {
      const response = await createCampaign(addCampaign);
      const parsedData = response.data // <-- parses the "\r\n" string
      return parsedData;
    } catch (error) {
      console.error('API Error:', error); // 👈 Logs error in console
    }
  }
