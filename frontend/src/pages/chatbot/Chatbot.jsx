import "./chatbot.css";
import Navbar from "../../components/navbar/Navbar";
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from "../../components/AuthContext";

const Chatbot = () => {

  const authData = useContext(AuthContext);
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chatMessages');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const updatedMessages = [...messages, { sender: 'user', text: input }];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/chatbot', {
        message: input,
        user_id: authData.user.user_id
      }, {withCredentials: true});

      const reply = response.data.reply || 'Nu am găsit un răspuns.';
      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { sender: 'bot', text: 'Eroare la server.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="chatbot-container">
        <div className="chatbot-card">
          <h2>Ciprian Assistant</h2>
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${msg.sender === 'user' ? 'user' : 'bot'}`}
              >
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            ))}
            {loading && <div className="chat-message bot">Ciprian is thinking...</div>}
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Write something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage}>Trimite</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
