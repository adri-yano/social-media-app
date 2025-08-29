import ProfileForm from '../../components/profileform';

const sampleUser = {
  name: 'Abebe Bikila',
  username: 'abebe_cse_tech',
  bio: 'Software engineer, Tech enthusiast, Coffee lover',
  email: 'abebe@example.com',
  avatar: '/avatars/ava1.jpg',
  followers: 1250,
  following: 180,
  posts: 9,
  website: 'www.abebe-software.com'
};

const userPosts = [
  { id: 1, image: '/avatars/post1.jpg', likes: 120, comments: 15 },
  { id: 2, image: '/avatars/post2.jpg', likes: 89, comments: 8 },
  { id: 3, image: '/avatars/ava1.jpg', likes: 245, comments: 23 },
  { id: 4, image: '/avatars/ava2.jpg', likes: 67, comments: 5 },
  { id: 5, image: '/avatars/post1.jpg', likes: 156, comments: 12 },
  { id: 6, image: '/avatars/post2.jpg', likes: 98, comments: 7 },
  { id: 7, image: '/avatars/ava1.jpg', likes: 203, comments: 18 },
  { id: 8, image: '/avatars/ava2.jpg', likes: 134, comments: 11 },
  { id: 9, image: '/avatars/post1.jpg', likes: 78, comments: 6 }
];

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <ProfileForm user={sampleUser} />
      
     
      <div className="bg-white rounded-lg shadow-sm border mt-6">
        <div className="flex border-b">
          <button className="flex-1 py-3 text-center border-b-2 border-blue-500 text-blue-500 font-semibold">
            <svg className="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            POSTS
          </button>
        </div>
        
       
        <div className="grid grid-cols-3 gap-1 p-1">
          {userPosts.map((post) => (
            <div key={post.id} className="relative aspect-square group cursor-pointer">
              <img 
                src={post.image} 
                alt="Post"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white flex items-center space-x-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="font-semibold">{post.likes}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="font-semibold">{post.comments}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}