import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  HStack,
} from "@chakra-ui/react";
import axios from "axios";

const EditUserModal = ({ isOpen, onClose, user, refreshUsers }) => {
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    user_country_code: "",
    user_mobile_number: "",
    user_gender: "",
    country: "",
    state: "",
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  useEffect(() => {
    if (user) {
      const [user_country_code, user_mobile_number] =
        user.contact_number.split(" ");
      setFormData({
        user_name: user.user_name,
        user_email: user.user_email,
        user_country_code: `+${user_country_code}`,
        user_mobile_number,
        user_gender: user.user_gender,
        country: user.country,
        state: user.state,
      });
    }
  }, [user]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/country")
      .then((response) => setCountries(response.data))
      .catch((error) => console.error("Failed to fetch countries:", error));
  }, []);

  useEffect(() => {
    if (formData.country) {
      axios
        .get(`http://localhost:5000/api/states?country_id=${formData.country}`)
        .then((response) => setStates(response.data))
        .catch((error) => console.error("Failed to fetch states:", error));
    }
  }, [formData.country]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const contact_number = `${formData.user_country_code} ${formData.user_mobile_number}`;

    const updatedData = { ...formData, contact_number };

    try {
      await axios.put(
        `http://localhost:5000/api/update/${user.user_id}`,
        updatedData
      );
      refreshUsers();
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
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input
              name="user_name"
              value={formData.user_name}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              name="user_email"
              value={formData.user_email}
              onChange={handleChange}
              isDisabled
              borderColor="red.500"
              _disabled={{
                opacity: 1,
                cursor: "not-allowed",
                borderColor: "red.500",
              }}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Contact Number</FormLabel>
            <HStack>
              <Input
                name="user_country_code"
                value={formData.user_country_code}
                onChange={handleChange}
                placeholder="Country Code"
                width="30%"
              />
              <Input
                name="user_mobile_number"
                value={formData.user_mobile_number}
                onChange={handleChange}
                placeholder="Mobile Number"
                width="70%"
              />
            </HStack>
          </FormControl>
          <FormControl>
            <FormLabel>Gender</FormLabel>
            <Input
              name="user_gender"
              value={formData.user_gender}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Country</FormLabel>
            <Input
              name="country"
              value={formData.country}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>State</FormLabel>
            <Input
              name="state"
              value={formData.state}
              onChange={handleChange}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleSubmit}>
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
