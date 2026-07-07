import React, { useState } from "react";
import axios from "axios";

const ChatAI = () => {

  const [input, setInput] = useState("");

  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {

    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);

    setLoading(true);

    try {

      const res = await axios.post(
        "https://backend-6z41.onrender.com",
        {
          message: input,
        }
      );

      const aiMessage = {
        sender: "ai",
        text: res.data.reply || "No response from AI",
      };

      setMessages((prev) => [...prev, aiMessage]);

      setInput("");

    } catch (error) {

      console.log(error);

      const errorMessage = {
        sender: "ai",
        text: "Something went wrong. Please try again.",
      };

      setMessages((prev) => [...prev, errorMessage]);

    }

    setLoading(false);

  };

  return (

    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden">

        {/* HEADER */}

        <div className="bg-blue-600 text-white p-5">

          <h1 className="text-3xl font-bold">
            AI Doctor Assistant
          </h1>

          <p className="text-sm mt-1 text-blue-100">
            Ask about symptoms, health tips, or medical guidance
          </p>

        </div>

        {/* CHAT AREA */}

        <div className="h-[500px] overflow-y-auto p-5 bg-gray-50">

          {
            messages.length === 0 && (

              <div className="text-center text-gray-400 mt-20">

                <h2 className="text-xl font-semibold">
                  Start chatting with AI Doctor
                </h2>

                <p className="mt-2">
                  Example: "I have fever and headache"
                </p>

              </div>

            )
          }

          {
            messages.map((msg, index) => (

              <div
                key={index}
                className={`mb-4 flex ${
                  msg.sender === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                <div
  className={`max-w-[75%] px-4 py-3 rounded-2xl shadow ${
    msg.sender === "user"
      ? "bg-blue-500 text-white"
      : "bg-white text-gray-800 border"
  }`}
>

                  {msg.text}

                </div>

              </div>

            ))
          }

          {
            loading && (

              <div className="flex justify-start mb-4">

                <div className="bg-white border px-4 py-3 rounded-2xl shadow text-gray-500">

                  AI is typing...

                </div>

              </div>

            )
          }

        </div>

        {/* INPUT AREA */}

        <div className="p-4 border-t bg-white flex gap-3">

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your symptoms..."
            className="flex-1 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />

          <button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl transition"
          >

            Send

          </button>

        </div>

        {/* FOOTER WARNING */}

        <div className="bg-red-50 text-red-500 text-sm p-3 text-center border-t">

          ⚠️ AI advice is informational only. Please consult a licensed doctor for medical emergencies.

        </div>

      </div>

    </div>

  );

};

export default ChatAI;