import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Filter, 
  ThumbsUp, 
  Reply, 
  Clock,
  User,
  Tag,
  Wheat,
  Wrench,
  TrendingUp,
  Cloud,
  Bug
} from 'lucide-react';
import { ForumPost, ForumCategory } from '../types';

const CommunityForum: React.FC = () => {
  const { authState } = useAuth();
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewPostForm, setShowNewPostForm] = useState(false);

  const categories: ForumCategory[] = [
    {
      id: 'general',
      name: 'General Discussion',
      description: 'General farming topics and community chat',
      icon: '💬',
      postCount: 45,
      latestPost: {
        title: 'Welcome to the Community!',
        authorName: 'Mubita',
        createdAt: '2024-08-30T10:00:00Z'
      }
    },
    {
      id: 'crops',
      name: 'Crop Management',
      description: 'Share experiences about different crops and farming techniques',
      icon: '🌾',
      postCount: 32,
      latestPost: {
        title: 'Best maize varieties for Zambian soil',
        authorName: 'Mirriam',
        createdAt: '2024-08-30T08:30:00Z'
      }
    },
    {
      id: 'equipment',
      name: 'Equipment & Tools',
      description: 'Discuss farming equipment, maintenance, and recommendations',
      icon: '🚜',
      postCount: 18,
      latestPost: {
        title: 'Affordable irrigation systems',
        authorName: 'Joseph',
        createdAt: '2024-08-29T16:45:00Z'
      }
    },
    {
      id: 'market',
      name: 'Market Insights',
      description: 'Share market trends, prices, and trading opportunities',
      icon: '📈',
      postCount: 27,
      latestPost: {
        title: 'Current maize prices in Lusaka',
        authorName: 'Natasha',
        createdAt: '2024-08-29T14:20:00Z'
      }
    },
    {
      id: 'weather',
      name: 'Weather & Climate',
      description: 'Weather updates, seasonal planning, and climate adaptation',
      icon: '🌤️',
      postCount: 15,
      latestPost: {
        title: 'Rainy season preparation tips',
        authorName: 'Mirriam',
        createdAt: '2024-08-29T12:10:00Z'
      }
    },
    {
      id: 'pest-control',
      name: 'Pest & Disease Control',
      description: 'Identify pests, share treatment methods, and prevention strategies',
      icon: '🐛',
      postCount: 22,
      latestPost: {
        title: 'Organic pest control methods',
        authorName: 'Samuel',
        createdAt: '2024-08-29T09:15:00Z'
      }
    }
  ];

  const recentPosts: ForumPost[] = [
    {
      id: '1',
      title: 'Best practices for maize farming in the upcoming season',
      content: 'Looking for advice on the best maize varieties to plant this season...',
      authorId: 'farmer_001',
      authorName: 'Mirriam',
      authorRole: 'farmer',
      category: 'crops',
      tags: ['maize', 'season-planning', 'varieties'],
      likes: 12,
      replies: [
        {
          id: 'r1',
          postId: '1',
          content: 'I recommend SC627 for your area. Good yield and disease resistant.',
          authorId: 'vendor_001',
          authorName: 'David Seeds Co.',
          authorRole: 'vendor',
          likes: 5,
          createdAt: '2024-08-30T09:30:00Z',
          updatedAt: '2024-08-30T09:30:00Z'
        }
      ],
      isSticky: false,
      isClosed: false,
      createdAt: '2024-08-30T08:00:00Z',
      updatedAt: '2024-08-30T09:30:00Z'
    },
    {
      id: '2',
      title: 'Where to buy quality fertilizers in Lusaka?',
      content: 'Can anyone recommend reliable suppliers for NPK fertilizers in Lusaka area?',
      authorId: 'customer_001',
      authorName: 'Natasha',
      authorRole: 'customer',
      category: 'market',
      tags: ['fertilizers', 'lusaka', 'suppliers'],
      likes: 8,
      replies: [
        {
          id: 'r2',
          postId: '2',
          content: 'Try Agro Solutions on Independence Avenue. Good prices and quality.',
          authorId: 'farmer_002',
          authorName: 'Joseph',
          authorRole: 'farmer',
          likes: 3,
          createdAt: '2024-08-30T07:45:00Z',
          updatedAt: '2024-08-30T07:45:00Z'
        }
      ],
      isSticky: false,
      isClosed: false,
      createdAt: '2024-08-30T07:30:00Z',
      updatedAt: '2024-08-30T07:45:00Z'
    }
  ];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'farmer': return '👨‍🌾';
      case 'customer': return '🛒';
      case 'vendor': return '🏪';
      default: return '👤';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'farmer': return 'bg-green-100 text-green-800';
      case 'customer': return 'bg-blue-100 text-blue-800';
      case 'vendor': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPosts = recentPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <MessageSquare className="mr-3 h-7 w-7 text-green-600" />
                Community Forum
              </h1>
              <p className="text-gray-600 mt-1">Connect, share knowledge, and grow together</p>
            </div>
            <button
              onClick={() => setShowNewPostForm(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedCategory === 'all' ? 'bg-green-50 text-green-700' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">All Posts</span>
                    <span className="text-sm text-gray-500">{recentPosts.length}</span>
                  </div>
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedCategory === category.id ? 'bg-green-50 text-green-700' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium flex items-center">
                        <span className="mr-2">{category.icon}</span>
                        {category.name}
                      </span>
                      <span className="text-sm text-gray-500">{category.postCount}</span>
                    </div>
                    <p className="text-xs text-gray-500">{category.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Posts List */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
                      <p className="text-gray-600 mb-4">{post.content}</p>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs flex items-center"
                          >
                            <Tag className="mr-1 h-3 w-3" />
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Author and stats */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{getRoleIcon(post.authorRole)}</span>
                            <span className="font-medium text-gray-900">{post.authorName}</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${getRoleBadgeColor(post.authorRole)}`}>
                              {post.authorRole}
                            </span>
                          </div>
                          <div className="flex items-center text-gray-500 text-sm">
                            <Clock className="mr-1 h-4 w-4" />
                            {new Date(post.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <button className="flex items-center text-gray-500 hover:text-green-600 transition-colors">
                            <ThumbsUp className="mr-1 h-4 w-4" />
                            {post.likes}
                          </button>
                          <button className="flex items-center text-gray-500 hover:text-blue-600 transition-colors">
                            <Reply className="mr-1 h-4 w-4" />
                            {post.replies.length}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* New Post Form Modal */}
        {showNewPostForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <h3 className="text-lg font-semibold mb-4">Create New Post</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    placeholder="Enter post title..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                  <textarea
                    rows={6}
                    placeholder="Share your thoughts, questions, or experiences..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags (optional)</label>
                  <input
                    type="text"
                    placeholder="Add tags separated by commas..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Post
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewPostForm(false)}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityForum;