// app/campaigns/[id].tsx
'use client';

import { useEffect, useState } from 'react';

interface Field {
  type: string;
  question: string;
  name: string;
  options?: string[];
  script?: string;
}
interface Campaign {
    id: string;
    title: string;
    fields: any[]; // or your specific Field[] type
  }
interface CampaignBuilderProps {
    onCancel: () => void;
    initialFields?: Campaign;
  }
  
export default function ViewCampaign({
    onCancel,
    initialFields,
  }: CampaignBuilderProps) {

  const [campaign, setCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    if (initialFields) {
        setCampaign(initialFields);
    }
  }, [initialFields]);

  if (!campaign) {
    return <div className="p-6 text-center">Loading campaign...</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
     <h1 className="text-4xl font-bold text-center text-gray-800 mb-6 flex items-center justify-center gap-3">
        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
            Campaign: <span className="text-gray-900">{campaign.title}</span>
        </span>
        </h1>

      <div className="space-y-4">
        {campaign.fields.map((field, index) => (
             <div key={index} className="border p-4 rounded bg-gray-50">
             <label className="block font-semibold mb-1">{field.question}</label>
             {field.type === "text" && (
             <input
                 type="text"
                 name={field.name}
                 className="border px-3 py-2 w-full"
                 placeholder="Your answer"
             />
             )}
             {field.type === "radio" && field.options?.map((opt:any, i:any) => (
             <label key={i} className="mr-4">
                 <input type="radio" name={field.name} value={opt} /> {opt}
             </label>
             ))}
             {field.type === "select" && (
             <select name={field.name} className="border px-3 py-2 w-full">
                 <option value="">-- Select --</option>
                 {field.options?.map((opt:any, i:any) => (
                 <option key={i} value={opt}>{opt}</option>
                 ))}
             </select>
             )}
             {field.type === "script" && (
                 <pre className="bg-gray-200 p-2 rounded text-sm text-gray-700 whitespace-pre-wrap">
                     {/* Display the script logic */}
                     {field.script}
                 </pre>
             )}
         </div>
        ))}
        <div className="flex justify-end gap-4 pt-6 border-t mt-6">
              <button
                type="button"
                onClick={onCancel}
                className="bg-white border border-gray-300 text-gray-700 font-medium px-5 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                ❌ Cancel
              </button>
        </div>
      </div>
    </div>
  );
}
