export default function ProfileForm({ user }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-8">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
        {/* Profile Picture */}
        <div className="flex-shrink-0">
          <img 
            src={user.avatar} 
            alt={user.name}
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg" 
          />
        </div>

        {/* Profile Info */}
        <div className="flex-1 min-w-0">
          {/* Username and Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            <h1 className="text-2xl font-light">{user.username}</h1>
            <div className="flex gap-2">
              <button className="bg-blue-500 text-white px-6 py-1.5 rounded font-semibold text-sm hover:bg-blue-600 transition-colors">
                Follow
              </button>
              <button className="border border-gray-300 p-1.5 rounded hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mb-4">
            <div className="text-center">
              <span className="font-semibold">{user.posts}</span>
              <span className="text-gray-500 ml-1">posts</span>
            </div>
            <div className="text-center">
              <span className="font-semibold">{user.followers.toLocaleString()}</span>
              <span className="text-gray-500 ml-1">followers</span>
            </div>
            <div className="text-center">
              <span className="font-semibold">{user.following}</span>
              <span className="text-gray-500 ml-1">following</span>
            </div>
          </div>

          {/* Bio */}
          <div className="mb-4">
            <h2 className="font-semibold text-sm mb-1">{user.name}</h2>
            <p className="text-sm whitespace-pre-line">{user.bio}</p>
            {user.website && (
              <a 
                href={`https://${user.website}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-900 text-sm font-semibold hover:underline"
              >
                {user.website}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}