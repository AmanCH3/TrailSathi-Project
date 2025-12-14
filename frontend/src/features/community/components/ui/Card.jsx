import { cn } from '@/lib/utils';

export const Card = ({ className, children, ...props }) => (
  <div
    className={cn(
      'bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader = ({ className, children, ...props }) => (
  <div className={cn('mb-4', className)} {...props}>
    {children}
  </div>
);

export const CardBody = ({ className, children, ...props }) => (
  <div className={cn('', className)} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ className, children, ...props }) => (
  <div className={cn('mt-4 pt-4 border-t border-gray-100', className)} {...props}>
    {children}
  </div>
);
