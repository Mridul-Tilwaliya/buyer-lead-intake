// app/auth/login/page.tsx - MISSING
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Check your email for the login link!')
    }
    setLoading(false)
  }

  return (    
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-center">Sign in to Buyer Leads</h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Enter your email to receive a magic link
          </p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Sending...' : 'Send Magic Link'}
          </Button>
        </form>
        {message && <p className="text-center text-sm">{message}</p>}
        
        {/* Demo login for testing */}
        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={() => setEmail('demo@example.com')}
          >
            Use Demo Email
          </Button>
        </div>
      </div>
    </div>
  )
}