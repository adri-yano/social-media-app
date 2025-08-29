import Post from '../../components/post';

const samplePosts = [
  {
    username: 'chala',
    avatar: '/avatars/ava1.jpg',
    image: '/avatars/post1.jpg',
    likes: 120,
    caption: 'Beautiful sunset at the beach! 🌅 #sunset #beach #photography',
    comments: [
      { username: 'chala123', text: 'Nice pic!' },
      { username: 'photo_lover', text: 'Amazing colors!' },
      { username: 'travel_bug', text: 'Where is this?' }
    ]
  },
  {
    username: 'belete',
    avatar: '/avatars/ava2.jpg',
    image: '/avatars/post2.jpg',
    likes: 90,
    caption: 'Coffee and coding ☕️ #developer #coffee #coding',
    comments: [
      { username: 'bele_boy', text: 'Cool!' },
      { username: 'dev_girl', text: 'Same here! 💻' }
    ]
  },
  {
    username: 'sarah_photography',
    avatar: '/avatars/ava1.jpg',
    image: '/avatars/post1.jpg',
    likes: 245,
    caption: 'Street photography in the city 📸 #street #photography #urban',
    comments: [
      { username: 'photo_enthusiast', text: 'Great composition!' },
      { username: 'city_lover', text: 'Which city is this?' },
      { username: 'art_collector', text: 'Love the mood!' }
    ]
  }
];

const suggestedUsers = [
  { username: 'travel_photographer', avatar: '/avatars/ava1.jpg', followers: '2.5k' },
  { username: 'food_blogger', avatar: '/avatars/ava2.jpg', followers: '1.8k' },
  { username: 'fitness_guru', avatar: '/avatars/ava1.jpg', followers: '3.2k' },
  { username: 'tech_news', avatar: '/avatars/ava2.jpg', followers: '5.1k' }
];

export default function HomePage() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Main Feed */}
      <div className="space-y-6">
        {samplePosts.map((post, i) => <Post key={i} post={post} />)}
      </div>
    </div>
  );
}