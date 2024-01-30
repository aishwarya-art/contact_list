import React, { useState,useEffect  } from "react";
import { useParams,useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Route, Link, Routes,Navigate } from "react-router-dom";

import './App.css';
import "./styles.css";
import Dashboard from "./Dashboard";

function Home() {
  const [data, setData] = useState([]);
  const [deleteStatus, setDeleteStatus] = useState({});
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    // Fetch data from the API
    fetch('https://techkshetra.ai/attendance_web/index.php/CrudApi/display')
      .then(response => response.json())
      .then(apiResponse => {
      
        if (apiResponse && apiResponse.data) {
          setData(apiResponse.data);
        } else {
          console.error('Invalid API response:', apiResponse);
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch('https://techkshetra.ai/attendance_web/index.php/CrudApi/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const result = await response.json();
  
      if (result.status === 'success') {
        setData((prevData) => prevData.filter((item) => item.id !== id));
        setDeleteStatus({ type: 'success', message: 'Record deleted successfully' });
      } else {
        console.error(result.message);
        setDeleteStatus({ type: 'error', message: result.message });
      }
    } catch (error) {
      console.error('Fetch error:', error.message);
      setDeleteStatus({ type: 'error', message: 'Failed to delete record' });
    }
  };
  
  useEffect(() => {
    const clearStatus = setTimeout(() => {
      setDeleteStatus({});
    }, 3000);

    return () => clearTimeout(clearStatus);
  }, [deleteStatus]);



  const confirmDelete = (itemId) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this item?');
  
    if (isConfirmed) {
      handleDelete(itemId);
    }
  };



  const handleSearch = () => {
    const searchResults = data.filter(item => {
      const name = item.post ? item.post.toLowerCase() : '';
      const email = item.email ? item.email.toLowerCase() : '';
      const phone = item.phone ? item.phone.toLowerCase() : '';
  
      return (
        name.includes(searchInput.toLowerCase()) ||
        email.includes(searchInput.toLowerCase()) ||
        phone.includes(searchInput.toLowerCase())
      );
    });
  
    setSearchResults(searchResults);
  };
  useEffect(() => {
    handleSearch();
  }, [searchInput]);
  

  const handleSort = () => {
    const sortedData = [...data];
    if (sortOrder === 'asc') {
      sortedData.sort((a, b) => a.id - b.id);
      setSortOrder('desc');
    } else {
      sortedData.sort((a, b) => b.id - a.id);
      setSortOrder('asc');
    }
    setData(sortedData);
  };



  return (
    <div className="home-page">
 
    <div>
        <input
          type="text"
          placeholder="Search by name, email, or phone"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
       
      </div>
    {deleteStatus.type && (
        <div className={deleteStatus.type === 'success' ? 'success-message' : 'error-message'}>
          {deleteStatus.message}
        </div>
      )}
    {data.length > 0 ? (
     
      <table>
        <thead>
          <tr>
            {/* <th>ID</th> */}
            {/* <th onClick={handleSort}>ID</th> */}
            <th onClick={handleSort}>
                ID{' '}
                {sortOrder === 'asc' ? (
                  <span>&uarr;</span> // Arrow up for ascending
                ) : (
                  <span>&darr;</span> // Arrow down for descending
                )}
              </th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Update</th>
            <th>Delete</th>
          </tr>
        </thead>
       
        {searchResults.length > 0 ? (
  <tbody>
    {searchResults.map(item => (
      <tr key={item.id}>
        <td>{item.id}</td>
        <td>{item.post}</td>
        <td>{item.email}</td>
        <td>{item.phone}</td>
        <td>
          <Link to={`/update/${item.id}`}>Update</Link>
        </td>
        <td>
          <button onClick={() => confirmDelete(item.id)}>Delete</button>
        </td>
      </tr>
    ))}
  </tbody>
) : (

  <tbody>
    {data.map(item => (
      <tr key={item.id}>
        <td>{item.id}</td>
        <td>{item.post}</td>
        <td>{item.email}</td>
        <td>{item.phone}</td>
        <td>
          <Link to={`/update/${item.id}`}>Update</Link>
        </td>
        <td>
          <button onClick={() => confirmDelete(item.id)}>Delete</button>
        </td>
      </tr>
    ))}
  </tbody>
)}

      </table>
     
    ) : (
      <p>No Data Available</p>
    )}

   
    </div>
  );
  
}


function Update() {
  const { id } = useParams();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://techkshetra.ai/attendance_web/index.php/CrudApi/update?id=${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
      
        const responseData = await response.json();
        console.log('Fetched data:', responseData.data);

        
        setName(responseData.data.post);
        setEmail(responseData.data.email);
        setPhone(responseData.data.phone);
         
        } else if (response.status === 400) {
          const errorData = await response.json();
          console.error('Bad Request:', errorData.message);
        } else {
          throw new Error("Some error occurred while fetching details");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData(); 
    const storedName = localStorage.getItem('name');
    const storedEmail = localStorage.getItem('email');
    const storedPhone = localStorage.getItem('phone');

    if (storedName) setName(storedName);
    if (storedEmail) setEmail(storedEmail);
    if (storedPhone) setPhone(storedPhone);
  }, [id]);
 


  useEffect(() => {
    console.log('Updated :', { name, email, phone });
  
   
  }, [id, name, email, phone]);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    try {
      let requestBody = {
        id:id,
        post: name,
        email: email,
        phone: phone,
      };
   
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      };
      console.log('new1',requestBody);
      fetch(`https://techkshetra.ai/attendance_web/index.php/CrudApi/update_data`, requestOptions)
        .then(response => {
          console.log("API Response:", response);
          if (response.status === 200) {
            return response.json();
          } else {
            throw new Error("Some error occurred");
          }
        })
        .then(data => {
         console.log('updated');
         setMessage("updated successfully");
        })
        .catch(error => {
          console.error("Error:", error);
          console.log('error occured ');
          setMessage("Error Updating");
        });
    } catch (err) {
      console.log(err);
    }
  };
  

  return (
    <div key={id} className="App">
      <form onSubmit={handleFormSubmit}>
        <h3>Update Page</h3>

        <label>
          Name:
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <br />
        <label>
          Phone:
          <input
            type="text"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </label>
        <br />
        {/* <Link to="/home">Home Page</Link> */}

        <button type="submit">Update</button>
        <div className="message">{message ? <p>{message}</p> : null}</div>
      </form>
    </div>
  );
}





