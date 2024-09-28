"use client";

import React, { useEffect, useState } from "react";
import { FaRobot, FaSearch } from "react-icons/fa";

// Interface for FAQ
interface FAQ {
  question: string;
  answer: string;
}

const AiAssistPage: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState<string | null>(null);

  // Fetch FAQs from JSON file
  useEffect(() => {
    const fetchFAQs = async () => {
      const res = await fetch("/faqs.json"); // Adjust the path as needed
      const data: FAQ[] = await res.json();
      setFaqs(data);
    };

    fetchFAQs();
  }, []);

  const handleAsk = () => {
    const formattedQuestion = question.toLowerCase().trim();
    const faq = faqs.find((faq) => faq.question.toLowerCase() === formattedQuestion);
    const answer = faq ? faq.answer : "I'm sorry, I don't have an answer for that. Please ask something else.";
    setResponse(answer);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 to-gray-800 text-gray-300 flex flex-col items-center justify-center p-6">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex items-center justify-center mb-6">
          <FaRobot className="text-5xl text-blue-500" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-4 text-green-400">AI Assistant</h2>
        <p className="text-center mb-4 text-gray-400">
          Ask me anything about the BridgeIT platform!
        </p>

        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type your question..."
          className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-700 text-gray-200 mb-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleAsk}
          className="w-full bg-green-500 text-white p-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
        >
          Ask AI
        </button>

        {response && (
          <div className="mt-6 p-4 bg-gray-700 rounded-lg text-gray-300">
            <h3 className="font-bold text-lg text-blue-400">AI Response:</h3>
            <p>{response}</p>
          </div>
        )}

        {/* List of FAQs */}
        <div className="mt-6">
          <h3 className="font-bold text-lg text-gray-200">Frequently Asked Questions:</h3>
          <ul className="list-disc ml-4 mt-2">
            {faqs.map((faq) => (
              <li
                key={faq.question}
                className="text-gray-400 cursor-pointer hover:text-gray-200"
                onClick={() => {
                  setQuestion(faq.question);
                  handleAsk();
                }}
              >
                <FaSearch className="inline mr-2" />
                {faq.question}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AiAssistPage;
