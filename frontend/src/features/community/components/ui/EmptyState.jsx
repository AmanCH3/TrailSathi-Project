export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    {Icon && <Icon className="w-16 h-16 text-slate-600 mb-4" />}
    <h3 className="text-xl font-semibold text-slate-300 mb-2">{title}</h3>
    {description && <p className="text-slate-400 mb-6 max-w-md">{description}</p>}
    {action}
  </div>
);
