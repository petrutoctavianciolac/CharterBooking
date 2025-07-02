import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../components/AuthContext";
import axios from "axios"
import "./checkin.css";

const CheckIn = () => {

  const { passagers, id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [checkinError, setCheckinError] = useState("");
  const authData = useContext(AuthContext);
  const numPassengers = parseInt(passagers) || 0;
  const [forms, setForms] = useState([]);

  useEffect(() => {
    const initialForms = Array.from({ length: numPassengers }, () => ({
      name: "",
      personal_id: "",
      gender: "",
      birthdate: "",
      baggage: "Carry-on",
      additional_price: 0
    }));
    setForms(initialForms);
  }, [numPassengers]);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    setForms((prev) =>
        prev.map((form, i) =>
        i === index ? { ...form, [name]: value } : form
        )
    );
    };

    const makeCheckin = async () => {
    try {
        const updatedForms = forms.map((form) => {
        let additional_price = 0;
        if (form.baggage === "Carry-on + 10KG") additional_price = 8;
        if (form.baggage === "Carry-on + 15KG") additional_price = 11;

        return { ...form, additional_price };
        });

        const hasEmptyFields = updatedForms.some((form) =>
        !form.name.trim() ||
        !form.personal_id.trim() ||
        !form.gender ||
        !form.birthdate ||
        !form.baggage
        );


        if (hasEmptyFields) {
        
        setCheckinError("All fields are mandatory.");
        return;
        }

        setForms(updatedForms);

        const response = await axios.put(
        `http://localhost:3000/bookedflights/${id}/add-passengers`,
        {
            passagers: updatedForms
        },
        { withCredentials: true }
        );

        if (response.status === 200) {
        navigate(`/me/activereservations/${id}`);
        }
    } catch (e) {
        console.error(e);
        setCheckinError("Something went wrong. Please try again.");
    }
    };


  if(error) return(<p className="error-message">{error}</p>)

  return (
    <div className="checkin-container">
      <h2>Add Passengers</h2>
        {forms.map((form, index) => (
        <div className="passenger-form" key={index}>
            <div className="form-group">
            <label>Name</label>
            <input
                type="text"
                placeholder="Full Name"
                name="name"
                value={form.name}
                onChange={(e) => handleChange(index, e)}
            />
            </div>
            <div className="form-group">
            <label>Personal ID</label>
            <input
                type="text"
                placeholder="Personal ID"
                name="personal_id"
                value={form.personal_id}
                onChange={(e) => handleChange(index, e)}
            />
            </div>
            <div className="form-group">
            <label>Gender</label>
            <select
                name="gender"
                value={form.gender}
                onChange={(e) => handleChange(index, e)}
            >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
            </select>
            </div>
            <div className="form-group">
            <label>Birthdate</label>
            <input
                type="date"
                name="birthdate"
                value={form.birthdate}
                max={new Date().toISOString().split("T")[0]}
                onChange={(e) => handleChange(index, e)}
            />
            </div>
            <div className="form-group">
            <label>Baggage</label>
            <select
                name="baggage"
                value={form.baggage}
                onChange={(e) => handleChange(index, e)}
            >
                <option value="Carry-on">Carry-on</option>
                <option value="Carry-on + 10KG">Carry-on + 10KG</option>
                <option value="Carry-on + 15KG">Carry-on + 15KG</option>
            </select>
            </div>
        </div>
        ))}
      <button className="submit-checkin-btn" onClick={() => {makeCheckin();}}>Submit</button>
      {checkinError && <p class="error-message">{checkinError}</p>}
    </div>
  );
};

export default CheckIn;
