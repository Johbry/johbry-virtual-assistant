'use client';

import { useEffect, useRef, useState } from 'react';

interface Message {
  text: string;
  sender: 'user' | 'agent';
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  // Colores exactos del diseño original
  const colors = {
    gradientStart: '#667eea',
    gradientEnd: '#764ba2',
    messagesBg: '#f8f9fa',
    userMsgBg: '#667eea',
    agentMsgBg: '#ffffff',
    agentMsgBorder: '#e0e0e0',
    agentMsgText: '#333333',
  };

  // Scroll al último mensaje
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Verificar conexión con servidor
  const checkServerStatus = async () => {
    try {
      const response = await fetch('/api/chat', { method: 'GET' });
      if (!response.ok) {
        console.warn('⚠️ API no responde');
      }
    } catch {
      console.warn('⚠️ No se puede conectar a la API');
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    checkServerStatus();
  }, []);

  const processMarkdown = (text: string): string => {
    // Escapar HTML
    text = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

    // Negritas
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #667eea; font-weight: 600;">$1</strong>');

    // Código inline
    text = text.replace(/`(.*?)`/g, '<code style="background-color: #f0f0f0; padding: 2px 6px; border-radius: 3px; font-family: \'Courier New\', monospace; font-size: 12px;">$1</code>');

    // Enlaces
    text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" style="color: #667eea; text-decoration: underline;">$1</a>');

    // Saltos de línea
    text = text.replace(/\n/g, '<br />');

    return text;
  };

  const handleSendMessage = async () => {
    const query = inputValue.trim();
    if (!query) return;

    // Agregar mensaje del usuario
    setMessages(prev => [...prev, { text: query, sender: 'user' }]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: query }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.reply) {
        setMessages(prev => [...prev, { text: data.reply, sender: 'agent' }]);
      } else if (data.error) {
        setMessages(prev => [...prev, { text: `❌ Error: ${data.error}`, sender: 'agent' }]);
      } else {
        setMessages(prev => [...prev, { text: '⚠️ No recibí una respuesta válida. Intenta nuevamente.', sender: 'agent' }]);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMsg = error instanceof Error && error.message.includes('fetch')
        ? '❌ No puedo conectar con la API. Intenta nuevamente.'
        : '❌ Algo salió mal. Intenta nuevamente.';
      setMessages(prev => [...prev, { text: errorMsg, sender: 'agent' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <div
      className="flex items-center justify-center min-h-screen p-5"
      style={{
        background: `linear-gradient(135deg, ${colors.gradientStart} 0%, ${colors.gradientEnd} 100%)`
      }}
    >
      {/* Chat Container */}
      <div className="flex flex-col w-full max-w-2xl h-screen bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div
          className="text-white p-5 text-center"
          style={{
            background: `linear-gradient(135deg, ${colors.gradientStart} 0%, ${colors.gradientEnd} 100%)`
          }}
        >
          <h1 className="text-2xl font-bold mb-1">🤖 Agente Virtual</h1>
          <p className="text-sm opacity-90">Johbry Mellado - QA Automation Engineer</p>
        </div>

        {/* Messages Area */}
        <div
          ref={chatMessagesRef}
          className="flex-1 overflow-y-auto p-5 flex flex-col gap-3"
          style={{ backgroundColor: colors.messagesBg }}
        >
          {!hasMessages ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-600 px-5">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">¡Hola! 👋</h2>
              <p className="text-sm mb-3">Soy el agente virtual de Johbry. Puedo responderte preguntas sobre:</p>
              <ul className="text-sm space-y-1 mb-4">
                <li>→ Experiencia profesional y skills técnicos</li>
                <li>→ Herramientas de QA y automatización</li>
                <li>→ Certificaciones y educación</li>
                <li>→ Disponibilidad para nuevas oportunidades</li>
              </ul>
              <p className="text-xs text-gray-400">Escribe tu pregunta abajo para comenzar</p>
            </div>
          ) : (
            <>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2 animate-in fade-in slide-in-from-bottom-2 ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className="max-w-xs lg:max-w-md px-4 py-3 rounded-xl"
                    style={{
                      backgroundColor: msg.sender === 'user' ? colors.userMsgBg : colors.agentMsgBg,
                      color: msg.sender === 'user' ? 'white' : colors.agentMsgText,
                      border: msg.sender === 'user' ? 'none' : `1px solid ${colors.agentMsgBorder}`,
                      borderBottomRightRadius: msg.sender === 'user' ? '4px' : '12px',
                      borderBottomLeftRadius: msg.sender === 'user' ? '12px' : '4px',
                    }}
                    dangerouslySetInnerHTML={{ __html: processMarkdown(msg.text) }}
                  />
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2 justify-start">
                  <div
                    className="px-4 py-3 rounded-xl text-sm italic animate-pulse"
                    style={{
                      backgroundColor: colors.agentMsgBg,
                      color: '#999999',
                      border: `1px solid ${colors.agentMsgBorder}`,
                      borderBottomLeftRadius: '4px',
                    }}
                  >
                    ✍️ El agente está escribiendo...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t bg-white p-3 flex gap-2" style={{ borderTopColor: '#e0e0e0' }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Pregunta algo sobre Johbry..."
            disabled={isLoading}
            className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent disabled:opacity-50 transition-colors"
            style={{
              borderColor: '#dddddd',
              color: '#333333',
              '--tw-ring-color': colors.gradientStart,
            } as React.CSSProperties}
            autoFocus
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="text-white px-5 py-2 rounded-lg font-semibold text-sm transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: `linear-gradient(135deg, ${colors.gradientStart} 0%, ${colors.gradientEnd} 100%)`,
            }}
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
