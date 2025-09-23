import React from 'react';

const Feed = () => {
  const posts = [
    {
      name: 'Sarah Chen',
      title: 'Senior UX Designer',
      time: '2 hours ago',
      content:
        'Just completed an amazing project redesigning the user onboarding flow. The new design increased conversion rates by 40%! 🎉 Always exciting to see data-driven design improvements make such a big impact.',
      hasPostContent: true,
      likes: 24,
      comments: 8,
      shares: 3,
      showMore: true,
    },
    {
      name: 'Mike Johnson',
      title: 'Full Stack Developer',
      time: '4 hours ago',
      content:
        'Excited to share that I just open-sourced my React component library! It includes 50+ customizable components with TypeScript support and comprehensive documentation. Link in comments 👇',
      hasPostContent: false,
      likes: 156,
      comments: 23,
      shares: 12,
      showMore: false,
    },
    {
      name: 'Lisa Wang',
      title: 'Product Manager',
      time: '6 hours ago',
      content:
        "Key learnings from launching our AI-powered feature: 1) User feedback is invaluable 2) Start with MVP and iterate 3) Cross-functional collaboration is everything. What's your biggest product launch lesson?",
      hasPostContent: false,
      likes: 89,
      comments: 34,
      shares: 7,
      showMore: true,
    },
    {
      name: 'David Kim',
      title: 'DevOps Engineer',
      time: '8 hours ago',
      content:
        'Successfully migrated our entire infrastructure to Kubernetes! Deployment time reduced from 30 minutes to 2 minutes. The team is thrilled with the improved developer experience.',
      hasPostContent: true,
      likes: 67,
      comments: 15,
      shares: 5,
      showMore: false,
    },
    {
      name: 'Emma Rodriguez',
      title: 'Data Scientist',
      time: '12 hours ago',
      content:
        'Fascinating insights from our latest ML model: customer behavior patterns are more predictable than we thought. The model achieved 94% accuracy in predicting user churn. Data science never ceases to amaze.',
      hasPostContent: false,
      likes: 112,
      comments: 28,
      shares: 9,
      showMore: true,
    },
  ];

  const trendingTopics = [
    { tag: '#ReactJS', posts: 1247, change: '+12%' },
    { tag: '#AI', posts: 892, change: '+25%' },
    { tag: '#WebDev', posts: 756, change: '+8%' },
    { tag: '#TypeScript', posts: 634, change: '+15%' },
    { tag: '#NextJS', posts: 523, change: '+18%' },
    { tag: '#DevOps', posts: 445, change: '+6%' },
  ];

  const suggestedGroups = [
    {
      name: 'Tech Innovators',
      members: '12.5k',
      description: 'Latest trends in technology and innovation',
    },
    {
      name: 'Frontend Developers',
      members: '8.2k',
      description: 'React, Vue, Angular and modern frontend',
    },
    {
      name: 'Startup Founders',
      members: '5.7k',
      description: 'Entrepreneurship and startup insights',
    },
  ];

  return (
    <div className="max-w-[800px] mx-auto font-sans p-5 text-gray-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <div className="text-sm text-gray-500">20/09/2025, 13:23</div>
        <div className="font-bold text-lg text-white">
          SkillSync - Professional Networking & Collaboration
        </div>
      </div>

      {/* Post Input */}
      <div className="bg-gray-900 rounded-xl p-4 mb-5 border border-gray-800">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-700 mr-3" />
          <input
            type="text"
            placeholder="Share your thoughts, insights, or achievements..."
            className="flex-1 border-none bg-gray-800 px-4 py-2 rounded-full text-sm outline-none text-gray-200 placeholder-gray-500"
          />
        </div>
      </div>

      {/* Posts */}
      {posts.map((post, index) => (
        <div
          key={index}
          className="bg-gray-900 rounded-xl p-4 mb-5 border border-gray-800"
        >
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-700 mr-3" />
              <div>
                <div className="font-bold text-sm text-white">{post.name}</div>
                <div className="text-gray-500 text-xs">
                  {post.title} · {post.time}
                </div>
              </div>
            </div>
            <div className="text-gray-500 text-lg">···</div>
          </div>

          <div className="text-sm mb-3">{post.content}</div>

          {post.showMore && (
            <div className="text-green-500 text-sm mb-3 cursor-pointer">
              Show more
            </div>
          )}

          {post.hasPostContent && (
            <div className="text-blue-400 text-sm mb-3 flex items-center">
              <span className="mr-1">🖼</span> Post content
            </div>
          )}

          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-5">❤ {post.likes}</span>
            <span className="mr-5">💬 {post.comments}</span>
            <span className="mr-5">⬆ {post.shares}</span>
            <span>🔖</span>
          </div>
        </div>
      ))}

      {/* Trending Topics */}
      <div className="bg-gray-900 rounded-xl p-4 mb-5 border border-gray-800">
        <div className="font-bold text-base mb-4 text-white">
          Trending Topics
        </div>
        {trendingTopics.map((topic, index) => (
          <div key={index} className="mb-3">
            <div className="font-bold text-sm text-green-500">{topic.tag}</div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{topic.posts} posts</span>
              <span
                className={
                  topic.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
                }
              >
                {topic.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Suggested Groups */}
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
        <div className="font-bold text-base mb-4 text-white">
          Suggested Groups
        </div>
        {suggestedGroups.map((group, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between text-sm font-bold text-green-500">
              <span>{group.name}</span>
              <span>{group.members}</span>
            </div>
            <div className="text-xs text-gray-500 mb-2">{group.description}</div>
            <div className="text-blue-400 text-sm cursor-pointer">Join Group</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;
