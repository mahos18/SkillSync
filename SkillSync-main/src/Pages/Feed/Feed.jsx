import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { Image as ImageIcon, X } from "lucide-react";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newPostText, setNewPostText] = useState('');
  const [newPostImage, setNewPostImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
  const loaderRef = useRef(null);
  const token = localStorage.getItem('token');

  // ✅ fetch posts
  const fetchPosts = useCallback(async (cursor = null) => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8080/post/feed", {
        headers: { Authorization: `Bearer ${token}` },
        params: cursor ? { cursor } : {}
      });

      if (res.data.success) {
        setPosts(prev => cursor ? [...prev, ...res.data.posts] : res.data.posts);
        setNextCursor(res.data.nextCursor || null);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // ✅ First load
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // ✅ Infinite scroll
  useEffect(() => {
    if (!loaderRef.current) return;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && nextCursor && !loading) {
        fetchPosts(nextCursor);
      }
    }, { rootMargin: '200px' });

    obs.observe(loaderRef.current);
    return () => obs.disconnect();
  }, [nextCursor, loading, fetchPosts]);

  // ✅ Create post
  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("text", newPostText);
      if (newPostImage) formData.append("image", newPostImage);
      console.log("New post image:", newPostImage);
      console.log(formData)

      const res = await axios.post(
        "http://localhost:8080/post/add",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      if (res.data.success) {
        setPosts([res.data.post, ...posts]); // prepend
        setNewPostText("");
        setNewPostImage(null);
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPostImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex justify-center">
      {/* Feed content */}
      <div className="flex-1 p-4 max-w-5xl">
        {/* New post */}
        {/* <form onSubmit={handleCreatePost} className=" flex items-start mb-4 bg-[#030712] border border-gray-800 p-3 rounded">
          
          <input
          
            type="file"
            accept="image/*" 
            onChange={e => setNewPostImage(e.target.files[0])}
            image={<Image />}
            className="mt-2 text-sm text-gray-400"
          />
          <textarea
            value={newPostText}
            onChange={e => setNewPostText(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full p-2 rounded bg-gray-900 text-white resize-none"
          />
          
          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-green-500 rounded text-white"
          >
            Post
          </button>
        </form> */}
         <form
          onSubmit={handleCreatePost}
          className="flex items-start gap-3 mb-4 bg-[#030712] border border-gray-800 p-3 rounded-md"
        >
          {/* Image upload trigger */}
          <div className="flex flex-col items-center w-[10%]">
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <label
              htmlFor="fileInput"
              className="cursor-pointer p-2 text-gray-400 hover:text-green-500 transition-colors"
            >
              <ImageIcon className="w-5 h-5" />
            </label>

            {/* Small preview thumbnail */}
            {imagePreview && (
              <div className="relative w-16 h-16 mt-2">
                <img
                  src={imagePreview}
                  alt="preview"
                  className="w-full h-full object-cover rounded-md border border-gray-700"
                />
                <button
                  type="button"
                  onClick={() => {
                    setNewPostImage(null);
                    setImagePreview(null);
                  }}
                  className="absolute top-0 right-0 bg-black/60 rounded-full p-1 text-gray-300 hover:text-red-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Textarea + Post button */}
          <div className="flex flex-row flex-grow w-[85%]">
            <textarea
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-[90%] p-2 rounded bg-gray-900 text-white resize-none focus:outline-none focus:ring-1 focus:ring-green-500"
            />

            <div className="flex justify-end mt-2">
              <button
                type="submit"
                className="  mx-3 px-7 p-2 bg-green-500 hover:bg-green-600 rounded text-white transition-colors"
              >
                Post
              </button>
            </div>
          </div>
        </form>

        {/* Posts */}
        {posts.map(p => (
          <article key={p._id} className="bg-[#030712] border border-gray-800 p-4 mb-4 rounded">
            <div className="flex items-center gap-3 mb-2">
              <img
                src={p.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.user?.fullName)}&background=10b981&color=fff` }
                alt={p.user?.fullName || "User"}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <div className="text-white font-medium">{p.fullName || p.user?.fullName}</div>
                <div className="text-sm text-gray-400">{p.currentPosition || p.user?.currentPosition}</div>
              </div>
              <div className="ml-auto text-sm text-gray-500">
                {new Date(p.createdAt).toLocaleString()}
              </div>
            </div>
            
            {p.image && (
              <div className=" h-110 flex flex-col  items-center justify-center overflow-hidden rounded-lg mt-2">
                <img
                  src={`http://localhost:8080${p.image}`}
                  alt="Post"
                  className=" h-full object-fit"
                />
              </div>
            )}
            <div className="text-gray-200 mb-2  mt-5 px-5 text-xl">{p.text}</div>
          </article>
        ))}

        {/* Loader */}
        <div ref={loaderRef} className="h-12 flex items-center justify-center">
          {loading ? (
            <span className="text-gray-400">Loading...</span>
          ) : !nextCursor ? (
            <span className="text-gray-500">No more posts</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
