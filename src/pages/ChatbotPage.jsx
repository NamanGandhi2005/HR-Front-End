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

  // 1. Initialize state from a single sessionStorage object
  const [chatState, setChatState] = useState(() => {
    const savedState = sessionStorage.getItem('chatState');
    return savedState ? JSON.parse(savedState) : { messages: [], chatId: null };
  });

  const { messages, chatId } = chatState;

  const [input, setInput] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [promptProcessed, setPromptProcessed] = useState(false);
  const { openSignIn } = useClerk();
  const { isSignedIn } = useUser();
  const userMessageCount = useRef(0);

  // 2. Save the entire chat state to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem('chatState', JSON.stringify(chatState));
  }, [chatState]);

  // Helper function to update state
  const updateChatState = (newMessages, newChatId) => {
    setChatState({
      messages: newMessages !== undefined ? newMessages : messages,
      chatId: newChatId !== undefined ? newChatId : chatId,
    });
  };

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
        const newMessages = [...messages, { text: "Please sign in to continue the conversation.", sender: 'bot' }];
        updateChatState(newMessages, chatId);
        openSignIn();
        return;
    }
    
    // Add user message to state immediately for a responsive UI
    const userMessage = { text: textToSend, sender: 'user' };
    const newMessages = [...messages, userMessage];
    updateChatState(newMessages, chatId);

    setInput("");
    setIsBotTyping(true);

    try {
        // 3. Prepare history in the format the backend expects
        const historyForBackend = newMessages.slice(0, -1).map(msg => ({ // Send all messages except the current one
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
        }));

        // 4. Send `prompt`, `chatId`, and `history` in the request body
        const response = await fetch('http://localhost:3001/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              prompt: textToSend,
              chatId: chatId, // Send the current chatId (can be null for a new chat)
              history: historyForBackend
            }),
            credentials: 'include', // Important for sending cookies
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        
        const data = await response.json();

        // 5. Add the bot's reply and update the chatId if it's a new chat
        const botMessage = { text: data.reply, sender: 'bot' };
        const finalMessages = [...newMessages, botMessage];
        const newChatId = data.newChatId || chatId; // Use the new ID if provided
        
        updateChatState(finalMessages, newChatId);

    } catch (error) {
        console.error("Fetch API call failed:", error);
        const errorMessages = [...newMessages, { text: "Sorry, I'm having trouble connecting.", sender: 'bot' }];
        updateChatState(errorMessages, chatId);
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
    // 6. Clear both messages and chatId for a new chat
    updateChatState([], null);
    setPromptProcessed(true);
    userMessageCount.current = 0;
    sessionStorage.removeItem('chatState');
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