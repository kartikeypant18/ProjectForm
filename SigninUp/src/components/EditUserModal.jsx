import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
} from "@chakra-ui/react";

const EditUserModal = ({ isOpen, onClose, user, refreshUsers }) => {
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    user_country_code: "",
    user_mobile_number: "",
    user_gender: "",
    country_id: "",
    state_id: "",
  });
  const [countries, setCountries] = useState([]); // State for countries
  const [states, setStates] = useState([]); // State for states

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/country");
        setCountries(response.data); // Assuming response.data is an array of countries
      } catch (error) {
        console.error("Failed to fetch countries:", error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        user_name: user.user_name,
        user_email: user.user_email,
        user_country_code: user.user_country_code,
        user_mobile_number: user.user_mobile_number,
        user_gender: user.user_gender,
        country_id: user.country_id,
        state_id: user.state_id,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Fetch states when country changes
    if (name === "country_id") {
      fetchStates(value);
    }
  };

  const fetchStates = async (countryId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/states?country_id=${countryId}`
      );
      setStates(response.data); // Assuming response.data is an array of states
      setFormData((prev) => ({ ...prev, state_id: "" })); // Reset state_id when country changes
    } catch (error) {
      console.error("Failed to fetch states:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/edit/${user.user_id}`,
        formData
      );
      refreshUsers(); // Refresh the user list
      onClose();
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit User</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isDisabled>
            <FormLabel>Email</FormLabel>
            <Input
              name="user_email"
              value={formData.user_email}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Country Code</FormLabel>
            <Select
              placeholder="Select Country Code"
              name="user_country_code"
              value={formData.user_country_code}
              onChange={handleChange}
              mb={3}
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
              <option value="31">(+31) NLD</option>
              <option value="46">(+46) SWE</option>
              <option value="41">(+41) CHE</option>
              <option value="52">(+52) MEX</option>
              <option value="65">(+65) SGP</option>
              <option value="60">(+60) MYS</option>
              <option value="32">(+32) BEL</option>
              <option value="47">(+47) NOR</option>
              <option value="48">(+48) POL</option>
              <option value="45">(+45) DNK</option>
              <option value="20">(+20) EGY</option>
              <option value="66">(+66) THA</option>
              <option value="63">(+63) PHL</option>
              <option value="90">(+90) TUR</option>
              <option value="62">(+62) IDN</option>
              <option value="58">(+58) VEN</option>
              <option value="92">(+92) PAK</option>
              <option value="98">(+98) IRN</option>
              <option value="234">(+234) NGA</option>
              <option value="250">(+250) RWA</option>
              <option value="256">(+256) UGA</option>
              <option value="254">(+254) KEN</option>
              <option value="64">(+64) NZL</option>
              <option value="36">(+36) HUN</option>
              <option value="48">(+48) POL</option>
              <option value="43">(+43) AUT</option>
              <option value="51">(+51) PER</option>
              <option value="53">(+53) CUB</option>
              <option value="56">(+56) CHL</option>
              <option value="58">(+58) VEN</option>
              <option value="57">(+57) COL</option>
              <option value="354">(+354) ISL</option>
            </Select>
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Mobile Number</FormLabel>
            <Input
              name="user_mobile_number"
              value={formData.user_mobile_number}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Gender</FormLabel>
            <Select
              name="user_gender"
              value={formData.user_gender}
              onChange={handleChange}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Select>
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Country</FormLabel>
            <Select
              name="country_id"
              value={formData.country_id}
              onChange={handleChange}
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.country_id} value={country.country_id}>
                  {country.country_name}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>State</FormLabel>
            <Select
              name="state_id"
              value={formData.state_id}
              onChange={handleChange}
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state.state_id} value={state.state_id}>
                  {state.state_name}
                </option>
              ))}
            </Select>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Save
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditUserModal;
