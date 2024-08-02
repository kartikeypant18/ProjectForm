import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  Radio,
  RadioGroup,
  Stack,
  useDisclosure,
  useToast, // Import useToast
} from "@chakra-ui/react";
import axios from "axios";

const AddUserModal = ({ isOpen, onClose }) => {
  const [userData, setUserData] = useState({
    user_name: "",
    user_email: "",
    user_country_code: "",
    user_mobile_number: "",
    user_gender: "",
    country_id: "",
    state_id: "",
    user_password: "",
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [countryCodes] = useState([
    { code: "+1", name: "United States" },
    { code: "+91", name: "India" },
    { code: "+44", name: "United Kingdom" },
    // Add more country codes as needed
  ]);

  const toast = useToast(); // Initialize useToast

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/country");
        setCountries(response.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    if (userData.country_id) {
      const fetchStates = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/states?country_id=${userData.country_id}`
          );
          setStates(response.data);
        } catch (error) {
          console.error("Error fetching states:", error);
        }
      };
      fetchStates();
    }
  }, [userData.country_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleGenderChange = (value) => {
    setUserData((prevData) => ({ ...prevData, user_gender: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/signup",
        userData
      );
      console.log("User added successfully:", response.data);

      // Show success toast
      toast({
        title: "User Added",
        description: "User has been added successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Reset form and close modal
      setUserData({
        user_name: "",
        user_email: "",
        user_country_code: "",
        user_mobile_number: "",
        user_gender: "",
        country_id: "",
        state_id: "",
        user_password: "",
      });
      onClose();
    } catch (error) {
      console.error("Error adding user:", error);
      toast({
        title: "Error",
        description: "There was an error adding the user.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New User</ModalHeader>
        <ModalBody>
          <Input
            placeholder="User Name"
            name="user_name"
            value={userData.user_name}
            onChange={handleChange}
            mb={3}
          />
          <Input
            placeholder="User Email"
            name="user_email"
            value={userData.user_email}
            onChange={handleChange}
            mb={3}
          />
          <Select
            placeholder="Select Country Code"
            name="user_country_code"
            value={userData.user_country_code}
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
          <Input
            placeholder="User Mobile Number"
            name="user_mobile_number"
            value={userData.user_mobile_number}
            onChange={handleChange}
            mb={3}
          />
          <RadioGroup
            onChange={handleGenderChange}
            value={userData.user_gender}
            mb={3}
          >
            <Stack direction="row">
              <Radio value="male">Male</Radio>
              <Radio value="female">Female</Radio>
              <Radio value="other">Other</Radio>
            </Stack>
          </RadioGroup>
          <Select
            placeholder="Select Country"
            name="country_id"
            value={userData.country_id}
            onChange={handleChange}
            mb={3}
          >
            {countries.map((country) => (
              <option key={country.country_id} value={country.country_id}>
                {country.country_name}
              </option>
            ))}
          </Select>
          <Select
            placeholder="Select State"
            name="state_id"
            value={userData.state_id}
            onChange={handleChange}
            mb={3}
          >
            {states.map((state) => (
              <option key={state.state_id} value={state.state_id}>
                {state.state_name}
              </option>
            ))}
          </Select>
          <Input
            placeholder="User Password"
            name="user_password"
            type="password"
            value={userData.user_password}
            onChange={handleChange}
            mb={3}
          />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleSubmit}>
            Add User
          </Button>
          <Button onClick={onClose} ml={3}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddUserModal;
