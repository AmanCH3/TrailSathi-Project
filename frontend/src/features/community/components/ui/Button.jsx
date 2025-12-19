import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'bg-emerald-500 text-white hover:bg-emerald-600 active:bg-emerald-700',
        secondary: 'bg-transparent border border-slate-600 text-slate-200 hover:border-emerald-500 hover:text-emerald-400',
        destructive: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700',
        ghost: 'hover:bg-slate-800 text-slate-200',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export const Button = ({ variant, size, className, children, ...props }) => {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props}>
      {children}
    </button>
  );
};
