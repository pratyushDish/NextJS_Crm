'use client';
import { useState ,useEffect} from 'react';
import { Campaign } from '@/types/Campaign/Campaign';
import { useCampaignList } from '@/Services/CampaignServices/CampaignServices';
import CampaignBuilder from './CampaignBuilder'

export default function CampaignList() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [viewCampaign, setViewCampaign] = useState<Campaign | null>(null);
    const [editingView, setEditingView] = useState<Campaign | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showBuilder, setShowBuilder] = useState(false);
    const [newTitle, setNewTitle] = useState('');

    useEffect(() => {
        async function fetchData() {
        const mapped = await useCampaignList(); // ✅ await the async function
        if(mapped !== undefined)
        {
            setCampaigns(mapped); // ✅ now this is correct
        }
        }
          fetchData();  
    }, []);

    const handleDelete = (id: string) => {
        setCampaigns(campaigns.filter(c => c.id !== id));
    };
    
    const handleEdit = (id: string) => {
        const currentCampaign = campaigns.find(c => c.id === id) ?? null;
        setEditingView(currentCampaign);
        setEditingId(id);
        setShowBuilder(true);
    };
    const ViewCampaigns = (id: string) => {
        const currentCampaign = campaigns.find(c => c.id === id) ?? null;
        setViewCampaign(currentCampaign);
    };
    const handleSaveCampaign = (fields: any[]) => {
        if (editingId) {

            setCampaigns(prev =>
            prev.map(c =>
                c.id === editingId ? { ...c, fields } : c
            )
            );
            setEditingId(null);
        } else {
            setCampaigns([
            ...campaigns,
            {
                id: crypto.randomUUID(),
                title: `Campaign ${campaigns.length + 1}`,
                fields,
            },
            ]);
        }
    
        setShowBuilder(false);
        };
    return (
    <div>
        {showBuilder ? (
        <div>
          <button
            onClick={() => {
              setShowBuilder(false);
              setEditingId(null);
            }}
            className="mb-4 bg-gradient-to-r from-gray-400 to-gray-600 text-white font-semibold px-5 py-2 rounded-xl shadow hover:from-gray-500 hover:to-gray-700 transition duration-200"
          >
            ⬅ Back
          </button>
          <CampaignBuilder
            initialCampaign = {editingView?editingView:{id:"0",title:"",fields:[]}}
            onSave={handleSaveCampaign}
            onCancel={() => {
              setShowBuilder(false);
              setEditingId(null);
            }}
          />
        </div>
      ) : (
        <>
          {/* Campaign Grid */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map(campaign => (
              <div
                key={campaign.id}
                className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
              >
                <h3 className="text-lg font-bold mb-2">{campaign.title}</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Fields: {campaign.fields.length}
                </p>
                <div className="flex justify-between">
                  <button
                    className="text-blue-600 hover:underline font-medium"
                    onClick={() => handleEdit(campaign.id)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="text-green-600 hover:underline font-medium"
                    onClick={() => ViewCampaigns(campaign.id)}
                  >
                    👁️ View
                  </button>
                  <button
                    className="text-red-600 hover:underline font-medium"
                    onClick={() => handleDelete(campaign.id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
        </div> 
        </>
      )}
    </div>)
}
