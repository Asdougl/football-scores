import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import type { ButtonHTMLAttributes, FC } from 'react'

const button = cva('px-3 py-1 rounded transition-colors', {
  variants: {
    color: {
      indigo: 'hover:bg-indigo-500 hover:text-white',
      purple: 'hover:bg-purple-500 hover:text-white',
      pink: 'hover:bg-pink-500 hover:text-white',
    },
    active: {
      true: 'text-white',
      false: 'text-black',
    },
  },
  defaultVariants: {
    color: 'indigo',
  },
  compoundVariants: [
    {
      color: 'indigo',
      active: true,
      class: 'bg-indigo-500',
    },
    {
      color: 'purple',
      active: true,
      class: 'bg-purple-500',
    },
    {
      color: 'pink',
      active: true,
      class: 'bg-pink-500',
    },
  ],
})

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof button>

export const Button: FC<ButtonProps> = ({
  children,
  color,
  active,
  ...props
}) => {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <button className={button({ color, active })} {...props}>
      {children}
    </button>
  )
}
