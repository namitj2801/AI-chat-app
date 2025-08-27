"use client";
import { Button } from "./components/ui/button";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight"; // for code syntax highlighting
import "highlight.js/styles/github.css"; // pick any theme

export default function Home() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [streaming, setStreaming] = useState("");
  const [loading, setLoading] = useState("");
  const [streamReponse, setStreamResponse] = useState("");

  const handleChat = async () => {
    setLoading(true);
    setResponse("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      setResponse("Error: " + error.message);
    }

    setLoading(false);
  };

  const handleStreamChat = async () => {
    setStreaming(true);
    setStreamResponse("");

    try {
      const res = await fetch("/api/chat-stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const reader = res.body.getReader();

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value);

        // const lines = chunk.split("\n");

        // for(const line of lines) {
        //   if(line.startsWith)
        // }

        setStreamResponse((prev) => prev + chunk);
      }
    } catch (error) {
      setStreamResponse("Error: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1>AI CHAT APP using NEXTjs</h1>
      <div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your awesome message"
          rows={4}
          // style={{ width: "100%", marginBottom: "10px" }}
          className="w-full mb-10 border"
        />
        <div>
          <Button
            className="px-4 py-2 bg-orange-400 border rounded-md cursor-pointer"
            variant="secondary"
            onClick={handleChat}
          >
            {loading ? "Loading..." : "Chat"}
          </Button>
          <Button
            className="px-4 py-2 bg-orange-400 border rounded-md cursor-pointer m-3"
            variant="secondary"
            onClick={handleStreamChat}
          >
            {loading ? "Loading..." : "Stream Chat"}
          </Button>
        </div>
        <div className="border p-4 whitespace-pre-wrap mt-10 text-xl">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {response}
          </ReactMarkdown>
        </div>
        <div className="border p-4 whitespace-pre-wrap mt-10 text-xl">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {streamReponse}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
