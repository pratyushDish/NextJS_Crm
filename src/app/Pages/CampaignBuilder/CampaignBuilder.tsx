"use client";

import { useState,useEffect, ChangeEvent } from "react";

type FieldType = "text" | "radio" | "select" | "script" | "button";

interface Field {
  id: string;
  type: FieldType;
  question: string;
  name: string;
  options?: string[];
  script?:string;
}

interface NewField {
  id: string;
  type: FieldType;
  question: string;
  name: string;
  options: string;
  script: string;
}

interface Answers {
  [key: string]: string;
}
interface Campaign {
    id: string;
    title: string;
    fields: any[]; // or your specific Field[] type
  }
interface CampaignBuilderProps {
    onSave: (fields: Field[]) => void;
    onCancel: () => void;
    initialCampaign?: Campaign;
  }

export default function CampaignBuilder({
    onSave,
    onCancel,
    initialCampaign,
  }: CampaignBuilderProps) {
    
  const [fields, setFields] = useState<Field[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editIndex, seteditIndex] = useState<number | null>(null);
  const [addIndex, setaddIndex] = useState<number | null>(null);
  const [textColor, setTextColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [newField, setNewField] = useState<NewField>({
    id:"",
    type: "text",
    question: "",
    name: "",
    options: "",
    script:"",
  });
  useEffect(() => {
    if (initialCampaign?.fields) {
      setFields(initialCampaign.fields);
    }
  }, [initialCampaign]);

  const [answers, setAnswers] = useState<Answers>({});
  const [currentStep, setCurrentStep] = useState<number>(0);

  const handleAddField = () => {
    const fieldToAdd: Field = {
      id: newField.id || crypto.randomUUID() + '_' + newField.name,
      type: newField.type,
      question: newField.question,
      name: newField.name,
      ...(newField.type !== "text" && newField.type !== "script" && {
        options: newField.options.split(",").map((o) => o.trim()),
      }),
      script: newField.type === "script" ? newField.script : "",
    };
  
    if (addIndex !== null && addIndex >= 0) {
      const updatedFields = [...fields];
      updatedFields.splice(addIndex + 1, 0, fieldToAdd); 
      setFields(updatedFields);
    } else if (editIndex !== null && editIndex >= 0) {
      const updatedFields = [...fields];
      updatedFields[editIndex] = { ...fieldToAdd, id: newField.id }; 
      setFields(updatedFields);
    } else {
      setFields([...fields, fieldToAdd]);
    }
  
    setNewField({ id: "", type: "text", question: "", name: "", options: "", script: "" });
    setShowModal(false);
  };
  
  const handleAddFieldAfter = (index: number) => {
    setaddIndex(index);
    setShowModal(true);
  };
  
  const handleEditField = (index: number) => {
    const fieldToEdit = fields[index];
    seteditIndex(index);
    const field: NewField = {
        id: fieldToEdit.id,
        type: fieldToEdit.type,
        name: fieldToEdit.name,
        question: fieldToEdit.question,
        options:
          fieldToEdit.type !== "text" &&
          fieldToEdit.type !== "script" &&
          Array.isArray(fieldToEdit.options)
            ? fieldToEdit.options.join(',')
            : "",
        script: fieldToEdit.type === "script" ? fieldToEdit.script || "" : "",
      };
  
    setNewField(field);
    setShowModal(true);
  };
  
  const handleDeleteField = (index: number) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    setFields(updatedFields); // assuming you have a useState for `fields`
  };
  

  return (
    <div className="w-full max-w-3xl mx-auto p-1 sm:p-1 lg:p-1">
        {/* Heading */}
        {/* <h1 className="text-4xl sm:text-3xl font-extrabold text-gray-800 tracking-tight mb-8 text-center">
            🚀 Campaign Builder
        </h1> */}

        {/* Add Question Button */}
        <div className="flex justify-center">
            <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 via-teal-500 to-indigo-600 text-white font-semibold text-lg px-8 py-3 rounded-full shadow-lg hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-green-400 transition active:scale-95"
            aria-label="Add new campaign"
            >
            ➕ Add Field
            </button>
        </div>
        <div className="mt-8 border-t pt-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6 flex items-center justify-center gap-3">
        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
            Campaign: <span className="text-gray-900">{initialCampaign?.title}</span>
        </span>
        </h1>
        {fields.length > 0 && (
        <form className="space-y-6">
            {fields.map((field, index) => (
            <div key={index} className="p-4 border rounded-lg bg-white shadow-sm relative">
                <label className="block font-semibold mb-2 text-gray-800">
                {/* <span className="mt-4 space-x-4"> */}
                {field.question}{" "}
                {/* <span>
                    C:{" "}
                    <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} />
                </span>

                <span>
                    B:{" "}
                    <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
                </span>
                </span> */}
                </label>

                {/* Render Input Fields */}
                {field.type === "text" && (
                <input
                    id={field.id}
                    type="text"
                    name={field.name}
                    className="border px-3 py-2 w-full rounded"
                    placeholder="Your answer"
                />
                )}

                {field.type === "radio" && field.options?.map((opt, i) => (
                <label id={field.id} key={i} className="mr-4 inline-flex items-center">
                    <input type="radio" name={field.name} value={opt} className="mr-1" />
                    {opt}
                </label>
                ))}

                {field.type === "select" && (
                <select id={field.id} name={field.name} className="border px-3 py-2 w-full rounded">
                    <option value="">-- Select --</option>
                    {field.options?.map((opt, i) => (
                    <option key={i} value={opt}>{opt}</option>
                    ))}
                </select>
                )}

                {field.type === "script" && (
                <pre id={field.id} className="bg-gray-100 p-3 rounded text-sm text-gray-700 whitespace-pre-wrap">
                    {field.script}
                </pre>
                )}

                {field.type === "button" && (
                <button
                    id={field.id}
                    type="button"
                    onClick={() => {
                    console.log("Button clicked:", field.name || field.type);
                    }}
                    className="inline-flex items-center px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                >
                    {field.name || "Click Me"}
                </button>
                )}

                {/* Edit & Delete Buttons */}
                <div className="absolute top-3 right-3 flex gap-2">
                <button
                    type="button"
                    onClick={() => handleAddFieldAfter(index)}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                    ➕ Add Field Below
                </button>
                <button
                    type="button"
                    onClick={() => handleEditField(index)}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                    ✏️ Edit
                </button>
                <button
                    type="button"
                    onClick={() => handleDeleteField(index)}
                    className="text-red-600 hover:text-red-800 font-medium text-sm"
                >
                    🗑️ Delete
                </button>
                </div>
            </div>
            ))}
        </form>
    )}
     <div className="flex justify-end gap-4 pt-6 border-t mt-6">
              <button
                type="button"
                onClick={onCancel}
                className="bg-white border border-gray-300 text-gray-700 font-medium px-5 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                ❌ Cancel
              </button>
              {fields.length > 0 &&
              (<button
                type="button"
                onClick={() => onSave(fields)}
                className="bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow hover:from-green-600 hover:to-blue-700 transition"
              >
                💾 Save Campaign
              </button>)}
            </div>
    </div>
      {/* Modal for Adding Questions */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-[95%] max-w-3xl p-8 animate-fadeIn relative">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">➕ Add Field</h2>

            <select
                className="border border-gray-300 p-2 mb-3 w-full rounded"
                value={newField.type}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setNewField({ ...newField, type: e.target.value as FieldType })
                }
            >
                <option value="text">Text</option>
                <option value="radio">Radio</option>
                <option value="select">Dropdown</option>
                <option value="script">Script</option>
                <option value="button">Button</option>
            </select>

            <input
                type="text"
                className="border border-gray-300 p-2 mb-3 w-full rounded"
                placeholder="Question"
                value={newField.question}
                onChange={(e) =>
                setNewField({ ...newField, question: e.target.value })
                }
            />

            <input
                type="text"
                className="border border-gray-300 p-2 mb-3 w-full rounded"
                placeholder="Field Name"
                value={newField.name}
                onChange={(e) =>
                setNewField({ ...newField, name: e.target.value })
                }
            />

            {(newField.type === "radio" || newField.type === "select") && (
                <input
                type="text"
                className="border border-gray-300 p-2 mb-3 w-full rounded"
                placeholder="Options (comma-separated)"
                value={newField.options}
                onChange={(e) =>
                    setNewField({ ...newField, options: e.target.value })
                }
                />
            )}

            {newField.type === "script" && (
                <textarea
                className="border border-gray-300 p-2 mb-3 w-full rounded min-h-[100px]"
                placeholder="Enter Script"
                value={newField.script}
                onChange={(e) =>
                    setNewField({ ...newField, script: e.target.value })
                }
                />
            )}
            {/* <div style={{ backgroundColor: bgColor, color: textColor }} className="p-4 rounded">
                <p className="font-bold">Dynamic Styled Text</p>

               
            </div> */}

            <div className="flex justify-end space-x-3 pt-4">
            <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-black transition duration-200"
            >
                ❌ Cancel
            </button>
            <button
                onClick={handleAddField}
                className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-md transition duration-200"
            >
                💾 Save
            </button>
            </div>
            </div>
        </div>
)}

    </div>
  );
}
