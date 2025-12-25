import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useCreateGroupEvent } from "../../hooks/useGroup";

export function CreateEventDialog({ open, onOpenChange, groupId }) {
    const { mutate: createEvent, isPending } = useCreateGroupEvent();
    
    // Separate state for Date and Time
    const [date, setDate] = useState(null);
    const [time, setTime] = useState("");

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        meetLocation: '',
        difficulty: 'Moderate',
        trailName: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!date || !time) {
            // Handle error: Date and Time required
            return;
        }

        // Combine Date and Time
        const dateTimeString = `${format(date, 'yyyy-MM-dd')}T${time}`;
        const startDateTime = new Date(dateTimeString).toISOString();

        createEvent({
            groupId,
            data: { ...formData, startDateTime }
        }, {
            onSuccess: () => {
                onOpenChange(false);
                setFormData({
                    title: '',
                    description: '',
                    meetLocation: '',
                    difficulty: 'Moderate',
                    trailName: ''
                });
                setDate(null);
                setTime("");
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create Group Event</DialogTitle>
                    <DialogDescription>Plan a new adventure for your group.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Event Title</Label>
                        <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required placeholder="e.g. Saturday Morning Hike" />
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder="Details about the hike..." />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant={"outline"} className={`w-full justify-start text-left font-normal ${!date && "text-muted-foreground"}`}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="time">Time</Label>
                            <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="meetLocation">Meeting Point</Label>
                        <Input id="meetLocation" name="meetLocation" value={formData.meetLocation} onChange={handleInputChange} required placeholder="e.g. Trailhead Parking" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <Label htmlFor="difficulty">Difficulty</Label>
                            <Select name="difficulty" value={formData.difficulty} onValueChange={(val) => handleSelectChange('difficulty', val)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Easy">Easy</SelectItem>
                                    <SelectItem value="Moderate">Moderate</SelectItem>
                                    <SelectItem value="Hard">Hard</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="trailName">Trail Name (Optional)</Label>
                            <Input id="trailName" name="trailName" value={formData.trailName} onChange={handleInputChange} placeholder="e.g. Shivapuri Trail" />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isPending}>
                            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Create Event
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
