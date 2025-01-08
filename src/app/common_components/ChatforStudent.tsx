"use client";

import React, { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";

interface ChatForStudentProps {
  studentId: string; // Current student's userId
  expertId: string;  // Expert's userId
  expertName?: string; // Optional: Expert's name
}

interface Message {
  id?: string;
  senderId: string;
  recipientId: string;
  content: string;
  timeSent: string;
}

const ChatForStudent: React.FC<ChatForStudentProps> = ({ studentId, expertId, expertName }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [showChat, setShowChat] = useState(false); // Toggle chat modal
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Establish SignalR connection
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      console.error("No JWT token found in localStorage.");
      return;
    }

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:7053/chathub?userId=${studentId}`, { // Pass studentId in query string
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    setConnection(newConnection);

    return () => {
      if (newConnection) newConnection.stop().catch(console.error);
    };
  }, [studentId, expertId]);

  // Start SignalR connection and set up listeners
  useEffect(() => {
    if (!connection) return;

    connection
      .start()
      .then(() => {
        console.log("SignalR connected for student.");
      
        connection.on("ReceiveMessage", (senderId: string, message: string, timeSent: string) => {
          const newMessage: Message = {
            senderId,
            recipientId: studentId,
            content: message,
            timeSent,
          };
          setMessages((prev) => [...prev, newMessage]);
        });
      })
      .catch((error) => console.error("SignalR connection failed:", error));

    return () => {
      connection.stop().catch(console.error);
    };
  }, [connection, studentId, expertId]);

  // Fetch message history
  useEffect(() => {
    const fetchMessages = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) return;

      try {
        const response = await fetch(
          `https://localhost:7053/api/chats/message-history/${studentId}/${expertId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.ok) {
          const data: Message[] = await response.json();
          setMessages(data);
        } else {
          console.error("Failed to fetch message history");
        }
      } catch (error) {
        console.error("Error fetching message history:", error);
      }
    };

    fetchMessages();
  }, [studentId, expertId]);

  // Scroll to the latest message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Send a new message
  const sendMessage = async () => {
    if (!newMsg.trim() || !connection) return;

    const token = localStorage.getItem("jwtToken");
    if (!token) return;

    try {
      const timeSent = new Date().toISOString();
      await connection.invoke("SendMessageToUser", expertId, studentId, newMsg, timeSent);
      const newMessage: Message = {
        senderId: studentId,
        recipientId: expertId,
        content: newMsg,
        timeSent,
      };
      setMessages((prev) => [...prev, newMessage]);
      setNewMsg("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div>
      {/* Floating Action Button */}
      <button
        onClick={() => setShowChat(true)}
        className="fixed bottom-6 right-6 bg-green-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-green-500 transition z-50"
        title="Open Chat"
      >
        💬
      </button>

      {/* Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex justify-center items-center z-50">
          <div className="bg-gray-800 w-full max-w-lg rounded-lg shadow-lg">
            {/* Modal Header */}
            <div className="flex items-center justify-between bg-gray-700 p-4 rounded-t-lg">
              <h2 className="text-xl font-bold text-green-400">
                Chat with {expertName || "Expert"}
              </h2>
              <button
                onClick={() => setShowChat(false)}
                className="text-gray-300 hover:text-white transition"
              >
                ✖
              </button>
            </div>

            {/* Chat Messages */}
            <div
              ref={chatContainerRef}
              className="p-4 h-64 overflow-y-auto bg-gray-900 rounded-b-lg"
            >
              {messages.map((msg, index) => {
                const isSelf = msg.senderId === studentId;
                const formattedDate =
                  msg.timeSent && !isNaN(new Date(msg.timeSent).getTime())
                    ? new Date(msg.timeSent).toLocaleString()
                    : "";

                return (
                  <div
                    key={index}
                    className={`mb-2 flex ${
                      isSelf ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg max-w-xs ${
                        isSelf
                          ? "bg-green-600 text-white"
                          : "bg-gray-700 text-white"
                      }`}
                    >
                      <p>{msg.content}</p>
                      {formattedDate && (
                        <div className="text-xs text-gray-300 mt-1">
                          {formattedDate}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chat Input */}
            <div className="flex gap-2 p-4 bg-gray-800 rounded-b-lg">
              <input
                type="text"
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow p-2 rounded bg-gray-700 text-white"
              />
              <button
                onClick={sendMessage}
                className="bg-green-600 px-4 py-2 rounded text-white hover:bg-green-500 transition"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatForStudent;