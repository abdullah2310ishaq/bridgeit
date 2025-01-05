"use client";

import React, { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";

interface ChatSignalRProps {
  studentId: string; // The actual Student userId from DB
  expertId: string;  // The actual Expert’s userId (indExptId) from DB
}

// The shape of each message from your DB
interface Message {
  id?: string;
  senderId: string;
  recipientId: string;
  content: string;
  timeSent: string; // or Date
}

const ChatSignalR: React.FC<ChatSignalRProps> = ({ studentId, expertId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // --------------------------------------------------
  // (A) Create the SignalR connection
  // --------------------------------------------------
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) return;

    // Build the connection to your chat hub (adjust URL as needed)
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7053/chathub", {
        accessTokenFactory: () => token, // if your hub requires auth
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    setConnection(newConnection);
  }, [studentId, expertId]);

  // --------------------------------------------------
  // (B) Start connection & define event handlers
  // --------------------------------------------------
  useEffect(() => {
    if (!connection) return;

    connection
      .start()
      .then(() => {
        console.log("SignalR connected.");

        // Join a group named "chat-<studentId>-<expertId>"
        const groupName = getGroupName(studentId, expertId);
        connection.invoke("JoinGroup", groupName);

        // Listen for new messages from the server hub
        connection.on("ReceiveMessage", (messageJson: any) => {
          // parse the JSON string to a Message object
          const message = JSON.parse(messageJson) as Message;
          setMessages((prev) => [...prev, message]);
        });
      })
      .catch((err) => console.error("SignalR Connection Error:", err));

    // Cleanup if unmount
    return () => {
      connection.stop();
    };
  }, [connection, studentId, expertId]);

  // --------------------------------------------------
  // (C) Fetch existing message history from DB
  // --------------------------------------------------
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) return;

    const fetchHistory = async () => {
      try {
        const res = await fetch(
          `https://localhost:7053/api/chats/message-history/${studentId}/${expertId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      } catch (err) {
        console.error("Error fetching chat history:", err);
      }
    };

    fetchHistory();
  }, [studentId, expertId]);

  // --------------------------------------------------
  // (D) Scroll to bottom on new messages
  // --------------------------------------------------
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // --------------------------------------------------
  // (E) Send a new message
  // --------------------------------------------------
  const sendMessage = async () => {
    if (!newMsg.trim() || !connection) return;
    const token = localStorage.getItem("jwtToken");
    if (!token) return;

    try {
      // 1) Post to your DB endpoint
      const response = await fetch("https://localhost:7053/api/chats/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          StudentId: studentId,
          ExpertId: expertId,
          Message: newMsg,
        }),
      });

      if (!response.ok) {
        console.error("Failed to send message to DB");
        return;
      }

      // 2) Construct a local message for immediate UI
      const now = new Date().toISOString();
      const newLocalMsg: Message = {
        senderId: studentId, // or if you're on the Expert page, the roles might be reversed
        recipientId: expertId,
        content: newMsg,
        timeSent: now,
      };

      // Add to local UI
      setMessages((prev) => [...prev, newLocalMsg]);
      setNewMsg("");

      // 3) Also broadcast it via SignalR
      const groupName = getGroupName(studentId, expertId);
      await connection.invoke("SendMessageToGroup", groupName, JSON.stringify(newLocalMsg));
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // Helper: consistent group name
  function getGroupName(stu: string, exp: string) {
    return `chat-${stu}-${exp}`;
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------
  return (
    <div className="bg-gray-800 p-4 rounded shadow-md">
      <h2 className="text-lg font-bold text-green-400 mb-2">Chat</h2>

      <div ref={chatContainerRef} className="mb-4 h-64 overflow-y-auto bg-gray-900 p-4 rounded">
        {messages.map((msg, i) => {
          const isSelf = msg.senderId === studentId; 
          // If you are *actually* the Student, then msg.senderId === studentId means "self"
          return (
            <div
              key={i}
              className={`mb-2 flex ${isSelf ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-2 rounded-lg max-w-xs ${
                  isSelf
                    ? "bg-green-600 text-white text-right"
                    : "bg-gray-700 text-white text-left"
                }`}
              >
                <p>{msg.content}</p>
                <div className="text-xs text-gray-300 mt-1 flex justify-between">
                  <span>{new Date(msg.timeSent).toLocaleString()}</span>
                  {isSelf && <span className="ml-2">✓✓</span>}
                </div>
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
          className="flex-grow p-2 rounded bg-gray-700 text-white focus:outline-none"
        />
        <button
          onClick={sendMessage}
          className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatSignalR;
