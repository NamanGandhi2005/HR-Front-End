import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ChatPanel from '../components/ChatPanel';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';

function ChatbotPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [promptProcessed, setPromptProcessed] = useState(false);

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
    if (initialPrompt && !promptProcessed) {
      sendMessage(initialPrompt);
      setPromptProcessed(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, promptProcessed, navigate]);

  const handleNewChat = () => {
    setMessages([]);
    setPromptProcessed(true);
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