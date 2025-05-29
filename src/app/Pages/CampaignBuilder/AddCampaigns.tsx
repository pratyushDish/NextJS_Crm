'use client';

import { useState ,useEffect} from 'react';
import CampaignBuilder from './CampaignBuilder';
import ViewCampaign from './ViewCampaign';
import { getCampaigns } from '@/Services/CampaignServices/CampaignServices';
import CampaignList from './CampaignList';
import { useCampaignList,useAddCampaign,useEditCampaign } from '@/Services/CampaignServices/CampaignServices';
import { AddCampaign ,EditCampaign} from '@/types/Campaign/Campaign';
import SearchBox from '../Search/SearchBox';

interface Campaign {
  id: string;
  title: string;
  fields: any[]; // or your specific Field[] type
}

export default function AddCampaigns() {
  const [showBuilder, setShowBuilder] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewCampaign, setViewCampaign] = useState<Campaign | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingView, setEditingView] = useState<Campaign | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showMessage, setshowMessage] = useState<string | null>(null);
  const [searchValue,setSearchValue] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getCampaigns({LoginId:"2"});
        const parsedData = JSON.parse(response.data); // <-- parses the "\r\n" string

        // Step 2: Map to your internal Campaign structure
        const mappedCampaigns: Campaign[] = parsedData.Campaigns.map((c: any) => ({
          id: String(c.CampaignId),
          title: c.CampaignName,
          fields: c.Fields ? JSON.parse(c.Fields) : [], // Fields might be a stringified array
        }));
        setCampaigns(mappedCampaigns);
      } catch (error) {
        console.error('API Error:', error); // 👈 Logs error in console
      }
    }
    fetchData();
  }, []);
  const handleAddCampaign = () => {
    if (!newTitle.trim()) return;
    
    async function fetchData() {
      const addCampaign: AddCampaign = {
        CampaignTitle: newTitle.trim(),
        fields:"",
      };
      const mapped = await useAddCampaign(addCampaign); // ✅ await the async function
      setshowMessage(mapped);
      showPopUp(mapped);
    }
    fetchData();  
    // setCampaigns([...campaigns, newCampaign]);
    setNewTitle('');
    setShowModal(false);
  };
  async function showPopUp(message:string) {
    await new Promise((message) => setTimeout(message, 500));
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 4000);
  };
  const handleSearch = (value: string) => {
    setSearchValue(value);
  };
  const filteredCampaigns = campaigns.filter(c =>
    c.title.toLowerCase().includes(searchValue.toLowerCase())
  );
  const handleSaveCampaign = (fields: any[]) => {
    if (editingId) {
    const currentCampaign = campaigns.find(c => c.id === editingId) ?? null; 
    console.log(currentCampaign);
    const jsonStrings = JSON.stringify(fields);
    async function fetchData() {
        const editCampaign: EditCampaign = {
          CampaignId : editingId !== null?editingId:"0",
          CampaignName: currentCampaign!== null?currentCampaign.title:"",
          fields:jsonStrings,
        };
      const mapped = await useEditCampaign(editCampaign); // ✅ await the async function
      setshowMessage(mapped);
      showPopUp(mapped);
      }
      fetchData();
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

  const handleDelete = (id: string) => {
    setCampaigns(campaigns.filter(c => c.id !== id));
  };

  const handleEdit = (id: string) => {
    const currentCampaign = campaigns.find(c => c.id === id) ?? null;
    setEditingView(currentCampaign);
    setEditingId(id);
    setShowBuilder(true);
  };

  const currentCampaignFields = editingId
    ? campaigns.find(c => c.id === editingId)?.fields ?? []
    : [];

const ViewCampaigns = (id: string) => {
    const currentCampaign = campaigns.find(c => c.id === id) ?? null;
    setViewCampaign(currentCampaign);
    }; 
  return (
    <div>
    {viewCampaign === null ? (
    <div className="p-6">
      {showSuccess && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-4 rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800 shadow-lg animate-fade-in-up">
          <svg
            className="h-5 w-5 text-green-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span><b>{showMessage}</b></span>
        </div>
      )}
      {/* Header Button */}
      
      {/* {!showBuilder && (
        <div className="flex justify-between items-center mb-4 gap-3 flex-wrap">
        <button
          onClick={() => {
            setEditingId(null);
            setShowModal(true);
          }}
          className="bg-gradient-to-r from-green-500 to-indigo-600 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:from-green-600 hover:to-indigo-700 transition duration-200"
        >
          ➕ Add Campaign
        </button>
        <div className="w-fit">
        <SearchBox onSearch={handleSearch} />
      </div>
    </div>
      )} */}
    <header className="bg-white rounded-lg shadow-sm px-6 py-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
      {/* Left side: Title and Add button */}
      <div className="flex items-center gap-6 flex-wrap">
      <h1 className="text-2xl font-bold text-gray-800">📊 Campaign Tool</h1>

        {!showBuilder && (
          <div>
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setShowModal(true);
            }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 via-teal-500 to-indigo-600 text-white font-semibold text-lg px-8 py-3 rounded-full shadow-lg hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-green-400 transition active:scale-95"
            aria-label="Add new campaign"
          >
            <span className="text-xl">➕</span> Add Campaign
          </button>
          </div>
        )}
      </div>

      {/* Right side: Search */}
      {!showBuilder && (
      <div className="w-full sm:w-auto">
        <SearchBox onSearch={handleSearch} />
      </div>
      )}
    </header>


    {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-center items-center">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">➕ Add New Campaign</h2>

            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
              placeholder="Enter campaign title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
              >
                ❌ Cancel
              </button>
              <button
                onClick={handleAddCampaign}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                💾 Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Campaign Form */}
      {showBuilder ? (
        <div>
          {/* <button
            onClick={() => {
              setShowBuilder(false);
              setEditingId(null);
            }}
            className="mb-4 bg-gradient-to-r from-gray-400 to-gray-600 text-white font-semibold px-5 py-2 rounded-xl shadow hover:from-gray-500 hover:to-gray-700 transition duration-200"
          >
            ⬅ Back
          </button> */}
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
          {filteredCampaigns.length > 0 ? (
              filteredCampaigns.map(c => (
              <div
                key={c.id}
                className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
              >
                <h3 className="text-lg font-bold mb-2">{c.title}</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Fields: {c.fields.length}
                </p>
                <div className="flex justify-between">
                  <button
                    className="text-blue-600 hover:underline font-medium"
                    onClick={() => handleEdit(c.id)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="text-green-600 hover:underline font-medium"
                    onClick={() => ViewCampaigns(c.id)}
                  >
                    👁️ View
                  </button>
                  <button
                    className="text-red-600 hover:underline font-medium"
                    onClick={() => handleDelete(c.id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No campaigns found.</p>
          )}
          </div>
        {/* <CampaignList/> */}
        </>
      )}
    </div>):<ViewCampaign initialFields = {viewCampaign?viewCampaign:{id:"0",title:"",fields:[]}}
        onCancel={() => {
            setViewCampaign(null);
            setEditingId(null);
        }}
    />}
    {/* 👇 Add animation styles */}
    <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
