"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Leaf } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/hooks/use-toast"
// Update the imports to include Alert and AlertDescription
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function SignInPage() {
  // Update the state variables to include unconfirmed email state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isResendingEmail, setIsResendingEmail] = useState(false)
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string | null>(null)
  const { signIn, continueAsGuest, resendConfirmationEmail } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // Update the handleSignIn function to handle unconfirmed emails
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage("")
    setUnconfirmedEmail(null)

    try {
      const { error, isUnconfirmedEmail, email: unconfirmedEmailValue } = await signIn(email, password)

      if (error) {
        console.error("Sign in error:", error)

        if (isUnconfirmedEmail && unconfirmedEmailValue) {
          setUnconfirmedEmail(unconfirmedEmailValue)
        } else {
          setErrorMessage(error.message || "Failed to sign in. Please check your credentials.")
        }
        return
      }

      toast({
        title: "Success",
        description: "You have been signed in successfully",
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Unexpected error:", error)
      setErrorMessage("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Add a function to handle resending confirmation email
  const handleResendConfirmation = async () => {
    if (!unconfirmedEmail) return

    setIsResendingEmail(true)

    try {
      const { error } = await resendConfirmationEmail(unconfirmedEmail)

      if (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to resend confirmation email",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Email Sent",
        description: "Confirmation email has been resent. Please check your inbox.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsResendingEmail(false)
    }
  }

  const handleGuestAccess = () => {
    continueAsGuest()
    toast({
      title: "Guest Access",
      description: "You are now browsing as a guest",
    })
    router.push("/")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <Leaf className="h-6 w-6 text-emerald-500" />
        <span className="text-xl font-bold">EcoTrack</span>
      </Link>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>Enter your email and password to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSignIn}>
          {/* Update the CardContent section to include the unconfirmed email alert */}
          <CardContent className="space-y-4">
            {errorMessage && (
              <Alert variant="destructive">
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            {unconfirmedEmail && (
              <Alert variant="warning" className="bg-amber-50 text-amber-800 border-amber-200">
                <AlertTitle>Email Not Confirmed</AlertTitle>
                <AlertDescription className="mt-2">
                  Your email address has not been confirmed yet. Please check your inbox for a confirmation email.
                  <div className="mt-2">
                    <Button variant="outline" size="sm" onClick={handleResendConfirmation} disabled={isResendingEmail}>
                      {isResendingEmail ? "Sending..." : "Resend Confirmation Email"}
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-emerald-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
            <Button type="button" variant="outline" className="w-full" onClick={handleGuestAccess}>
              Continue as Guest
            </Button>
            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link href="/signup" className="text-emerald-600 hover:underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
