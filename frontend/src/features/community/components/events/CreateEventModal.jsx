import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/Button'; // Community UI Button
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Calendar as CalendarIcon, MapPin } from 'lucide-react';
import { useCreateEvent } from '@/features/community/hooks/useEvents';
import { useTrailSearch } from '@/features/community/hooks/useTrails';

// Simple local debounce hook if not exists
function useLocalDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

export const CreateEventModal = ({ isOpen, onClose, groupId }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    difficulty: 'Moderate',
    meetLocation: '',
    trailName: '',
    maxParticipants: ''
  });
  
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedSearch = useLocalDebounce(formData.trailName, 500);
  
  const { data: searchResults, isLoading: isSearching } = useTrailSearch(debouncedSearch);
  
  const createEventMutation = useCreateEvent(groupId);
  const isSubmitting = createEventMutation.isPending;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'trailName') {
        setShowSuggestions(true);
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const selectTrail = (trail) => {
      setFormData(prev => ({
          ...prev,
          trailName: trail.name,
          // Optional: pre-fill difficulty or location if empty
          difficulty: trail.difficulty || prev.difficulty,
          // meetLocation: trail.startLocation?.address || prev.meetLocation 
      }));
      setShowSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Combine date and time
    const startDateTime = new Date(`${formData.date}T${formData.time}`);
    
    createEventMutation.mutate({
      title: formData.title,
      description: formData.description,
      startDateTime: startDateTime.toISOString(),
      difficulty: formData.difficulty,
      meetLocation: formData.meetLocation,
      trailName: formData.trailName,
      maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : undefined
    }, {
      onSuccess: () => {
        setFormData({
            title: '',
            description: '',
            date: '',
            time: '',
            difficulty: 'Moderate',
            meetLocation: '',
            trailName: '',
            maxParticipants: ''
        });
        onClose();
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Schedule New Event</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="title">Event Title*</Label>
                    <Input 
                        id="title" 
                        name="title" 
                        value={formData.title} 
                        onChange={handleInputChange} 
                        placeholder="e.g. Saturday Morning Hike" 
                        required 
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="date">Date*</Label>
                        <Input 
                            id="date" 
                            name="date" 
                            type="date" 
                            value={formData.date} 
                            onChange={handleInputChange} 
                            required 
                        />
                    </div>
                    <div className="space-y-2">
                         <Label htmlFor="time">Time*</Label>
                        <Input 
                            id="time" 
                            name="time" 
                            type="time" 
                            value={formData.time} 
                            onChange={handleInputChange} 
                            required 
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="meetLocation">Meeting Point</Label>
                    <Input 
                        id="meetLocation" 
                        name="meetLocation" 
                        value={formData.meetLocation} 
                        onChange={handleInputChange} 
                        placeholder="e.g. Parking Lot A" 
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="difficulty">Difficulty</Label>
                        <Select 
                            value={formData.difficulty} 
                            onValueChange={(val) => handleSelectChange('difficulty', val)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Easy">Easy</SelectItem>
                                <SelectItem value="Moderate">Moderate</SelectItem>
                                <SelectItem value="Hard">Hard</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="maxParticipants">Max Participants</Label>
                        <Input 
                            id="maxParticipants" 
                            name="maxParticipants" 
                            type="number" 
                            min="1"
                            value={formData.maxParticipants} 
                            onChange={handleInputChange} 
                            placeholder="Optional" 
                        />
                    </div>
                </div>
                
                 <div className="space-y-2 relative">
                    <Label htmlFor="trailName">Trail Name</Label>
                     <Input 
                        id="trailName" 
                        name="trailName" 
                        value={formData.trailName} 
                        onChange={handleInputChange} 
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Delay to allow click
                        placeholder="Search for a trail or type a custom name" 
                        autoComplete="off"
                    />
                    {showSuggestions && searchResults?.data?.trails?.length > 0 && (
                        <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto">
                            {searchResults.data.trails.map(trail => (
                                <button
                                    key={trail.id || trail._id}
                                    type="button"
                                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center justify-between group"
                                    onClick={() => selectTrail(trail)}
                                >
                                    <span className="font-medium text-gray-700">{trail.name}</span>
                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {trail.location}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                     {showSuggestions && isSearching && (
                        <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 p-2 text-center text-gray-400 text-sm">
                            Searching...
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                        id="description" 
                        name="description" 
                        value={formData.description} 
                        onChange={handleInputChange} 
                        rows={3} 
                        placeholder="What should participants expect?"
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                    <Button type="submit" variant="primary" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                               <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                               Creating...
                            </>
                        ) : 'Create Event'}
                    </Button>
                </div>
            </form>
        </DialogContent>
    </Dialog>
  );
};
