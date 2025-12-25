import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sun, Cloud, CloudSun, CloudRain, Loader2, Download, Check, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';

// --- Custom Checkbox Component ---
// A robust, custom-styled checkbox to ensure consistent behavior.
const CustomCheckbox = ({ checked, onCheckedChange, id }) => (
    <button
        id={id}
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => onCheckedChange(!checked)}
        className={`h-5 w-5 shrink-0 rounded-sm border-2 flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 ${
            checked
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white text-transparent border-gray-400 hover:border-gray-500'
        }`}
    >
        {/* The check icon is visible only when the checkbox is checked */}
        <Check className={`h-4 w-4 transition-opacity ${checked ? 'opacity-100' : 'opacity-0'}`} />
    </button>
);


// --- Checklist Display Component ---
// This component renders the generated packing list.
const ChecklistDisplay = ({ checklistData, onCheckChange, onClearAll }) => {
    
    const categoryTitles = {
        essentials: "Essential Items",
        clothing: "Clothing & Footwear",
        gear: "Equipment & Gear"
    };

    const allItems = Object.values(checklistData).flat();
    const checkedItemsCount = allItems.filter(item => item.checked).length;
    const totalItemsCount = allItems.length;

    // --- Download Handler ---
    // Creates a text file from the checklist data and triggers a download.
    const handleDownload = () => {
        let content = "Your Hiking Checklist\n\n";

        Object.entries(checklistData).forEach(([category, items]) => {
            if (items.length > 0) {
                content += `${categoryTitles[category]}\n`;
                content += '------------------------\n';
                items.forEach(item => {
                    content += `[${item.checked ? '✓' : '❌'}] ${item.text}\n`;
                });
                content += '\n';
            }
        });

        // Create a Blob (Binary Large Object) from the text content
        const blob = new Blob([content], { type: 'text/plain' });
        
        // Create a temporary link element to trigger the download
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'hiking-checklist.txt'; // The default filename for the download
        
        // Append to body, click, and then remove
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Clean up the URL object to free memory
        URL.revokeObjectURL(a.href);
        toast.success("Checklist downloaded!");
    };

    return (
        <div className="p-6 border rounded-lg bg-white h-full flex flex-col shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Your Packing Checklist</h2>
                <span className="text-sm font-medium text-gray-500">{checkedItemsCount}/{totalItemsCount} items</span>
            </div>

            <div className="flex-grow overflow-y-auto pr-2 space-y-6">
                {Object.entries(checklistData).map(([category, items]) => (
                    items.length > 0 && (
                        <div key={category}>
                            <h3 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">{categoryTitles[category]}</h3>
                            <div className="space-y-4">
                                {items.map(item => (
                                    <div key={item.id} className="flex items-center space-x-3">
                                        {/* Using the CustomCheckbox for better control */}
                                        <CustomCheckbox
                                            id={`item-${item.id}`}
                                            checked={item.checked}
                                            onCheckedChange={(checked) => onCheckChange(category, item.id, checked)}
                                        />
                                        <Label htmlFor={`item-${item.id}`} className="text-base font-normal text-gray-700 cursor-pointer leading-snug">
                                            {item.text}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                ))}
            </div>

            <div className="mt-6 pt-4 border-t flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    {/* The Download button is the only action left */}
                    <Button onClick={handleDownload} variant="outline" size="sm"><Download className="mr-2 h-4 w-4" /> Download</Button>
                </div>
                <Button variant="ghost" size="sm" onClick={onClearAll} className="text-gray-600 hover:text-gray-900">Clear All </Button>
            </div>
        </div>
    );
};


// --- Main Page Component ---
// This is the primary export, bringing together the form and the checklist display.
export default function ChecklistPage() {
    const navigate = useNavigate();
    
    // Form state
    const [experience, setExperience] = useState('new');
    const [duration, setDuration] = useState('full-day');
    const [weather, setWeather] = useState('mild');
    
    // Checklist state
    const [checklistData, setChecklistData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const weatherOptions = [
        { id: 'mild', label: 'Mild', icon: <CloudSun className="mr-2 h-4 w-4" /> },
        { id: 'hot', label: 'Hot', icon: <Sun className="mr-2 h-4 w-4" /> },
        { id: "cold", label: 'Cold', icon: <Cloud className="mr-2 h-4 w-4" /> },
        { id: 'rainy', label: 'Rainy', icon: <CloudRain className="mr-2 h-4 w-4" /> }
    ];

    const handleReset = () => {
        setExperience('new');
        setDuration('full-day');
        setWeather('mild');
        setChecklistData(null);
        setError('');
    };

    const handleGenerateChecklist = async () => {
        setIsLoading(true);
        setError('');
        setChecklistData(null);
        
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/checklist/generate`, {
                params: { experience, duration, weather }
            });
            if (response.data.success) {
                // Initialize all items with a 'checked: false' property
                const initialData = response.data.data;
                for (const category in initialData) {
                    initialData[category] = initialData[category].map(item => ({ ...item, checked: false }));
                }
                setChecklistData(initialData);
            } else {
                const msg = response.data.message || "Failed to generate checklist.";
                toast.error(msg);
                setError(msg);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || "An API error occurred.";
            toast.error(errorMessage);
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCheckChange = (category, itemId, checked) => {
        setChecklistData(prevData => {
            const newData = { ...prevData };
            newData[category] = newData[category].map(item => 
                item.id === itemId ? { ...item, checked } : item
            );
            return newData;
        });
    };

    const handleClearAll = () => {
        setChecklistData(prevData => {
            const newData = { ...prevData };
            for (const category in newData) {
                newData[category] = newData[category].map(item => ({ ...item, checked: false }));
            }
            return newData;
        });
    };

    // Sub-component for the filter form, defined inside the main component for encapsulation
    const FilterForm = () => (
        <div className="space-y-8 p-8 bg-white shadow-sm rounded-lg border">
            <div>
                <Label className="text-base font-semibold text-gray-800">Hiker Experience</Label>
                <RadioGroup value={experience} onValueChange={setExperience} className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Label htmlFor="new-hiker" className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors text-sm font-medium ${experience === 'new' ? 'bg-green-50 border-green-500 text-green-900 ring-2 ring-green-400 ring-offset-1' : 'bg-white hover:bg-gray-50'}`}>
                        <RadioGroupItem value="new" id="new-hiker" className="sr-only" />
                        New Hiker
                    </Label>
                    <Label htmlFor="experienced-hiker" className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors text-sm font-medium ${experience === 'experienced' ? 'bg-green-50 border-green-500 text-green-900 ring-2 ring-green-400 ring-offset-1' : 'bg-white hover:bg-gray-50'}`}>
                        <RadioGroupItem value="experienced" id="experienced-hiker" className="sr-only" />
                        Experienced Hiker
                    </Label>
                </RadioGroup>
            </div>
            <div>
                <Label htmlFor="hike-duration" className="text-base font-semibold text-gray-800">Hike Duration</Label>
                <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger id="hike-duration" className="w-full mt-2 bg-white"><SelectValue placeholder="Select duration" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="half-day">Half Day (2-4 hours)</SelectItem>
                        <SelectItem value="full-day">Full Day (4-8 hours)</SelectItem>
                        <SelectItem value="multi-day">Multi-Day Trip</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label className="text-base font-semibold text-gray-800">Expected Weather</Label>
                <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
                    {weatherOptions.map((option) => (
                        <Button key={option.id} variant={weather === option.id ? "default" : "outline"} className={`w-full justify-center transition-colors ${weather === option.id ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`} onClick={() => setWeather(option.id)}>
                            {option.icon}
                            {option.label}
                        </Button>
                    ))}
                </div>
            </div>
            <div className="flex items-center justify-end pt-4 gap-4">
                <Button variant="outline" onClick={handleReset} className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900">Reset</Button>
                <Button className="bg-green-600 hover:bg-green-700" onClick={handleGenerateChecklist} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {isLoading ? 'Generating...' : 'Generate Checklist'}
                </Button>
            </div>
        </div>
    );

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Fixed Back Button */}
            <button
                onClick={() => navigate('/')}
                className="fixed top-24 left-6 z-50 flex items-center justify-center w-10 h-10 bg-white hover:bg-gray-50 text-gray-700 rounded-full shadow-lg border border-gray-200 transition-all duration-200 hover:shadow-xl"
            >
                <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="container mx-auto py-12 px-4">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900">Generate Your Checklist</h1>
                    <p className="mt-2 text-lg text-gray-600">Customize your packing list based on your experience and trip details.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
                    <div className="lg:col-span-2">
                        <FilterForm />
                    </div>
                    <div className="lg:col-span-3">
                        {isLoading && (
                            <div className="flex items-center justify-center h-full p-10 border-2 border-dashed rounded-lg bg-white">
                                <Loader2 className="h-12 w-12 animate-spin text-green-600" />
                            </div>
                        )}
                        {error && !isLoading && (
                            <div className="flex items-center justify-center h-full p-10 border-2 border-dashed rounded-lg bg-red-50 text-red-600 font-medium">
                                Error: {error}
                            </div>
                        )}
                        {checklistData && !isLoading && (
                            <ChecklistDisplay checklistData={checklistData} onCheckChange={handleCheckChange} onClearAll={handleClearAll} />
                        )}
                        {!checklistData && !isLoading && !error && (
                            <div className="flex items-center justify-center h-full p-10 border-2 border-dashed rounded-lg bg-white">
                                <p className="text-gray-500 text-center">Select your hike details and click "Generate Checklist" to see your personalized packing list.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}