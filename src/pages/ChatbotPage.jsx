import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useClerk, useUser } from '@clerk/clerk-react';
import ChatPanel from '../components/ChatPanel';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';

const MESSAGE_LIMIT_BEFORE_LOGIN = 3;

function ChatbotPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);
    const [chatId, setChatId] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [history, setHistory] = useState([]);
    const [input, setInput] = useState("");
    const [isBotTyping, setIsBotTyping] = useState(false);
    const [promptProcessed, setPromptProcessed] = useState(false);
    const { openSignIn } = useClerk();
    const { isSignedIn } = useUser();
    const userMessageCount = useRef(0);

    const formatMessages = (dbMessages) => {
        return dbMessages.map(msg => ({
            text: msg.content,
            sender: msg.sender
        }));
    };

    const fetchHistory = useCallback(async () => {
        if (!userId) return;
        try {
            const response = await fetch('http://localhost:3001/history', {
                credentials: 'include'
            });
            if (!response.ok) throw new Error("Failed to fetch history");
            const data = await response.json();
            setHistory(data);
        } catch (error) {
            console.error("Error fetching history:", error);
            setHistory([]);
        }
    }, [userId]);

    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            try {
                // If we are starting a new chat, don't load the previous session.
                if (location.state?.startNewChat) {
                    handleNewChat();
                    return;
                }

                const response = await fetch('http://localhost:3001/session', {
                    method: 'GET',
                    credentials: 'include',
                });
                if (!response.ok) throw new Error("Failed to fetch session");
                const data = await response.json();
                if (data && data.userId) {
                    setUserId(data.userId);
                    if (data.messages && data.messages.length > 0) {
                        setChatId(data.chatId);
                        setMessages(formatMessages(data.messages));
                    }
                }
            } catch (error) {
                console.error("Could not restore session:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadInitialData();
    }, [location.state?.startNewChat]); // Re-run if `startNewChat` changes
    
    useEffect(() => {
        if (userId) {
            fetchHistory();
        }
    }, [userId, fetchHistory]);
    
    const loadSpecificChat = async (chatIdToLoad) => {
        if (chatIdToLoad === chatId) return;
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:3001/chat/${chatIdToLoad}`, {
                method: 'GET',
                credentials: 'include',
            });
            if (!response.ok) throw new Error("Failed to fetch specific chat");
            const dbMessages = await response.json();
            setChatId(chatIdToLoad);
            setMessages(formatMessages(dbMessages));
        } catch (error) {
            console.error("Could not load specific chat:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const sendMessage = async (promptOverride) => {
        const textToSend = promptOverride || input;
        if (!textToSend.trim() || isBotTyping) return;

        if (!promptOverride) userMessageCount.current += 1;
        
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

        const newMessages = [...messages, { text: textToSend, sender: 'user' }];
        setMessages(newMessages);
        setInput("");
        setIsBotTyping(true);

        try {
            const response = await fetch('http://localhost:3001/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: textToSend,
                    chatId: chatId,
                    history: newMessages.slice(0, -1)
                }),
                credentials: 'include',
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            setMessages(prev => [...prev, { text: data.reply, sender: 'bot' }]);
            
            if (data.newChatId) {
                setChatId(data.newChatId);
                if (!userId) {
                    const sessionResponse = await fetch('http://localhost:3001/session', { credentials: 'include' });
                    const sessionData = await sessionResponse.json();
                    if (sessionData && sessionData.userId) {
                        setUserId(sessionData.userId);
                    }
                } else {
                    fetchHistory();
                }
            }
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
        setChatId(null);
        setPromptProcessed(false);
        userMessageCount.current = 0;
    };

    return (
        <div className="flex w-full overflow-hidden">
            <LeftSidebar
                onNewChat={handleNewChat}
                userId={userId}
                onChatSelect={loadSpecificChat}
                currentChatId={chatId}
                history={history}
            />
            <ChatPanel
                messages={messages}
                input={input}
                setInput={setInput}
                isBotTyping={isBotTyping}
                sendMessage={sendMessage}
                isLoading={isLoading}
            />
            <RightSidebar />
        </div>
    );
}

export default ChatbotPage;