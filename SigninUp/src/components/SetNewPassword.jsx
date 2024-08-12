import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";

const SetNewPassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    const token = sessionStorage.getItem("token"); // Retrieve token from session storage

    if (!token) {
      setError("No authentication token found.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/setnewpassword",
        { oldPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setSuccess("Password updated successfully!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(response.data.message || "Password update failed.");
      }
    } catch (error) {
      console.error("Error details:", error);
      setError("An error occurred while updating the password.");
    }
  };

  return (
    <Box
      width={{ base: "100%", md: "500px" }} // Responsive width
      mx="auto" // Center horizontally
      my="4rem" // Margin top and bottom
      p="6"
      borderRadius="md"
      boxShadow="lg"
      bg="gray.50"
    >
      <Heading as="h1" size="lg" mb="4" textAlign="center">
        Change Password
      </Heading>
      {error && (
        <Text color="red.500" textAlign="center" mb="4">
          {error}
        </Text>
      )}
      {success && (
        <Text color="green.500" textAlign="center" mb="4">
          {success}
        </Text>
      )}
      <form onSubmit={handleSubmit}>
        <VStack spacing="4" align="stretch">
          <FormControl id="oldPassword" isRequired>
            <FormLabel>Old Password:</FormLabel>
            <Input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </FormControl>
          <FormControl id="newPassword" isRequired>
            <FormLabel>New Password:</FormLabel>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </FormControl>
          <FormControl id="confirmPassword" isRequired>
            <FormLabel>Confirm New Password:</FormLabel>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </FormControl>
          <Button type="submit" colorScheme="blue" size="lg" mt="4">
            Submit
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default SetNewPassword;
