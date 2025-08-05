import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useClerk, useUser, useAuth } from '@clerk/clerk-react';
import ChatPanel from '../components/ChatPanel';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';

const MESSAGE_LIMIT_BEFORE_LOGIN = 3;

function ChatbotPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { openSignIn } = useClerk();
    const { isSignedIn } = useUser();
    const { getToken } = useAuth();

    const [messages, setMessages] = useState([]);
    const [chatId, setChatId] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [history, setHistory] = useState([]);
    const [input, setInput] = useState("");
    const [isBotTyping, setIsBotTyping] = useState(false);
    const [promptProcessed, setPromptProcessed] = useState(false);
    const userMessageCount = useRef(0);
    
    // A ref to prevent the merge effect from running multiple times
    const hasMerged = useRef(false);

    const authenticatedFetch = useCallback(async (url, options = {}) => {
        const token = await getToken();
        const headers = {
            ...options.headers,
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        return fetch(url, { ...options, headers, credentials: 'include' });
    }, [getToken]);

    const formatMessages = (dbMessages) => {
        return dbMessages.map(msg => ({ text: msg.content, sender: msg.sender }));
    };

    const handleNewChat = () => {
        setMessages([]);
        setChatId(null);
        setPromptProcessed(false);
        userMessageCount.current = 0;
    };
    
    // Effect to handle merging guest chats to a signed-in user
    useEffect(() => {
        const mergeGuestChats = async () => {
            const guestId = sessionStorage.getItem('guestId');
            // Only run if the user is signed in, we have a guestId, and we haven't merged yet
            if (isSignedIn && guestId && !hasMerged.current) {
                hasMerged.current = true; // Prevent this from running again
                try {
                    await authenticatedFetch('http://localhost:3001/merge', {
                        method: 'POST',
                        body: JSON.stringify({ guestId }),
                    });
                    sessionStorage.removeItem('guestId'); // Clean up the stored guestId
                    
                    // Reload the session and history for the now authenticated user
                    await loadSessionAndHistory();
                } catch (error) {
                    console.error("Failed to merge chats:", error);
                }
            }
        };

        mergeGuestChats();
    }, [isSignedIn, authenticatedFetch]);

    // Combined function to load session and history
    const loadSessionAndHistory = useCallback(async () => {
        setIsLoading(true);
        try {
            if (location.state?.startNewChat) {
                handleNewChat();
                return;
            }

            const response = await authenticatedFetch('http://localhost:3001/session', { method: 'GET' });
            if (!response.ok) throw new Error("Failed to fetch session");
            
            const data = await response.json();
            if (data && data.userId) {
                setUserId(data.userId);
                
                // If the user is a guest, store their ID to prepare for a potential merge
                if (!isSignedIn && data.userId.startsWith('guest-')) {
                    sessionStorage.setItem('guestId', data.userId);
                }
                
                if (data.messages && data.messages.length > 0) {
                    setChatId(data.chatId);
                    setMessages(formatMessages(data.messages));
                } else {
                    setMessages([]); // Clear messages if the user has no chats
                    setChatId(null);
                }
            }
        } catch (error) {
            console.error("Could not restore session:", error);
        } finally {
            setIsLoading(false);
        }
    }, [location.state?.startNewChat, authenticatedFetch, isSignedIn]);

    // Main effect to load data on component mount
    useEffect(() => {
        loadSessionAndHistory();
    }, [loadSessionAndHistory]);

    const fetchHistory = useCallback(async () => {
        if (!userId) return;
        try {
            const response = await authenticatedFetch('http://localhost:3001/history');
            if (!response.ok) throw new Error("Failed to fetch history");
            const data = await response.json();
            setHistory(data);
        } catch (error) {
            console.error("Error fetching history:", error);
            setHistory([]);
        }
    }, [userId, authenticatedFetch]);
    
    useEffect(() => {
        if (userId) fetchHistory();
    }, [userId, fetchHistory]);
    
    const loadSpecificChat = async (chatIdToLoad) => {
        if (chatIdToLoad === chatId) return;
        setIsLoading(true);
        try {
            const response = await authenticatedFetch(`http://localhost:3001/chat/${chatIdToLoad}`, { method: 'GET' });
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
            const response = await authenticatedFetch('http://localhost:3001/chat', {
                method: 'POST',
                body: JSON.stringify({
                    prompt: textToSend,
                    chatId: chatId,
                    history: newMessages.slice(0, -1)
                }),
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            setMessages(prev => [...prev, { text: data.reply, sender: 'bot' }]);
            
            if (data.newChatId) {
                setChatId(data.newChatId);
                // After creating a new chat, refetch the history to update the sidebar
                fetchHistory(); 
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

    return (
        <div className="flex w-full overflow-hidden">
            <LeftSidebar
                onNewChat={handleNewChat}
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