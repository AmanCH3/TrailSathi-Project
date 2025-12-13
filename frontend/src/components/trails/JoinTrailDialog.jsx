import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useJoinTrailWithDate } from "../../hooks/admin/useAdminTrail";
import confetti from "canvas-confetti";
import { MoveRight } from "lucide-react"; // Icon for Hiker

export function JoinTrailDialog({ trail, isOpen, onOpenChange }) {
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const { mutate: joinTrail, isPending, isSuccess } = useJoinTrailWithDate();

  // Animation States
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    // success effect handled in mutation callbacks or local effect
    if (isSuccess) {
      setShowCelebration(true);
      launchConfetti();
      // Auto close after animation
      setTimeout(() => {
        onOpenChange(false);
        setShowCelebration(false);
        setNotes(""); // Reset notes
      }, 3500);
    }
  }, [isSuccess, onOpenChange]);

  const launchConfetti = () => {
    var duration = 3 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    var random = function(min, max) {
      return Math.random() * (max - min) + min;
    };

    var interval = setInterval(function() {
      var timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      var particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
  };

  const handleJoin = () => {
    if (!trail || !date) return;
    
    // Using expected payload: id + data object
    joinTrail({ 
      id: trail._id, 
      data: { 
        scheduledDate: date.toISOString(),
        notes: notes // Passing notes if backend supports it later
      } 
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[850px] p-0 overflow-hidden rounded-2xl border-none shadow-2xl bg-[#fdfdfd]">
        
        {/* LOADING STATE - WALKING CARTOON */}
        {isPending && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
            <div className="relative w-full overflow-hidden h-32">
                <div className="absolute top-1/2 left-0 animate-walk text-4xl">
                     🚶‍♂️
                </div>
                {/* Simple 'Trail' Line */}
                <div className="absolute top-2/3 w-full border-b-2 border-dashed border-gray-300"></div>
            </div>
            <h3 className="text-xl font-bold text-gray-700 mt-4 animate-pulse">Hiking to the server...</h3>
          </div>
        )}

        {/* SUCCESS STATE - LINE DRAWING & CELEBRATION */}
        {showCelebration && (
             <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white">
                <svg width="200" height="200" viewBox="0 0 100 100" className="mb-4">
                    <path 
                        d="M10,90 Q50,10 90,90" 
                        fill="none" 
                        stroke="#22c55e" 
                        strokeWidth="4" 
                        className="path-drawing"
                    />
                     <circle cx="10" cy="90" r="3" fill="#22c55e" />
                     <circle cx="90" cy="90" r="3" fill="#22c55e" />
                </svg>
                <h2 className="text-3xl font-extrabold text-green-600">Journey Started!</h2>
                <p className="text-gray-500">Your adventure begins on {date.toDateString()}</p>
             </div>
        )}

        {/* MAIN CONTENT - SPLIT VIEW */}
        <div className="flex flex-col md:flex-row h-full md:h-[500px]">
        
          {/* LEFT: CALENDAR (Journal Date Picker Style) */}
          <div className="md:w-1/2 p-6 bg-[#f8f9fa] border-r border-gray-100 flex flex-col">
             <div className="mb-6">
                <h2 className="text-2xl font-serif text-gray-800 font-bold">Pick a Date</h2>
                <p className="text-sm text-gray-500">When does your adventure begin?</p>
             </div>
             
             <div className="flex-1 flex justify-center">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-xl border bg-white shadow-sm"
                    classNames={{
                        day_selected: "bg-black text-white hover:bg-gray-800 focus:bg-black",
                        day_today: "bg-gray-100 text-gray-900 font-bold"
                    }}
                    disabled={(day) => day < new Date(new Date().setDate(new Date().getDate() - 1))}
                />
             </div>
          </div>

          {/* RIGHT: JOURNAL (Notes & Confirmation) */}
          <div className="md:w-1/2 p-8 bg-white flex flex-col">
             <div className="mb-4">
                <h2 className="text-2xl font-serif text-gray-800 font-bold mb-1">My Hike Journal</h2>
                <div className="text-xs font-bold uppercase tracking-wider text-green-600 mb-4">
                    Target: {trail?.name}
                </div>
             </div>

             <div className="bg-[#fffdf5] border border-yellow-100 rounded-lg p-4 flex-1 shadow-inner relative mb-6">
                {/* Lined Paper Effect */}
                <div className="absolute inset-0 bg-[linear-gradient(transparent_23px,#e5e7eb_24px)] bg-[size:100%_24px] pointer-events-none opacity-50"></div>
                
                <textarea 
                    className="w-full h-full bg-transparent resize-none focus:outline-none text-gray-700 font-handwriting text-lg leading-[24px]"
                    placeholder="Write your thoughts, goals, or gear checklist here..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    style={{ fontFamily: '"Indie Flower", "Comic Sans MS", cursive' }} // Simple handwriting fallback
                />
             </div>

             <div className="space-y-3">
                 <div className="flex justify-between items-center text-sm text-gray-600 border-t pt-3">
                    <span>Selected Date:</span>
                    <span className="font-bold">{date ? date.toDateString() : "Select a date"}</span>
                 </div>
                 
                 <div className="flex gap-3 mt-4">
                     <Button 
                        variant="ghost" 
                        onClick={() => onOpenChange(false)} 
                        className="flex-1"
                        disabled={isPending || showCelebration}
                     >
                        Cancel
                     </Button>
                     <Button 
                        onClick={handleJoin} 
                        disabled={isPending || !date || showCelebration}
                        className="flex-1 bg-black text-white hover:bg-gray-800 transition-all font-bold group"
                     >
                        {isPending ? "Starting..." : (
                            <span className="flex items-center gap-2">
                                Start Journey <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                        )}
                     </Button>
                 </div>
             </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}