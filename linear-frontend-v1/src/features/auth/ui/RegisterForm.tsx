import { TextInput } from '@/shared/ui/TextInput'
import { Button } from '@/shared/ui/Button'
import { ErrorBanner } from '@/shared/ui/ErrorBanner'
import { useRegisterForm } from '@/features/auth/hooks/useRegisterForm'
import { UserPlus } from 'lucide-react'

interface RegisterFormProps {
  onSwitchToLogin?: () => void
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    errors,
    isLoading,
    error,
  } = useRegisterForm()

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Register"
      className="flex flex-col gap-4"
      noValidate
    >
      <TextInput
        type="text"
        label="Name"
        placeholder="Your name"
        autoComplete="name"
        error={errors.name?.message}
        disabled={isLoading}
        {...register('name')}
      />

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
        placeholder="At least 8 characters"
        autoComplete="new-password"
        error={errors.password?.message}
        disabled={isLoading}
        {...register('password')}
      />

      <TextInput
        type="password"
        label="Confirm password"
        placeholder="Confirm your password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        disabled={isLoading}
        {...register('confirmPassword')}
      />

      {error && <ErrorBanner message={error} />}

      <Button
        type="submit"
        variant="primary"
        loading={isLoading}
        disabled={isLoading}
        icon={<UserPlus className="h-4 w-4" />}
        className="mt-2"
      >
        {isLoading ? 'Creating...' : 'Create account'}
      </Button>

      {onSwitchToLogin && (
        <p className="text-center text-sm text-text-muted">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-primary hover:underline"
          >
            Sign in
          </button>
        </p>
      )}
    </form>
  )
}
