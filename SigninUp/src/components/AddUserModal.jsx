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
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

const AddUserModal = ({ isOpen, onClose }) => {
  const [userData, setUserData] = useState({
    user_name: "",
    user_email: "",
    user_country_code: "",
    user_mobile_number: "",
    user_gender: "",
    state_country_id: "",
    state_id: "",
    user_password: "",
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/countries");
        console.log("Fetched countries:", response.data);
        setCountries(response.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchStates = async () => {
      if (userData.state_country_id) {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/states?country_id=${userData.state_country_id}`
          );
          console.log("Fetched states:", response.data);
          setStates(response.data);
        } catch (error) {
          console.error("Error fetching states:", error);
        }
      } else {
        setStates([]);
      }
    };
    fetchStates();
  }, [userData.state_country_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));

    if (name === "state_country_id") {
      setUserData((prevData) => ({ ...prevData, state_id: "" }));
    }
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

      toast({
        title: "User Added",
        description: "User has been added successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setUserData({
        user_name: "",
        user_email: "",
        user_country_code: "",
        user_mobile_number: "",
        user_gender: "",
        state_country_id: "",
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
            {countries.map((country) => (
              <option
                key={country.country_id}
                value={country.country_phonecode}
              >
                {country.country_shortname} (+
                {country.country_phonecode})
              </option>
            ))}
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
            name="state_country_id"
            value={userData.state_country_id}
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
