import { Button } from '@/shared/ui/Button'

interface SubmitButtonProps {
  isSubmitting?: boolean
  disabled?: boolean
  children: React.ReactNode
}

export function SubmitButton({
  isSubmitting = false,
  disabled = false,
  children,
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      variant="primary"
      loading={isSubmitting}
      disabled={disabled || isSubmitting}
      className="mt-2"
    >
      {isSubmitting ? 'Submitting...' : children}
    </Button>
  )
}
