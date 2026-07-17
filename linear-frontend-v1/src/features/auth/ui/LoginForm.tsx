import { TextInput } from '@/shared/ui/TextInput'
import { Button } from '@/shared/ui/Button'
import { ErrorBanner } from '@/shared/ui/ErrorBanner'
import { useLoginForm } from '@/features/auth/hooks/useLoginForm'
import { LogIn } from 'lucide-react'

export function LoginForm() {
  const {
    register,
    handleSubmit,
    errors,
    isLoading,
    error,
  } = useLoginForm()

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Login"
      className="flex flex-col gap-4"
      noValidate
    >
      <TextInput
        type="email"
        label="Email"
        placeholder="you@example.com"
        autoComplete="email"
        error={errors.email?.message}
        disabled={isLoading}
        {...register('email')}
      />

      <TextInput
        type="password"
        label="Password"
        placeholder="Enter your password"
        autoComplete="current-password"
        error={errors.password?.message}
        disabled={isLoading}
        {...register('password')}
      />

      {error && <ErrorBanner message={error} />}

      <Button
        type="submit"
        variant="primary"
        loading={isLoading}
        disabled={isLoading}
        icon={<LogIn className="h-4 w-4" />}
        className="mt-2"
      >
        {isLoading ? 'Logging in...' : 'Log in'}
      </Button>
    </form>
  )
}
