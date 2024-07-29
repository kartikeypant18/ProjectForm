import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBRadio,
  MDBCheckbox,
} from "mdb-react-ui-kit";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country_code: "",
    mobile_number: "",
    gender: "",
    country_id: "",
    state_id: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    country_code: "",
    mobile_number: "",
    gender: "",
    country_id: "",
    state_id: "",
    password: "",
    confirmPassword: "",
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/country")
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
      });
  }, []);

  useEffect(() => {
    if (formData.country_id) {
      axios
        .get(
          `http://localhost:5000/api/states?country_id=${formData.country_id}`
        )
        .then((response) => {
          setStates(response.data);
        })
        .catch((error) => {
          console.error("Error fetching states:", error);
        });
    }
  }, [formData.country_id]);

  const validate = (name, value) => {
    let error = "";
    switch (name) {
      case "name":
        if (!value) error = "Name is required";
        break;
      case "email":
        if (!value) error = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(value)) error = "Email is invalid";
        break;
      case "country_code":
        if (!value) error = "Country code is required";
        break;
      case "mobile_number":
        if (!value) error = "Mobile number is required";
        else if (!/^\d{10}$/.test(value)) error = "Mobile number is invalid";
        break;
      case "gender":
        if (!value) error = "Gender is required";
        break;
      case "country_id":
        if (!value) error = "Country is required";
        break;
      case "state_id":
        if (!value) error = "State is required";
        break;
      case "password":
        if (!value) error = "Password is required";
        else if (value.length < 8 || value.length > 18)
          error = "Password must be between 8 to 18 characters";
        else if (!/[A-Z]/.test(value))
          error = "Password must contain at least one uppercase letter";
        else if (!/[0-9]/.test(value))
          error = "Password must contain at least one number";
        else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value))
          error = "Password must contain at least one special character";
        break;
      case "confirmPassword":
        if (!value) error = "Confirm password is required";
        else if (value !== formData.password) error = "Passwords do not match";
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    validate(name, value);
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let isValid = true;
    Object.keys(formData).forEach((key) => {
      validate(key, formData[key]);
      if (errors[key]) isValid = false;
    });

    if (!isChecked) {
      alert("You must agree to the terms and conditions");
      isValid = false;
    }

    if (isValid) {
      axios
        .post("http://localhost:5000/api/register", formData)
        .then((response) => {
          alert("Student registered successfully");
        })
        .catch((error) => {
          console.error("There was an error registering the student!", error);
        });
    }
  };

  return (
    <MDBContainer
      fluid
      className="bg-dark"
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        backgroundColor: "#121212",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1000px",
          backgroundColor: "#333",
          borderRadius: "8px",
          display: "flex",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <MDBCard
          className="my-4"
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            backgroundColor: "white",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <MDBCardImage
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/img4.webp"
            alt="Sample photo"
            className="rounded-start"
            fluid
            style={{
              width: "100%",
              objectFit: "cover",
              height: "auto",
            }}
          />

          <MDBCardBody
            className="text-black d-flex flex-column justify-content-center"
            style={{
              padding: "30px",
              width: "60%",
              fontFamily: "'Roboto', sans-serif",
            }}
          >
            <h3
              className="mb-5 text-uppercase fw-bold"
              style={{ fontSize: "24px", fontWeight: "700" }}
            >
              Registration form
            </h3>

            <form onSubmit={handleSubmit}>
              <MDBInput
                wrapperClass="mb-4"
                placeholder="Name"
                size="lg"
                id="form1"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={{
                  marginBottom: "20px",
                  fontWeight: "500",
                  borderColor: errors.name
                    ? "red"
                    : formData.name
                    ? "green"
                    : "black",
                }}
              />
              {errors.name && (
                <div style={{ color: "red", marginBottom: "20px" }}>
                  {errors.name}
                </div>
              )}
              <MDBInput
                wrapperClass="mb-4"
                placeholder="Email"
                size="lg"
                id="form2"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{
                  marginBottom: "20px",
                  fontWeight: "500",
                  borderColor: errors.email
                    ? "red"
                    : formData.email
                    ? "green"
                    : "black",
                }}
              />
              {errors.email && (
                <div style={{ color: "red", marginBottom: "20px" }}>
                  {errors.email}
                </div>
              )}
              <MDBRow
                style={{
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <MDBCol md="4">
                  <select
                    className="form-select"
                    size="lg"
                    aria-label="Country Code"
                    name="country_code"
                    value={formData.country_code}
                    onChange={handleChange}
                    style={{
                      marginBottom: "0",
                      fontWeight: "500",
                      marginRight: "10px",
                      borderColor: errors.country_code
                        ? "red"
                        : formData.country_code
                        ? "green"
                        : "black",
                    }}
                  >
                    <option value="">Country Code</option>
                    <option value="1">(+1) USA</option>
                    <option value="44">(+44) GBR</option>
                    <option value="91">(+91) IND</option>
                    <option value="61">(+61) AUS</option>
                    <option value="81">(+81) JPN</option>
                    <option value="49">(+49) DEU</option>
                    <option value="33">(+33) FRA</option>
                    <option value="39">(+39) ITA</option>
                    <option value="86">(+86) CHN</option>
                    <option value="7">(+7) RUS</option>
                    <option value="34">(+34) ESP</option>
                    <option value="55">(+55) BRA</option>
                    <option value="27">(+27) ZAF</option>
                    <option value="82">(+82) KOR</option>
                    <option value="47">(+47) NOR</option>
                    <option value="46">(+46) SWE</option>
                    <option value="31">(+31) NLD</option>
                    <option value="41">(+41) CHE</option>
                    <option value="32">(+32) BEL</option>
                    <option value="52">(+52) MEX</option>
                    <option value="60">(+60) MYS</option>
                    <option value="65">(+65) SGP</option>
                    <option value="48">(+48) POL</option>
                    <option value="30">(+30) GRC</option>
                    <option value="353">(+353) IRL</option>
                    <option value="20">(+20) EGY</option>
                    <option value="51">(+51) PER</option>
                    <option value="66">(+66) THA</option>
                    <option value="63">(+63) PHL</option>
                    <option value="62">(+62) IDN</option>
                    <option value="98">(+98) IRN</option>
                    <option value="92">(+92) PAK</option>
                    <option value="94">(+94) LKA</option>
                    <option value="64">(+64) NZL</option>
                    <option value="58">(+58) VEN</option>
                    <option value="54">(+54) ARG</option>
                    <option value="90">(+90) TUR</option>
                    <option value="977">(+977) NPL</option>
                    <option value="95">(+95) MMR</option>
                    <option value="505">(+505) NIC</option>
                    <option value="56">(+56) CHL</option>
                    <option value="250">(+250) RWA</option>
                    <option value="212">(+212) MAR</option>
                    <option value="216">(+216) TUN</option>
                    <option value="964">(+964) IRQ</option>
                    <option value="973">(+973) BHR</option>
                  </select>
                </MDBCol>
                <MDBCol md="8">
                  <MDBInput
                    wrapperClass="mb-4"
                    placeholder="Mobile Number"
                    size="lg"
                    id="form3"
                    type="text"
                    name="mobile_number"
                    value={formData.mobile_number}
                    onChange={handleChange}
                    style={{
                      marginBottom: "0",
                      fontWeight: "500",
                      borderColor: errors.mobile_number
                        ? "red"
                        : formData.mobile_number
                        ? "green"
                        : "black",
                    }}
                  />
                </MDBCol>
              </MDBRow>
              {errors.country_code && (
                <div style={{ color: "red", marginBottom: "20px" }}>
                  {errors.country_code}
                </div>
              )}
              {errors.mobile_number && (
                <div style={{ color: "red", marginBottom: "20px" }}>
                  {errors.mobile_number}
                </div>
              )}
              <div
                className="d-md-flex justify-content-start align-items-center mb-4"
                style={{ marginBottom: "20px" }}
              >
                <h4
                  className="fw-bold mb-0 me-4"
                  style={{ marginRight: "20px" }}
                >
                  Gender:
                </h4>
                <MDBRadio
                  name="gender"
                  id="male"
                  value="male"
                  label="Male"
                  onChange={handleChange}
                  inline
                  checked={formData.gender === "male"}
                  style={{ marginRight: "20px" }}
                />
                <MDBRadio
                  name="gender"
                  id="female"
                  value="female"
                  label="Female"
                  onChange={handleChange}
                  inline
                  checked={formData.gender === "female"}
                  style={{ marginRight: "20px" }}
                />
                <MDBRadio
                  name="gender"
                  id="other"
                  value="other"
                  label="Other"
                  onChange={handleChange}
                  inline
                  checked={formData.gender === "other"}
                />
              </div>
              {errors.gender && (
                <div style={{ color: "red", marginBottom: "20px" }}>
                  {errors.gender}
                </div>
              )}
              <MDBRow style={{ marginBottom: "20px" }}>
                <MDBCol md="6" className="mb-4">
                  <select
                    className="form-select"
                    size="lg"
                    aria-label="Country"
                    name="country_id"
                    value={formData.country_id}
                    onChange={handleChange}
                    style={{
                      marginBottom: "20px",
                      fontWeight: "500",
                      borderColor: errors.country_id
                        ? "red"
                        : formData.country_id
                        ? "green"
                        : "black",
                    }}
                  >
                    <option value="">Country</option>
                    {countries.map((country) => (
                      <option
                        key={country.country_id}
                        value={country.country_id}
                      >
                        {country.country_name}
                      </option>
                    ))}
                  </select>
                  {errors.country_id && (
                    <div style={{ color: "red", marginBottom: "20px" }}>
                      {errors.country_id}
                    </div>
                  )}
                </MDBCol>
                <MDBCol md="6" className="mb-4">
                  <select
                    className="form-select"
                    size="lg"
                    aria-label="State"
                    name="state_id"
                    value={formData.state_id}
                    onChange={handleChange}
                    disabled={!formData.country_id}
                    style={{
                      marginBottom: "20px",
                      fontWeight: "500",
                      borderColor: errors.state_id
                        ? "red"
                        : formData.state_id
                        ? "green"
                        : "black",
                    }}
                  >
                    <option value="">State</option>
                    {states.map((state) => (
                      <option key={state.state_id} value={state.state_id}>
                        {state.state_name}
                      </option>
                    ))}
                  </select>
                  {errors.state_id && (
                    <div style={{ color: "red", marginBottom: "20px" }}>
                      {errors.state_id}
                    </div>
                  )}
                </MDBCol>
              </MDBRow>
              <MDBInput
                wrapperClass="mb-4"
                placeholder="Password"
                size="lg"
                id="form4"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={{
                  marginBottom: "20px",
                  fontWeight: "500",
                  borderColor: errors.password
                    ? "red"
                    : formData.password
                    ? "green"
                    : "black",
                }}
              />
              {errors.password && (
                <div style={{ color: "red", marginBottom: "20px" }}>
                  {errors.password}
                </div>
              )}
              <MDBInput
                wrapperClass="mb-4"
                placeholder="Confirm Password"
                size="lg"
                id="form5"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={{
                  marginBottom: "20px",
                  fontWeight: "500",
                  borderColor: errors.confirmPassword
                    ? "red"
                    : formData.confirmPassword
                    ? "green"
                    : "black",
                }}
              />
              {errors.confirmPassword && (
                <div style={{ color: "red", marginBottom: "20px" }}>
                  {errors.confirmPassword}
                </div>
              )}
              <div className="d-flex justify-content-start mb-4">
                <MDBCheckbox
                  name="flexCheck"
                  value=""
                  id="flexCheckDefault"
                  label="I do accept the Terms and Conditions"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />
              </div>
              <MDBBtn
                className="mb-4"
                size="lg"
                style={{
                  backgroundColor: "black",
                  fontWeight: "bold",
                  letterSpacing: "1px",
                  padding: "10px 20px",
                  color: "white",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "grey")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "black")}
              >
                Register
              </MDBBtn>
            </form>
          </MDBCardBody>
        </MDBCard>
      </div>
    </MDBContainer>
  );
}

export default App;
