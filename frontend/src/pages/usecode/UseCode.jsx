import { useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./usecode.css";

const UseCode = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleUseCode = async () => {
    if (!code.trim()) {
      setError("Enter a code.");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3000/pack/pro/${code}`, {withCredentials: true});


      if (response.data && !response.data[0].isUsed) {
        navigate(`/promo-code/${code}`);
      } else {
        setError("Invalid or used code.");
      }
    } catch (err) {
      setError("Invalid code");
    }
  };

  return (
    <>
      <Navbar />
      <div className="use-code-container">
        <h2>Enter promotion code</h2>
        <input
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError(""); 
          }}
          placeholder="Type your code..."
        />
        <button onClick={handleUseCode}>Use code</button>
        {error && <p className="error-message">{error}</p>}
      </div>
    </>
  );
};

export default UseCode;
