import { useState, useCallback, useRef, useEffect } from "react"
import { sendChatMessage } from "../../../services/chat.service"
import { useUserContext } from "../../../hooks/useUserContext"
import { wakeBackend } from "../../../services/api"

/**
 * useMentor Hook - Manages Zenith AI Mentor conversation state
 *
 * Features:
 * - Maintains full conversation history for context-aware responses
 * - Sends history to backend for Agentic RAG processing
 * - Handles typing indicators and error states
 * - Detects sentiment for avatar mood
 */
export const useMentor = () => {
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const { context: userContext } = useUserContext()
  const messagesRef = useRef([])

  // Pre-wake backend when Mentor UI mounts to reduce cold-start failures on first message (Render.com)
  useEffect(() => { wakeBackend(); }, [])

  /**
   * Convert internal messages to API format
   * Internal: { id, role, text, ... }
   * API: { role, content }
   */
  const formatHistoryForAPI = useCallback((msgs) => {
    return msgs
      .filter(msg => msg.role === "user" || msg.role === "bot")
      .map(msg => ({
        role: msg.role === "bot" ? "assistant" : "user",
        content: msg.text
      }))
  }, [])

  const sendMessage = useCallback(
    async (userMessage) => {
      if (!userMessage.trim()) return

      // Add user message to state
      const newUserMessage = {
        id: Date.now(),
        role: "user",
        text: userMessage,
        timestamp: new Date(),
      }

      // Update messages state and ref
      setMessages((prev) => {
        const updatedMessages = [...prev, newUserMessage]
        messagesRef.current = updatedMessages
        return updatedMessages
      })

      // Start typing indicator
      setIsTyping(true)

      // Prepare context from UserContext (moved outside try for retry access)
      const requestContext = {
        rank: userContext?.rank,
        category: userContext?.category,
        homeState: userContext?.homeState,
        branches: userContext?.branches,
      }

      try {

        // Format full conversation history for API (including the new message)
        const allMessages = [...messagesRef.current]
        const history = formatHistoryForAPI(allMessages)

        // Call backend with full history for Agentic RAG
        const response = await sendChatMessage(null, requestContext, history)

        // Detect sentiment from AI response for avatar mood
        const sentiment = detectSentiment(response.reply, userMessage)

        // Create bot message with backend response
        const botMessage = {
          id: Date.now() + 1,
          role: "bot",
          text: response.reply,
          cards: response.cards || [],
          followUp: response.followUp,
          actionCard: response.actionCard, // Add action card for Zenith UI
          timestamp: new Date(),
          sentiment: sentiment,
        }

        setMessages((prev) => {
          const updated = [...prev, botMessage]
          messagesRef.current = updated
          return updated
        })
      } catch (error) {
        // Check if this is a network error or API error
        const isNetworkError = !error.response
        const is500Error = error.response?.status === 500
        if (isNetworkError || is500Error) {
          console.warn("AI Mentor: first request failed (retrying):", error?.message || error);
        } else {
          console.error("AI Mentor Error:", error);
        }

        // Friendly error message with auto-retry logic
        const errorMessage = {
          id: Date.now() + 1,
          role: "bot",
          text: isNetworkError 
            ? "🌐 Hmm, my mentor-brain is having trouble reaching the network. Let me try to reconnect for you..."
            : is500Error
            ? "🔄 My mentor-brain encountered something unexpected. Give me a moment to recalibrate..."
            : "💙 I'm having a bit of trouble connecting right now. Could you try asking that again? I promise I'm here to help!",
          cards: [],
          timestamp: new Date(),
          sentiment: "empathetic",
          isRetrying: isNetworkError || is500Error
        }

        setMessages((prev) => {
          const updated = [...prev, errorMessage]
          messagesRef.current = updated
          return updated
        })

        // Auto-retry logic for network errors (max 2 retries)
        if (isNetworkError || is500Error) {
          const retryDelayMs = isNetworkError ? 5000 : 2000; // 5s for cold start/network, 2s for 5xx
          const doRetry = () => {
            const history = formatHistoryForAPI(messagesRef.current);
            return sendChatMessage(null, requestContext, history);
          };
          const onRetrySuccess = (retryResponse) => {
            const retryBotMessage = {
              id: Date.now() + 2,
              role: "bot",
              text: "✨ Got it! " + retryResponse.reply,
              cards: retryResponse.cards || [],
              followUp: retryResponse.followUp,
              actionCard: retryResponse.actionCard,
              timestamp: new Date(),
              sentiment: detectSentiment(retryResponse.reply, userMessage),
            };
            setMessages((prev) => {
              const withoutRetry = prev.filter(m => !m.isRetrying);
              const updated = [...withoutRetry, retryBotMessage];
              messagesRef.current = updated;
              return updated;
            });
          };
          const onRetryFailure = () => {
            setMessages((prev) => {
              const updated = prev.map(m =>
                m.isRetrying
                  ? { ...m, text: "😔 I tried reconnecting, but it's not working right now. Could you check your internet connection and try again? I'm still here when you're ready!", isRetrying: false }
                  : m
              );
              messagesRef.current = updated;
              return updated;
            });
          };
          setTimeout(async () => {
            try {
              console.log("🔄 Auto-retrying request...");
              const retryResponse = await doRetry();
              onRetrySuccess(retryResponse);
            } catch (retryError) {
              const retryIsNetwork = !retryError?.response;
              if (retryIsNetwork && isNetworkError) {
                // Second retry after 10s for cold start
                console.log("🔄 Second retry in 10s...");
                setTimeout(async () => {
                  try {
                    const r2 = await doRetry();
                    onRetrySuccess(r2);
                  } catch (e2) {
                    console.error("Second retry failed:", e2);
                    onRetryFailure();
                  }
                }, 10000);
              } else {
                console.error("Retry failed:", retryError);
                onRetryFailure();
              }
            }
          }, retryDelayMs);
        }
      } finally {
        setIsTyping(false)
      }
    },
    [userContext, formatHistoryForAPI]
  )

  /**
   * Clear conversation history
   */
  const clearMessages = useCallback(() => {
    setMessages([])
    messagesRef.current = []
  }, [])

  return {
    messages,
    isTyping,
    sendMessage,
    clearMessages,
  }
}

/**
 * Detect sentiment from AI response and user message for avatar mood
 */
const detectSentiment = (aiReply, userMessage) => {
  const userText = userMessage.toLowerCase()
  const aiText = aiReply.toLowerCase()

  // User sentiment analysis
  const confusedKeywords = ["confused", "don't know", "unsure", "help", "lost", "worried", "scared"]
  const happyKeywords = ["excited", "happy", "great", "thanks", "thank you"]

  const userConfused = confusedKeywords.some((k) => userText.includes(k))
  const userHappy = happyKeywords.some((k) => userText.includes(k))

  // AI response type detection
  const isHelpful = aiText.includes("here are") || aiText.includes("based on") || aiText.includes("found")
  const isEmpathetic = aiText.includes("understand") || aiText.includes("help you")
  const isPositive = aiText.includes("great") || aiText.includes("excellent") || aiText.includes("eligible")
  const isAsking = aiText.includes("what's your rank") || aiText.includes("tell me") || aiText.includes("could you")

  // Sentiment priority
  if (userConfused) return "empathetic"
  if (userHappy || isPositive) return "happy"
  if (isAsking) return "curious"
  if (isHelpful) return "helpful"
  if (isEmpathetic) return "empathetic"

  return "calm"
}

export default useMentor
