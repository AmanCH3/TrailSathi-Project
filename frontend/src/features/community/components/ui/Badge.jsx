import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
  {
    variants: {
      variant: {
        public: 'bg-emerald-100 text-emerald-700',
        private: 'bg-amber-100 text-amber-700',
        admin: 'bg-blue-100 text-blue-700',
        owner: 'bg-purple-100 text-purple-700',
        member: 'bg-gray-100 text-gray-600',
      },
    },
    defaultVariants: {
      variant: 'member',
    },
  }
);

export const Badge = ({ variant, className, children, ...props }) => {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </span>
  );
};
