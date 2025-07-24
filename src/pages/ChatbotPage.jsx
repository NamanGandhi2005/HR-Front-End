import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useClerk, useUser } from '@clerk/clerk-react';
import ChatPanel from '../components/ChatPanel';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';

const MESSAGE_LIMIT_BEFORE_LOGIN = 3;

function ChatbotPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 1. Initialize state from sessionStorage.
  // This function runs only once when the component mounts.
  const [messages, setMessages] = useState(() => {
    const savedMessages = sessionStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });

  const [input, setInput] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [promptProcessed, setPromptProcessed] = useState(false);
  const { openSignIn } = useClerk();
  const { isSignedIn } = useUser();
  const userMessageCount = useRef(0);

  // 2. Save messages to sessionStorage whenever they change.
  useEffect(() => {
    sessionStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);


  const sendMessage = async (promptOverride) => {
    const textToSend = promptOverride || input;
    if (!textToSend.trim()) return;

    if (!promptOverride) {
        userMessageCount.current += 1;
    }

    const isRequestingCandidates = textToSend.toLowerCase().includes('show') && textToSend.toLowerCase().includes('candidates');

    if (isRequestingCandidates && !isSignedIn) {
        openSignIn();
        return;
    }

    if (userMessageCount.current >= MESSAGE_LIMIT_BEFORE_LOGIN && !isSignedIn) {
        setMessages(prev => [...prev, { text: "Please sign in to continue the conversation.", sender: 'bot' }]);
        openSignIn();
        return;
    }

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
    userMessageCount.current = 0;
    // 3. Clear sessionStorage when starting a new chat.
    sessionStorage.removeItem('chatMessages');
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