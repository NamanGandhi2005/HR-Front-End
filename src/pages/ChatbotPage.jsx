import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ChatPanel from '../components/ChatPanel';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';

function ChatbotPage() {
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [promptProcessed, setPromptProcessed] = useState(false); // 1. New state to track if the prompt was handled

  const sendMessage = async (promptOverride) => {
    const textToSend = promptOverride || input;
    if (!textToSend.trim()) return;

    setMessages(prev => [...prev, { text: textToSend, sender: 'user' }]);
    setInput("");
    setIsBotTyping(true);

    try {
        const response = await fetch('http://localhost:3001/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: textToSend }),
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setMessages(prev => [...prev, { text: data.reply, sender: 'bot' }]);
    } catch (error) {
        console.error("Fetch API call failed:", error);
        setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting.", sender: 'bot' }]);
    } finally {
        setIsBotTyping(false);
    }
  };

  useEffect(() => {
    const initialPrompt = location.state?.initialPrompt;
    // 2. Check if a prompt exists AND if it has NOT been processed yet
    if (initialPrompt && !promptProcessed) {
      sendMessage(initialPrompt);
      // Mark the prompt as processed so this logic doesn't run again
      setPromptProcessed(true);
    }
  }, [location.state, promptProcessed]);

  const handleNewChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex w-full overflow-hidden">
      <LeftSidebar onNewChat={handleNewChat} />
      <ChatPanel
        messages={messages}
        input={input}
        setInput={setInput}
        isBotTyping={isBotTyping}
        sendMessage={sendMessage}
      />
      <RightSidebar />
    </div>
  );
}

export default ChatbotPage;