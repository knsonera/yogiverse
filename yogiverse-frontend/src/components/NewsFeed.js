// I wrote this code

/**
 * NewsFeed.js
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { addNewStatus, fetchUserStatusUpdates, fetchMediaFileById } from '../utils/handlers';  // Importing utility function
import './NewsFeed.css';


 const NewsFeed = ({ userId, readOnly }) => {
   const [newStatus, setNewStatus] = useState('');
   const [mediaFile, setMediaFile] = useState(null);
   const [statusUpdates, setStatusUpdates] = useState([]);

   // Listening userId change
   useEffect(() => {
     // Fetching status updates
     const fetchStatusUpdates = async () => {
       try {
         const data = await fetchUserStatusUpdates(userId);

         // Fetching media
         if (data) {
           const promises = data.map(async (statusUpdate) => {
             if (statusUpdate.media_file_id) {
               const { media_file } = await fetchMediaFileById(statusUpdate.media_file_id);
               return { ...statusUpdate, media_file };
             }
             return statusUpdate;
           });

           const updatedStatusUpdates = await Promise.all(promises);
           //console.log(updatedStatusUpdates)

           // updatedStatusUpdates contains status updates with media
           setStatusUpdates(updatedStatusUpdates.reverse());
         }
       } catch (error) {
         console.error('Error fetching status updates', error);
       }
     };

     fetchStatusUpdates();
   }, [userId]);

   // Adding new status
  const handleAddNewStatus = async () => {
       try {
         // Call the addNewStatus function with the correct order of arguments
         if (mediaFile) {
           // Call addNewStatusWithMedia when a media file is selected
           await addNewStatus(newStatus, mediaFile, 'image', userId, statusUpdates, setNewStatus, setStatusUpdates);
         } else {
           // Call addNewStatus without media when no media file is selected
           await addNewStatus(newStatus, null, null, userId, statusUpdates, setNewStatus, setStatusUpdates);
         }
         // Clear the media file selection after posting
         setMediaFile(null);
       } catch (error) {
         // Log any errors that occur during the status update
         console.error('Error posting new status', error);
       }
  };

  // Changing selection of media file
  const handleMediaFileChange = (e) => {
      const selectedFile = e.target.files[0];
      setMediaFile(selectedFile);
      console.log('handle media file change');
  };

  // Format a date string to include date, time, and timezone
  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="news-area">
      <h2>News Feed</h2>
      {readOnly ? null : (
        <div className="news-input">
          <input
            type="text"
            placeholder="What's on your mind?"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleMediaFileChange}
          />
          <button onClick={handleAddNewStatus}>Post</button>
        </div>
      )}
      <div className="chat-messages">
        {statusUpdates.length > 0 ? (
          <ul>
            {statusUpdates.map(update => (
              <li key={update.id}>
                <p>{update.text_content}</p>
                {update.media_file ? (
                  <img src={update.media_file} alt="Uploaded content" className="status-image" />
                ) : null}
                <p className="date">{formatDate(update.created_at)}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No posts yet.</p>
        )}
      </div>
    </div>
  );
};

export default NewsFeed;

// end of the code I wrote
