import React, { useState } from 'react';
import { db, storage } from './Config/firebase';
import { doc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import {useNavigate} from 'react-router-dom'


function Client() {
  const [name, setName] = useState('');
  const [problem, setProblem] = useState('');
  const [description, setDescription] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [status, setStatus] = useState('Open'); // Initial status

  const [nameError, setNameError] = useState(' ');
  const [problemError, setProblemError] = useState(' ');
  const [descriptionError, setDescriptionError] = useState(' ');
  const [isValid, setValid] = useState(false);

  const navigate = useNavigate();


  const isFormValid = () => {
    const isValidName = !nameError && name.length >= 4 && !containsSpecialCharacterInName();
    const isValidProblem = !problemError && problem.length >= 10;
    const isValidDescription = !descriptionError && description.length >= 15;
    if (isValidName && isValidProblem && isValidDescription) {
      setValid(true);
      return true;
    } else {
      setValid(false);
      return false;
    }
  };
  
  const containsSpecialCharacterInName = () => {
    const specialCharactersRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/;
    return specialCharactersRegex.test(name);
  };
  
  const handleNameChange = (e) => {
    setName(e.target.value);
    const inputName = e.target.value;
    const isLengthValid = inputName.length >= 4;
    
    const isNameValid = isLengthValid;
  
    if (isNameValid && !containsSpecialCharacterInName()) {
      setName(inputName);
      setNameError('');
    } else {
      setNameError("Name should  not contain special characters, and be at least 4 characters long");
    }
    isFormValid();
  };
  
  const handleProblemChange = (e) => {
    setProblem(e.target.value);

    const inputProblem = e.target.value;

    // Check if the input length is at least 4 characters
    const isLengthValid = inputProblem.length >= 10;

    if (isLengthValid) {
      // Update the problem state only if the input is valid
      setProblemError('');
    } else {
      setProblemError('Problem should be at least 10 characters');
    }
    isFormValid();
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);

    const inputDescription = e.target.value;

    // Check if the input length is at least 4 characters
    const isLengthValid = inputDescription.length >= 15;

    if (isLengthValid) {
      // Update the description state only if the input is valid
      setDescriptionError('');
    } else {
      setDescriptionError('Description should be at least 15 characters');
    }
    isFormValid();
  };

  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    setScreenshot(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    if (!isFormValid()) {
      setErrorMessage('Please correct the form errors before submitting.');
      return;
    } else {
      let screenshotURL = null;
      if (screenshot) {
        const storageRef = ref(storage, `screenshots/${Date.now()}_${screenshot.name}`);
        try {
          const snapshot = await uploadBytes(storageRef, screenshot);
          screenshotURL = await getDownloadURL(snapshot.ref);
        } catch (error) {
          console.error('Error uploading screenshot:', error);
          setErrorMessage('Error uploading screenshot');
          return;
        }
      }
      // Create a Firestore document with the download URL
      const formData = {
        Name: name,
        Problem: problem,
        description: description,
        screenshotURL: screenshotURL,
        createdAt: serverTimestamp(),
        status: status, // Use the current status from the component state
      };
      const formCollection = collection(db, 'Tickets');
      try {
        await addDoc(formCollection, formData);
        setSuccessMessage('<strong>Success!</strong> Ticket generated Successfully');
        setStatus('Closed'); // Change the status after successfully submitting a ticket
        setTimeout(() => {
          navigate('/tickets');
        }, 2000);
      } catch (error) {
        console.error('Error adding document:', error);
        setErrorMessage('Error submitting the form');
      }
      // Clear the form fields after submission
      setName('');
      setProblem('');
      setDescription('');
      setScreenshot(null); // Clear the screenshot state
      setTimeout(() => {
        setSuccessMessage('');
      }, 2000);
      setErrorMessage('');
    }
  };

  return (
    <div className="ticket-form mt-3">
      <h2 className='text-center mt-6'>Create Ticket</h2>
      <form onSubmit={handleSubmit}>
        <div>
          {successMessage && (
            <p
              className="success-message"
              style={{
                backgroundColor: 'lightgreen',
                padding: '10px',
                borderRadius: '5px',
                marginTop: '10px',
              }}
              dangerouslySetInnerHTML={{ __html: successMessage }}
            />
          )}
          <label>Name:</label>
          <input type="text" value={name} onChange={handleNameChange} />
          {nameError && (
            <p className="error-message" style={{ color: 'red' }}>
              {nameError}
            </p>
          )}
        </div>
        <div>
          <label>Problem:</label>
          <textarea value={problem} onChange={handleProblemChange} />
          {problemError && (
            <p className="error-message" style={{ color: 'red' }}>
              {problemError}
            </p>
          )}
        </div>
        <div>
          <label>Description:</label>
          <textarea value={description} onChange={handleDescriptionChange} />
          {descriptionError && (
            <p className="error-message" style={{ color: 'red' }}>
              {descriptionError}
            </p>
          )}
        </div>
        <div>
          <label>Screenshot:</label>
          <input type="file" id="file" accept=".png, .jpg, .jpeg" onChange={handleScreenshotChange} />
        </div>
        <div className='text-center'>
          <button
            type="submit"
            disabled={!isValid}
            className='mt-3'
            style={{
              backgroundColor: isValid ? 'blue' : 'lightgray',
              color: isValid ? 'white' : 'gray',
              cursor: isValid ? 'pointer' : 'not-allowed',
            }}
          >
            SUBMIT
          </button>
        </div>
      </form>
      {errorMessage && (
        <p
          className="error-message"
          style={{
            backgroundColor: '#FD655C',
            padding: '10px',
            borderRadius: '5px',
            marginTop: '10px',
          }}
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
}

export default Client;
