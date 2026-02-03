import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, Mail, ArrowRight } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <Leaf className="h-6 w-6 text-emerald-500" />
        <span className="text-xl font-bold">EcoTrack</span>
      </Link>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Check Your Email</CardTitle>
          <CardDescription>We've sent you a confirmation email</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center text-center">
          <div className="bg-emerald-100 p-4 rounded-full mb-4">
            <Mail className="h-12 w-12 text-emerald-600" />
          </div>
          <p className="mb-4">
            We've sent a confirmation email to your inbox. Please click the link in the email to verify your account.
          </p>
          <div className="bg-muted p-4 rounded-lg w-full text-left">
            <h3 className="font-medium mb-2">Next steps:</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Check your email inbox</li>
              <li>Click the confirmation link in the email</li>
              <li>Return to EcoTrack and sign in</li>
            </ol>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Link href="/signin" className="w-full">
            <Button variant="outline" className="w-full">
              Return to Sign In
            </Button>
          </Link>
          <Link href="/" className="w-full">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
              Go to Homepage
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
