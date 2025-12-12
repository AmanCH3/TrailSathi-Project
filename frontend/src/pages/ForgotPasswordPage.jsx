import React from "react"
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm"

export default function ForgotPasswordPage() {
  return (
    <main className="container flex h-screen flex-col items-center justify-center">
      <div className="mx-auto w-full max-w-sm space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Forgot your password?</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email address and we’ll send you a link to reset your password.
          </p>
        </div>
        <ForgotPasswordForm />
        <p className="text-sm text-muted-foreground">
          Remember your password?{" "}
          <a href="/login" className="underline hover:text-primary">
            Back to login
          </a>
        </p>
      </div>
    </main>
  )
}
