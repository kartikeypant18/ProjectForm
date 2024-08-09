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
} from "@chakra-ui/react";
import axios from "axios";

const EditUserModal = ({ isOpen, onClose, user, refreshUsers }) => {
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    contact_number: "",
    user_gender: "",
    country: "",
    state: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        user_name: user.user_name,
        user_email: user.user_email,
        contact_number: user.contact_number,
        user_gender: user.user_gender,
        country: user.country,
        state: user.state,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/update/${user.user_id}`,
        formData
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
            />
          </FormControl>
          <FormControl>
            <FormLabel>Contact Number</FormLabel>
            <Input
              name="contact_number"
              value={formData.contact_number}
              onChange={handleChange}
            />
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
