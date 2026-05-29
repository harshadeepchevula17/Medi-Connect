import { useEffect, useRef, useState, useCallback } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

export function useWebSocket(topic, onMessage) {
  const clientRef = useRef(null)
  const [connected, setConnected] = useState(false)
  const subsRef = useRef(new Map())
  const onMessageRef = useRef(onMessage)
  onMessageRef.current = onMessage

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('/ws'),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        setConnected(true)
        if (topic) {
          const sub = client.subscribe(topic, (message) => {
            try {
              const data = JSON.parse(message.body)
              onMessageRef.current?.(data)
            } catch {
              onMessageRef.current?.(message.body)
            }
          })
          subsRef.current.set(topic, sub)
        }
      },
      onDisconnect: () => {
        setConnected(false)
      },
      onStompError: (error) => {
        console.error('STOMP error:', error)
        setConnected(false)
      },
    })

    client.activate()
    clientRef.current = client

    return () => {
      client.deactivate()
    }
  }, [topic])

  const subscribe = useCallback((t, handler) => {
    const client = clientRef.current
    if (!client?.connected) return () => {}
    const sub = client.subscribe(t, (message) => {
      try {
        const data = JSON.parse(message.body)
        handler(data)
      } catch {
        handler(message.body)
      }
    })
    subsRef.current.set(t, sub)
    return () => sub.unsubscribe()
  }, [])

  const send = useCallback((destination, body) => {
    if (clientRef.current?.connected) {
      clientRef.current.publish({
        destination,
        body: typeof body === 'string' ? body : JSON.stringify(body),
      })
      return true
    }
    return false
  }, [])

  return { connected, send, subscribe }
}
