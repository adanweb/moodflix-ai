import React, { useState, useEffect, useRef } from 'react';
import { Chat } from "@google/genai";
import { ChatMessage } from '../types';
import { createChat } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

const Chatbot: React.FC = () => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [history, setHistory] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isBotTyping, setIsBotTyping] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setChat(createChat());
        setHistory([{
            role: 'model',
            text: "Budimo realni, you've come to the right place. I'm Kazo, your personal movie guru. Ask me anything, I've probably seen it twice."
        }])
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history, isBotTyping]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || !chat || isBotTyping) return;

        const newUserMessage: ChatMessage = { role: 'user', text: userInput };
        setHistory(prev => [...prev, newUserMessage]);
        const currentInput = userInput;
        setUserInput('');
        setIsBotTyping(true);

        try {
            const stream = await chat.sendMessageStream({ message: currentInput });
            let text = '';
            // Add a placeholder for the bot's response
            setHistory(prev => [...prev, { role: 'model', text: '' }]);
            
            for await (const chunk of stream) {
                text += chunk.text;
                setHistory(prev => {
                    const newHistory = [...prev];
                    // Update the last message (the bot's response)
                    newHistory[newHistory.length-1].text = text;
                    return newHistory;
                });
            }
        } catch (error) {
            console.error(error);
            setHistory(prev => {
                const newHistory = [...prev];
                // If there was an error, make sure the last message isn't a blank bubble
                if(newHistory[newHistory.length-1].text === ''){
                    newHistory[newHistory.length-1].text = 'Sorry, I encountered an error. Please try again.';
                } else {
                     newHistory.push({ role: 'model', text: 'Sorry, I encountered an error. Please try again.' });
                }
                return newHistory
            });
        } finally {
            setIsBotTyping(false);
        }
    };

    return (
        <div className="flex flex-col h-[75vh] w-full max-w-3xl mx-auto bg-gray-800 rounded-2xl shadow-2xl border border-gray-700/50">
            <div className="p-4 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-center text-white">Chat with Kazo</h2>
            </div>
            <div className="flex-grow p-4 overflow-y-auto space-y-4">
                {history.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0 text-sm">K</div>}
                        <div className={`px-4 py-2 rounded-2xl max-w-sm md:max-w-md lg:max-w-lg break-words prose prose-invert prose-p:my-0 ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>
                           {msg.text}
                        </div>
                    </div>
                ))}
                 {isBotTyping && history[history.length - 1]?.role !== 'model' && (
                     <div className="flex items-end gap-2 justify-start">
                         <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0 text-sm">K</div>
                         <div className="px-4 py-2 rounded-2xl bg-gray-700 text-gray-200 rounded-bl-none">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse " style={{animationDelay: '0ms'}}></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse " style={{animationDelay: '150ms'}}></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse " style={{animationDelay: '300ms'}}></span>
                            </div>
                         </div>
                     </div>
                )}
                <div ref={chatEndRef} />
            </div>
            <div className="p-4 border-t border-gray-700">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Ask Kazo... e.g., Why is Blade Runner so influential?"
                        className="flex-grow bg-gray-700 rounded-full py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isBotTyping || !chat}
                    />
                    <button
                        type="submit"
                        disabled={isBotTyping || !userInput.trim()}
                        className="bg-blue-600 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                        aria-label="Send message"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086L2.279 16.76a.75.75 0 00.95.826l14.5-4.25a.75.75 0 000-1.352L3.105 2.289z" />
                      </svg>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chatbot;
