import { Users } from 'lucide-react';

export const MembersPreview = ({ members = [], totalCount = 0, onViewAll }) => {
  const displayMembers = members.slice(0, 5);
  const remainingCount = Math.max(0, totalCount - 5);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-emerald-600" />
        <h3 className="text-lg font-semibold text-gray-900">Members</h3>
      </div>

      <div className="flex -space-x-2 mb-3">
        {displayMembers.map((member, index) => (
          <div
            key={member.id || member._id || index}
            className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-gray-100"
            title={member.name}
          >
            {member.avatar && member.avatar !== '/default-avatar.jpg' ? (
              <img
                src={member.avatar}
                alt={member.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-emerald-600 text-white text-xs font-bold">
                {member.name?.charAt(0)?.toUpperCase() || 'M'}
              </div>
            )}
          </div>
        ))}
        {remainingCount > 0 && (
          <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
            +{remainingCount}
          </div>
        )}
      </div>

      {onViewAll && (
        <button
          onClick={onViewAll}
          className="text-sm text-emerald-600 hover:text-emerald-700 transition-colors font-medium"
        >
          View all {totalCount} members →
        </button>
      )}
    </div>
  );
};
