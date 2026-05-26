'use client';

import { useEffect, useRef, useState } from 'react';
import CVPanel from '@/components/CVPanel';
import { colors } from '@/lib/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

interface Message {
  text: string;
  sender: 'user' | 'agent';
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCVPanel, setShowCVPanel] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);

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

    // Negritas con color primario
    text = text.replace(
      /\*\*(.*?)\*\*/g,
      `<strong style="color: ${colors.primary.teal}; font-weight: 600;">$1</strong>`
    );

    // Código inline
    text = text.replace(
      /`(.*?)`/g,
      `<code style="background-color: ${colors.neutral.gray100}; padding: 2px 6px; border-radius: 3px; font-family: 'Courier New', monospace; font-size: 12px; color: ${colors.primary.teal};">$1</code>`
    );

    // Enlaces
    text = text.replace(
      /\[(.*?)\]\((.*?)\)/g,
      `<a href="$2" target="_blank" style="color: ${colors.primary.teal}; text-decoration: underline;">$1</a>`
    );

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

    // Verificar si el chat está habilitado
    const chatEnabled = process.env.NEXT_PUBLIC_CHAT_ENABLE !== 'false';

    if (!chatEnabled) {
      setMessages(prev => [...prev, {
        text: 'Lo siento, el chat se encuentra disabilitado por alto tráfico en este momento.',
        sender: 'agent'
      }]);
      setIsLoading(false);
      return;
    }

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
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: colors.neutral.gray100 }}
    >
      {/* Columna Izquierda: CV Panel - Desktop */}
      <div
        className="hidden lg:flex w-1/3 border-r shadow-sm flex-col"
        style={{
          borderRightColor: colors.neutral.gray200,
          backgroundColor: colors.neutral.offWhite,
        }}
      >
        <CVPanel />
      </div>

      {/* Overlay CV Panel - Mobile */}
      {showCVPanel && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setShowCVPanel(false)}
        />
      )}

      {/* CV Panel Modal - Mobile */}
      <div
        className={`fixed left-0 top-0 bottom-0 w-2/3 lg:hidden z-50 transform transition-transform duration-300 overflow-y-auto flex flex-col ${
          showCVPanel ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ backgroundColor: colors.neutral.offWhite }}
      >
        <CVPanel />
      </div>

      {/* Columna Derecha: Chat */}
      <div className="flex-1 lg:w-2/3 flex flex-col overflow-hidden">
        {/* Header del Chat */}
        <div
          className="flex-shrink-0 text-white p-5 lg:p-6 shadow-sm flex items-center justify-between lg:justify-start gap-4"
          style={{ background: colors.gradients.primary }}
        >
          {/* Botón hamburguesa - Mobile */}
          <button
            onClick={() => setShowCVPanel(!showCVPanel)}
            className="lg:hidden text-white text-xl hover:opacity-80 transition"
          >
            <FontAwesomeIcon icon={showCVPanel ? faTimes : faBars} className="w-5 h-5" />
          </button>

          <div className="flex-1 lg:text-left text-center">
            <h1 className="text-2xl lg:text-3xl font-bold mb-1">💬 Asistente Virtual</h1>
            <p className="text-sm opacity-90">Pregunta sobre Johbry&apos;s profile, experiencia y habilidades</p>
          </div>
        </div>

        {/* Messages Area */}
        <div
          ref={chatMessagesRef}
          className="flex-1 overflow-y-auto p-4 lg:p-6 flex flex-col gap-4"
          style={{ backgroundColor: colors.neutral.offWhite }}
        >
          {!hasMessages ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-5">
              <div className="text-4xl mb-4">👋</div>
              <h2 className="text-2xl font-bold mb-3" style={{ color: colors.primary.teal }}>
                ¡Hola!
              </h2>
              <p className="mb-4" style={{ color: colors.neutral.gray600 }}>
                Soy el asistente virtual de Johbry. Puedo responderte preguntas sobre:
              </p>
              <ul className="space-y-2 mb-6" style={{ color: colors.neutral.gray600 }}>
                <li>→ Experiencia profesional y skills técnicos</li>
                <li>→ Herramientas de QA y automatización</li>
                <li>→ Certificaciones y educación</li>
                <li>→ Disponibilidad para nuevas oportunidades</li>
              </ul>
              <p className="text-sm" style={{ color: colors.neutral.gray500 }}>
                Escribe tu pregunta abajo para comenzar
              </p>
            </div>
          ) : (
            <>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 animate-in fade-in slide-in-from-bottom-2 ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className="max-w-xs lg:max-w-md px-4 py-3 rounded-xl"
                    style={{
                      backgroundColor: msg.sender === 'user' ? colors.primary.teal : colors.neutral.white,
                      color: msg.sender === 'user' ? 'white' : colors.neutral.gray800,
                      border: msg.sender === 'user' ? 'none' : `1px solid ${colors.neutral.gray200}`,
                      borderBottomRightRadius: msg.sender === 'user' ? '4px' : '12px',
                      borderBottomLeftRadius: msg.sender === 'user' ? '12px' : '4px',
                    }}
                    dangerouslySetInnerHTML={{ __html: processMarkdown(msg.text) }}
                  />
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div
                    className="px-4 py-3 rounded-xl text-sm italic animate-pulse"
                    style={{
                      backgroundColor: colors.neutral.white,
                      color: colors.neutral.gray500,
                      border: `1px solid ${colors.neutral.gray200}`,
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
        <div
          className="flex-shrink-0 border-t p-4 lg:p-6 flex gap-3"
          style={{
            borderTopColor: colors.neutral.gray200,
            backgroundColor: colors.neutral.white,
          }}
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Pregunta algo sobre Johbry..."
            disabled={isLoading}
            className="flex-1 px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent disabled:opacity-50 transition-colors"
            style={{
              borderColor: colors.neutral.gray300,
              color: colors.neutral.gray800,
              backgroundColor: colors.neutral.white,
              '--tw-ring-color': colors.primary.teal,
              '--tw-ring-offset-color': colors.neutral.white,
            } as React.CSSProperties}
            autoFocus
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="text-white px-6 py-2 rounded-lg font-semibold text-sm transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            style={{
              background: colors.gradients.primary,
            }}
          >
            <FontAwesomeIcon icon={faPaperPlane} className="w-4 h-4" />
            <span className="hidden sm:inline">Enviar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