function AddPage() {
  // Your existing AddPage component code goes here
  const [post, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isValid, setIsValid] = useState(true);

  const validateName = () => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!post.match(nameRegex)) {
      setMessage("Name should contain only characters.");
      setIsValid(false);
    } else {
      setMessage("");
      setIsValid(true);
    }
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.match(emailRegex)) {
      setMessage("Invalid email format.");
      setIsValid(false);
    } else {
      setMessage("");
      setIsValid(true);
    }
  };

  const validatePhone = () => {
    const phoneRegex = /^\d{10}$/;
    if (!phone.match(phoneRegex)) {
      setMessage("Phone number should contain 10 digits.");
      setIsValid(false);
    } else {
      setMessage("");
      setIsValid(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    validateName();
    validateEmail();
    validatePhone();

    if (!isValid) {
      // If any validation fails, do not submit the form
      return;
    }

    try {
      console.log("Post:", post);

      let requestBody = {
        post: post,
        email: email,
        phone: phone,
      };

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      };

      fetch('https://techkshetra.ai/attendance_web/index.php/CrudApi/post', requestOptions)
        .then(response => {
          console.log("API Response:", response);
          if (response.status === 200) {
            return response.json();
          } else {
            throw new Error("Some error occurred");
          }
        })
        .then(data => {
          setName("");
          setEmail("");
          setPhone("");
          setMessage("User created successfully");
        })
        .catch(error => {
          console.error("Error:", error);
          setMessage("Some error occurred");
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    
    <div className="App">
     
    
      <form onSubmit={handleSubmit}>
      {/* <Link to="/home">Home Page</Link> */}
    
        <input
          type="text"
          value={post}
          placeholder="Enter Name"
          onChange={(e) => setName(e.target.value)}
          onBlur={validateName}
          required/>
        <input
          type="text"
          value={email}
          placeholder="Enter Email"
          onChange={(e) => setEmail(e.target.value)}
          onBlur={validateEmail}
          required/>
        <input
          type="text"
          value={phone}
          placeholder="Enter Phone no"
          onChange={(e) => setPhone(e.target.value)}
          onBlur={validatePhone}
          required/>
        <button type="submit">Create</button>
        <div className="message">{message ? <p>{message}</p> : null}</div>
      </form>
    </div>
  );
}

function Login() {
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);



  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { uname, pass } = event.target.elements;
  
    try {
      const response = await fetch('https://techkshetra.ai/attendance_web/index.php/CrudApi/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: uname.value, password: pass.value }),
      });
  
      if (response.status === 200) {
        const responseData = await response.json();
        console.log(uname.value);
        console.log(responseData.status);
        if (responseData.status === 'success') {
          setIsSubmitted(true);
        
          console.log(responseData.status);
          navigate('/dashboard');
        } else {
          setErrorMessages({ name: 'general', message: 'Invalid credentials' });
        }
      } else {
        setErrorMessages({ name: 'general', message: 'Some error occurred' });
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessages({ name: 'general', message: 'Some error occurred' });
    }
  };
  
  const renderErrorMessage = (name) =>
    name === errorMessages.name && <div className="error">{errorMessages.message}</div>;

  const renderForm = (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label>Email ID</label>
          <input type="text" name="uname" placeholder="Enter email"required />
          {renderErrorMessage('uname')}
        </div>
        <div className="input-container">
          <label>Password </label>
          <input type="password" name="pass" placeholder="Enter password" required />
          {renderErrorMessage('pass')}
        </div>
        <div className="button-container">
          <input type="submit" />
        </div>
      </form>
    </div>
  );

  return (
    <div className="app">
      <div className="login-form">
        <div className="title">Sign In</div>
        {isSubmitted ? (
          <div>User is successfully logged in</div>
        ) : (
          <>
            {renderForm}
            {renderErrorMessage('general')}
          </>
        )}
      </div>
      
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
    
        <Routes>
        <Route path="/login" element={<Login />} />
          
          {/* <Route path="/add" element={<AddPage />} /> */}
          <Route path="/add" element={<><Dashboard /><AddPage /></>} />
          <Route path="/" element={<><Dashboard /><Home /></>} />
          <Route path="/update/:id" element={<><Dashboard /><Update /></>} />
          <Route path="/dashboard" element={<Dashboard />} />
         
        </Routes>
      </div>
    </Router>
  );
}



export default App;
