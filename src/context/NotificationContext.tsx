"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Notification = {
  message: string
  type: "success" | "error"
  id: number
}

type NotificationContextType = {
  notify: (message: string, type?: "success" | "error") => void
}

const NotificationContext = createContext<NotificationContextType | null>(null)

let nextId = 0

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const notify = (message: string, type: "success" | "error" = "success") => {
    const id = nextId++
    setNotifications((prev) => [...prev, { message, type, id }])
  }

  const remove = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center pointer-events-none">
        {notifications.map((n) => (
          <Toast key={n.id} notification={n} onRemove={remove} />
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

function Toast({ notification, onRemove }: { notification: Notification; onRemove: (id: number) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(notification.id), 2500)
    return () => clearTimeout(timer)
  }, [notification.id, onRemove])

  const bg = notification.type === "success" ? "bg-green-600" : "bg-red-600"

  return (
    <div
      className={`${bg} text-white px-6 py-3 rounded-xl shadow-lg text-sm animate-fade-in pointer-events-auto`}
    >
      {notification.message}
    </div>
  )
}

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) throw new Error("useNotification must be used within NotificationProvider")
  return context
}
