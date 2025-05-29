type FieldType = "text" | "radio" | "select" | "script "|"button";

export interface Field {
    type: FieldType;
    question: string;
    name: string;
    options?: string[];
    script?: string;
  }
export interface NewField {
    type: FieldType;
    question: string;
    name: string;
    options: string;
    script: string;
  }
  
export interface Campaign {
    id: string;
    title: string;
    fields: Field[]; // or your specific Field[] type
}
export interface AddCampaign {
    CampaignTitle: string;
    fields: string; 
}
export interface EditCampaign {
    CampaignId: string;
    CampaignName: string;
    fields: string; 
}


  