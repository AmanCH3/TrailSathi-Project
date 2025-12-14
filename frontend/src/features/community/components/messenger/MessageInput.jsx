import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '../ui/Button';

export const MessageInput = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;

    onSendMessage(message);
    setMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100 bg-white">
      <div className="flex gap-2 items-end">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
          rows={1}
          disabled={disabled}
          className="flex-1 px-4 py-3 bg-gray-50 border-0 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white resize-none disabled:opacity-50 transition-all font-normal text-sm"
          style={{
            minHeight: '44px',
            maxHeight: '120px',
          }}
          onInput={(e) => {
            e.target.style.height = 'auto';
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
          }}
        />
        <Button
          type="submit"
          variant="primary"
          disabled={!message.trim() || disabled}
          className="flex items-center justify-center h-[44px] w-[44px] rounded-full shadow-none hover:shadow-md transition-all bg-emerald-600 hover:bg-emerald-700 p-0"
        >
          <Send className="w-5 h-5 ml-0.5" />
        </Button>
      </div>
    </form>
  );
};
