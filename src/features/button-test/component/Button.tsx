import { type VariantProps, cva } from 'class-variance-authority'
import React from 'react'

const buttonVariants = cva('button', {
  variants: {
    variant: {
      primary: 'bg-blue-500 text-white',
      secondary: 'bg-gray-500 text-white',
    },
    size: {
      small: 'px-2 py-1',
      large: 'px-6 py-3',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'small',
  },
})

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return <button className={buttonVariants({ variant, size, className })} ref={ref} {...props} />
  },
)
Button.displayName = 'Button'
export default Button
