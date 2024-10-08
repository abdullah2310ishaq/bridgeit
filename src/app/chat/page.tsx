"use client";
import React, { useState } from "react";
import { IoMdSend } from "react-icons/io";
import { GoogleGenerativeAI } from '@google/generative-ai';

// Hardcoded API key
const apiKey = 'AIzaSyCuDO42B9iq6EeXrlo2WJBrwWuHkYh3jrM';
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-pro-002',
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: 'text/plain',
};

const promptsAndResponses: { [key: string]: string } = {
  'Who are you?': 'I am the BridgeIT chatbot, here to help you connect with academia and industry professionals in Pakistan.',
  'What is BridgeIT?': 'BridgeIT is a collaborative platform designed to bridge the gap between academia and industry in Pakistan. It connects students, faculty, and industry professionals through real-world projects and mentorship opportunities.',
  'How does BridgeIT work?': 'BridgeIT allows students to find industry-relevant projects, faculty to guide projects with real-world applications, and professionals to post and collaborate on projects. Would you like help getting started?',
  'What can I do on this platform?': 'On BridgeIT, you can explore industry projects, connect with mentors, and collaborate on real-world solutions. Whether you\'re a student, faculty member, or industry professional, the platform has resources for you.',
  'Is BridgeIT free to use?': 'Yes, BridgeIT is free for students and faculty to explore projects and find mentors. Industry professionals may use certain premium features based on the project scope.',
  'How can I find projects?': 'You can browse industry projects by using filters like technology, industry, or required skills. Simply visit the "Projects" section to get started.',
  'What kinds of projects are available?': 'BridgeIT offers projects across various disciplines, including Computer Science, Engineering, Design, and more. You can filter projects based on your interests.',
  'Can I post a project?': 'Industry professionals and faculty members can post projects on BridgeIT. You can specify project details, required skills, budget, and deadlines.',
  'How do I apply for a project?': 'Students can apply for projects by browsing through available listings and submitting their profile and proposal for consideration.',
  'What is the success rate for projects on BridgeIT?': 'Many projects have led to internships, job offers, and successful collaborations between students and industry professionals. Would you like to see some success stories?',
  'How can faculty members use BridgeIT?': 'Faculty members can create profiles, collaborate with industry professionals, and guide students on real-world projects. You can also stay updated on industry trends through the platform.',
  'Can I list projects as a faculty member?': 'Yes, faculty members can list projects, connect with industry professionals, and guide students on final-year projects that align with real-world needs.',
  'How can faculty members collaborate with industry professionals?': 'Faculty members can connect with industry professionals by collaborating on listed projects, sharing expertise, and contributing to industry-academia partnerships.',
  'Who are youu?': 'I am the BridgeIT chatbot.',
};

const ChatPage: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [userInput, setUserInput] = useState("");

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };
  const send_prompt = async (prompt: string): Promise<string> => {
    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: prompt,  // sending the prompt as "question"
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data.answer.trim();  // assuming the API returns an object with "answer" field
    } catch (error) {
      console.error("Error:", error);
      return "Failed to get a response from the server";
    }
  };
  

  // Function to handle sending user input and receiving the AI response
  const handleUserInput = async () => {
    if (!userInput.trim()) return;

    const answer = await send_prompt(userInput);
    console.log(answer);
    setUserInput('');

    // Add user input to chat history
    setMessages((prev) => [...prev, { sender: "user", text: userInput }]);

    setMessages((prev) => [...prev, { sender: "ai", text: answer }]);

    // Clear input field
    setUserInput("");
  };

  return (
    <div className="relative h-screen bg-gray-100">
      {/* Floating Action Button */}
      <button
        className="fixed bottom-5 right-5 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition"
        onClick={toggleChat}
      >
        Chatbot
      </button>

      {/* Chat Modal */}
      {isChatOpen && (
        <div className="fixed bottom-20 right-5 w-80 h-96 bg-white rounded-lg shadow-lg flex flex-col">
          <div className="bg-blue-500 text-white flex justify-between items-center p-3 rounded-t-lg">
            <h3 className="text-lg">Chat with us</h3>
            <button onClick={toggleChat} className="text-white font-bold">
              &#10005;
            </button>
          </div>
          <div className="p-4 flex-grow overflow-y-auto">
            {/* Chat messages */}
            {messages.map((msg, index) => (
              <div key={index} className={msg.sender === "user" ? "text-right" : "text-left"}>
                <p className={`p-2 my-2 ${msg.sender === "user" ? "bg-blue-200" : "bg-gray-200"} rounded-lg inline-block`}>
                  {msg.text}
                </p>
              </div>
            ))}
          </div>
          {/* Input Field */}
          <div className="p-3 border-t ">
            <div className = "flex items-center space-x-2">
              <input
                type="text"
                className="w-full p-2 border rounded-lg"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => (e.key === "Enter" ? handleUserInput() : null)}
                placeholder="Type a message..."
              />
              <button 
              className = "group px-4 py-2 bg-gradient-to-r from-blue-700 to-blue-800 text-white font-medium rounded-full shadow-lg hover:shadow-blue-600/50 transition duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" 
              onClick={() => handleUserInput()}
              >
                  <IoMdSend />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
