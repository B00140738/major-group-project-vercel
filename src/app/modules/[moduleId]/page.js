"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Box, TextField } from "@mui/material";
import Layout from '../../Components/Layout';
import Comment from '../../Components/Comments';

const ModulePage = () => {
  const [moduleInfo, setModuleInfo] = useState({});
  const [posts, setPosts] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [username, setUsername] = useState('');
  const router = useRouter();
  const moduleId = router.query.moduleId; // Using router.query directly
  const [comments, setComments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const getUsernameFromCookies = () => {
      const allCookies = document.cookie.split('; ');
      const usernameCookie = allCookies.find(cookie => cookie.startsWith('username='));
      return usernameCookie ? decodeURIComponent(usernameCookie.split('=')[1]) : '';
    };
    const usernameFromCookies = getUsernameFromCookies();
    setUsername(usernameFromCookies);
  }, []);

  useEffect(() => {
    const fetchModuleDetails = async () => {
      if (!moduleId) return;

      try {
        const response = await fetch(`/api/threads?moduleId=${moduleId}`);
        if (!response.ok) throw new Error('Failed to fetch module details');
        const data = await response.json();
        setModuleInfo(data.module || {});
        setPosts(data.threads || []);
      } catch (error) {
        console.error('Error fetching module details:', error);
      }
    };

    fetchModuleDetails();
  }, [moduleId]);

  useEffect(() => {
    const fetchAnnouncementsForModule = async () => {
      if (!moduleId) return;
      try {
        const response = await fetch(`/api/getAnnouncements?moduleId=${moduleId}`);
        if (!response.ok) throw new Error('Failed to fetch announcements for module');
        const data = await response.json();
        setAnnouncements(data || []); // Set announcements directly
      } catch (error) {
        console.error('Error fetching announcements for module:', error);
      }
    };

    fetchAnnouncementsForModule();
  }, [moduleId]);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
    setComments([]);
  };

  return (
    <Layout>
      <div className='container'>
        {moduleInfo && moduleInfo.title ? (
          <div className='forum-container'>
            <center>
              <h1>{moduleInfo.title}</h1>
              <p>{moduleInfo.description}</p>
              <Button variant="contained" color="primary" onClick={() => router.push('/createPost')}>
                Create Post
              </Button>
              {email === moduleInfo.lecturer && (
                <Button variant="contained" color="primary" onClick={() => router.push('/createAnnouncement')}>
                  Create Announcement
                </Button>
              )}
            </center>
            <br />
            <br />
            <center><h1>Announcements</h1></center>
            <br />
            <br />
            {/* Render Announcements Here */}
            {announcements.length > 0 ? (
              announcements.map((announcement, index) => (
                <div key={index} className="announcement" id={`announcement-${announcement._id || index}`}>
                  <h4>{announcement.title}</h4>
                  <p>{announcement.content}</p>
                </div>
              ))
            ) : (
              <center><p>No announcements to display</p></center>
            )}
            <br />
            <br />
            <center><h1>Posts</h1></center>
            {/* Rendering Posts Here */}
            {posts.length > 0 ? (
              posts.map((post, index) => (
                <div key={post._id || index} className="post" id={`post-${post._id || index}`}>
                  <h4>Creator: {post.poster}</h4>
                  <h4>{post.title}</h4>
                  <p>{post.content}</p>
                  <button onClick={() => setSelectedPost(post)}>
                    View Post
                  </button>
                  {/* Add delete button */}
                  {(username === post.poster || email === moduleInfo.lecturer || email === moduleInfo.moderator) && (
                    <button onClick={() => handleDeletePost(post._id)}>Delete</button>
                  )}
                </div>
              ))
            ) : (
              <center><p>No posts to display</p></center>
            )}

            {/* Modal for viewing post details and comments */}
            {isModalOpen && (
              <div className="modal-backdrop">
                <div className="modal-content">
                  <button onClick={() => closeModal()} className="modal-close-button">X</button>
                  <h2>{selectedPost?.title}</h2>
                  <p>{selectedPost?.content}</p>
                  <hr />
                  <div className="forum-container">
                    <h3>Comments:</h3>
                    <div className="comment-list">
                      {/* Render comments here */}
                    </div>
                  </div>
                  {/* Comment form */}
                  <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <p>{username}</p> {/* Display username here */}
                    <TextField
                      margin="normal"
                      name="content"
                      label="Content"
                      type="text"
                      id="content"
                    />
                    <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
                      Submit
                    </Button>
                  </Box>
                </div>
              </div>
            )}
          </div>
        ) : (
          <center><p>Loading module details...</p></center>
        )}
      </div>
    </Layout>
  );
};

export default ModulePage;
