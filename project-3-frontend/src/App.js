import React, { useState } from 'react';
import Slider from 'react-slick';
import Modal from 'react-modal';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './App.css'; 

const FeedPage = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      images: Array.from({ length: 3 }, () => ({ url: 'https://via.placeholder.com/300' }))
    },
    {
      id: 2,
      images: Array.from({ length: 3 }, () => ({ url: 'https://via.placeholder.com/300' }))
    },
    {
      id: 3,
      images: Array.from({ length: 3 }, () => ({ url: 'https://via.placeholder.com/300' }))
    }
  ]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newPostUrl, setNewPostUrl] = useState('');
  const [lastImageUrl, setLastImageUrl] = useState('');
  const [requestId, setRequestId] = useState('');
  const [descriptionModalIsOpen, setDescriptionModalIsOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [metadata, setMetadata] = useState({
    label: '',
    type: '',
    season: '',
    show_name: '',
    designer: ''
  });
  const [successModalIsOpen, setSuccessModalIsOpen] = useState(false);
  const [receivedData, setReceivedData] = useState(null);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const closeDescriptionModal = () => {
    setDescriptionModalIsOpen(false);
  };

  const addPost = async (e) => {
    e.preventDefault();
    
    try {
      const requestId = generateRequestId();
      setRequestId(requestId);
  
      console.log('Request Payload:', { url: newPostUrl, requestId });
      const response = await fetch('http://localhost:3031/url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: newPostUrl, requestId }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to add post');
      }
  
      const data = await response.json();
      setLastImageUrl(data.URL); // Update to use data.URL instead of data.url
      
      openDescriptionModal();
      
      setReceivedData({ submitted_url: data.URL, requestID: data.requestId }); // Update to use data.URL instead of data.url
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };


  const handleDescriptionSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('YOUR_API_ENDPOINT_URL_FOR_DESCRIPTION', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          ...metadata,
          description,
          ...receivedData,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add description');
      }
  
      console.log('Description added successfully');
  
      closeDescriptionModal();
    } catch (error) {
      console.error('Error adding description:', error);
    }
  };
  
  const openDescriptionModal = () => {
    setDescriptionModalIsOpen(true);
  };

  const openSuccessModal = () => {
    setSuccessModalIsOpen(true);
  };

  const closeSuccessModal = () => {
    setSuccessModalIsOpen(false);
  };

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '0',
  };

  const generateRequestId = () => {
    return Math.random().toString(36).substring(7);
  };

  return (
    <div>
      <button onClick={openModal}>Add Post</button>
      
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Add Post Modal"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
          content: {
            backgroundColor: '#555',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            width: '300px',
            height: '200px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }
        }}
      >
        <h2>Please input a Fromjapan.co YJP link to save</h2>
        <form onSubmit={addPost}>
          <input
            type="url"
            value={newPostUrl}
            onChange={(e) => setNewPostUrl(e.target.value)}
            placeholder="Enter YJP Link"
            required
            style={{ width: '100%', padding: '5px' }}
          />
          <button type="submit" style={{ marginTop: '10px' }}>Submit</button>
          <button type="button" onClick={closeModal} style={{ marginTop: '10px' }}>Cancel</button>
        </form>
      </Modal>

      <Modal
      isOpen={descriptionModalIsOpen && receivedData !== null}
      onRequestClose={closeDescriptionModal}
      contentLabel="Add Description Modal"
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        content: {
          backgroundColor: '#555',
          color: '#fff',
          border: 'none',
          borderRadius: '10px',
          width: '500px',
          height: '500px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }
      }}
    >
      <h2>Add Description</h2>
      {receivedData && (
          <>
            <p>Submitted URL: {receivedData.submitted_url}</p>
            <p>Request ID: {receivedData.requestID}</p>
          </>
        )}
      <form onSubmit={handleDescriptionSubmit}>
        <label>
          Label:
          <input
            type="text"
            value={metadata.label}
            onChange={(e) => setMetadata({ ...metadata, label: e.target.value })}
            placeholder="Label"
            required
            disabled
            style={{ width: '100%', padding: '5px', marginBottom: '10px' }}
          />
        </label>
        <label>
          Type:
          <input
            type="text"
            value={metadata.type}
            onChange={(e) => setMetadata({ ...metadata, type: e.target.value })}
            placeholder="Type"
            required
            style={{ width: '100%', padding: '5px', marginBottom: '10px' }}
          />
        </label>
        <label>
          Season:
          <input
            type="text"
            value={metadata.season}
            onChange={(e) => setMetadata({ ...metadata, season: e.target.value })}
            placeholder="Season"
            required
            style={{ width: '100%', padding: '5px', marginBottom: '10px' }}
          />
        </label>
        <label>
          Show Name:
          <input
            type="text"
            value={metadata.show_name}
            onChange={(e) => setMetadata({ ...metadata, show_name: e.target.value })}
            placeholder="Show Name"
            required
            style={{ width: '100%', padding: '5px', marginBottom: '10px' }}
          />
        </label>
        <label>
          Designer:
          <input
            type="text"
            value={metadata.designer}
            onChange={(e) => setMetadata({ ...metadata, designer: e.target.value })}
            placeholder="Designer"
            required
            style={{ width: '100%', padding: '5px', marginBottom: '10px' }}
          />
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
          style={{ width: '100%', height: '100px', padding: '5px', marginBottom: '10px' }}
        />
        <button type="submit" style={{ marginTop: '10px' }}>Submit</button>
        <button type="button" onClick={closeDescriptionModal} style={{ marginTop: '10px' }}>Cancel</button>
      </form>
    </Modal>

    <Modal
      isOpen={successModalIsOpen}
      onRequestClose={closeSuccessModal}
      contentLabel="Success Modal"
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        content: {
          backgroundColor: '#555',
          color: '#fff',
          border: 'none',
          borderRadius: '10px',
          width: '300px',
          height: '200px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }
      }}
    >
      <h2>Post Added Successfully!</h2>
      <button onClick={closeSuccessModal}>Close</button>
    </Modal>

    <div>
      {posts.map(post => (
        <div key={post.id} style={{ padding: '20px 0' }}>
          <div style={{ maxWidth: '500px', margin: '20px auto' }}>
            <Slider {...carouselSettings}>
              {post.images.map((image, index) => (
                <div key={index}>
                  <img src={image.url} alt={`Post ${post.id} image ${index}`} style={{ display: 'block', margin: '0 auto', width: '100%' }} />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      ))}
    </div>
  </div>
);
};

export default FeedPage;
