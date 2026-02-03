"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { Session, User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  isGuest: boolean
  signIn: (email: string, password: string) => Promise<{ error: any; isUnconfirmedEmail?: boolean; email?: string }>
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error: any; data: any }>
  signOut: () => Promise<void>
  continueAsGuest: () => void
  resendConfirmationEmail: (email: string) => Promise<{ error: any }>
}

// Create a default context value
const defaultContextValue: AuthContextType = {
  user: null,
  session: null,
  isLoading: true,
  isGuest: false,
  signIn: async () => ({ error: new Error("AuthProvider not initialized") }),
  signUp: async () => ({ error: new Error("AuthProvider not initialized"), data: null }),
  signOut: async () => {},
  continueAsGuest: () => {},
  resendConfirmationEmail: async () => ({ error: new Error("AuthProvider not initialized") }),
}

const AuthContext = createContext<AuthContextType>(defaultContextValue)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGuest, setIsGuest] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Check if user has chosen to continue as guest
    const guestMode = localStorage.getItem("guestMode") === "true"
    setIsGuest(guestMode)

    // Get session from supabase
    const getSession = async () => {
      setIsLoading(true)
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Error getting session:", error)
        }

        setSession(data.session)
        setUser(data.session?.user ?? null)
      } catch (err) {
        console.error("Failed to get session:", err)
      } finally {
        setIsLoading(false)
        setIsInitialized(true)
      }
    }

    getSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        // Check if the error is due to an unconfirmed email
        if (error.message.includes("Email not confirmed")) {
          return {
            error,
            isUnconfirmedEmail: true,
            email,
          }
        }

        console.error("Sign in error:", error.message)
        return { error }
      }

      // If successful, clear guest mode
      if (data.session) {
        localStorage.removeItem("guestMode")
        setIsGuest(false)
      }

      return { error: null }
    } catch (error) {
      console.error("Unexpected sign in error:", error)
      return { error }
    }
  }

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      })

      // If successful, also create a profile in the profiles table
      if (!error && data.user) {
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: data.user.id,
            first_name: firstName,
            last_name: lastName,
            email: email,
          },
        ])

        if (profileError) {
          console.error("Error creating profile:", profileError)
        }
      }

      return { data, error }
    } catch (error) {
      console.error("Unexpected sign up error:", error)
      return { data: null, error }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    // Also clear guest mode if it was set
    localStorage.removeItem("guestMode")
    setIsGuest(false)
  }

  const continueAsGuest = () => {
    localStorage.setItem("guestMode", "true")
    setIsGuest(true)
  }

  const resendConfirmationEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
      })

      return { error }
    } catch (error) {
      console.error("Error resending confirmation email:", error)
      return { error }
    }
  }

  const value = {
    user,
    session,
    isLoading,
    isGuest,
    signIn,
    signUp,
    signOut,
    continueAsGuest,
    resendConfirmationEmail,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  return context
}
