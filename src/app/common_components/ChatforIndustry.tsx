"use client";

import React, { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";

interface Message {
  id?: string;
  senderId: string;
  recipientId: string;
  content: string;
  timeSent: string;
}

interface ChatForIndustryProps {
  expertId: string; // Industry expert's ID
  studentId: string; // Student's ID
}

const ChatForIndustry: React.FC<ChatForIndustryProps> = ({ expertId, studentId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Establish SignalR connection
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      console.error("No JWT token found in localStorage.");
      return;
    }

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:7053/chathub?userId=${expertId}`, { // Pass expertId in query string
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    setConnection(newConnection);

    return () => {
      if (newConnection) newConnection.stop().catch((err) => console.error("Error stopping SignalR connection:", err));
    };
  }, [expertId, studentId]);

  // Start SignalR connection and set up listeners
  useEffect(() => {
    if (!connection) return;

    connection
      .start()
      .then(() => {
        console.log("SignalR connected for industry.");
      
        connection.on("ReceiveMessage", (senderId: string, message: string, timeSent: string) => {
          const newMessage: Message = {
            senderId,
            recipientId: expertId,
            content: message,
            timeSent,
          };
          setMessages((prev) => [...prev, newMessage]);
        });
      })
      .catch((error) => console.error("SignalR connection failed:", error));

    return () => {
      connection.stop().catch((err) => console.error("Error stopping SignalR connection:", err));
    };
  }, [connection, expertId, studentId]);

  // Fetch message history
  useEffect(() => {
    const fetchMessages = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) return;

      try {
        const response = await fetch(
          `https://localhost:7053/api/chats/message-history/${studentId}/${expertId}`,
          { headers: { Authorization: `Bearer ${token}` } }
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
  }, [expertId, studentId]);

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
      await connection.invoke("SendMessageToUser", studentId, expertId, newMsg, timeSent);
      const newMessage: Message = {
        senderId: expertId,
        recipientId: studentId,
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
    <div className="bg-gray-800 p-4 rounded shadow-md">
      <h2 className="text-lg font-bold text-green-400 mb-2">Industry Chat</h2>
      <div ref={chatContainerRef} className="mb-4 h-64 overflow-y-auto bg-gray-900 p-4 rounded">
        {messages.map((msg, index) => {
          const isSelf = msg.senderId === expertId;
          const formattedDate =
            msg.timeSent && !isNaN(new Date(msg.timeSent).getTime())
              ? new Date(msg.timeSent).toLocaleString()
              : "";

          return (
            <div
              key={index}
              className={`mb-2 flex ${isSelf ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-2 rounded-lg max-w-xs ${
                  isSelf ? "bg-green-600 text-white" : "bg-gray-700 text-white"
                }`}
              >
                <p>{msg.content}</p>
                {formattedDate && <div className="text-xs text-gray-300 mt-1">{formattedDate}</div>}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow p-2 rounded bg-gray-700 text-white"
        />
        <button onClick={sendMessage} className="bg-blue-600 px-4 py-2 rounded text-white">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatForIndustry;