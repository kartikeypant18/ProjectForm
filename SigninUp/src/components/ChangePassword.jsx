import React, { useState } from "react";
import { useSearchParams } from "react-router-dom"; // For extracting query parameters
import axios from "axios";
import {
  Flex,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";

export default function ChangePassword() {
  const [searchParams] = useSearchParams(); // React Router hook for reading query params
  const token = searchParams.get("token"); // Extract the token from the URL
  const toast = useToast();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match.",
        description: "Please make sure both passwords are the same.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/changepassword",
        { newPassword: password, token } // Change password to newPassword
      );

      if (response.data.success) {
        toast({
          title: "Password updated.",
          description: "Your password has been updated successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setTimeout(() => {
          window.location.href = "/"; // Redirect to login page
        }, 2000);
      } else {
        toast({
          title: "Error.",
          description: "Failed to update password. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error.",
        description: "An error occurred. Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      minH={"100vh"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack
        spacing={8}
        mx={"auto"}
        maxW={"lg"}
        py={12}
        px={6}
        style={{ width: "441px" }}
      >
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Create New Password
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack>
            <form onSubmit={handleSubmit}>
              <FormControl id="password" mb={4}>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required // Add required attribute for better UX
                />
              </FormControl>

              <FormControl id="confirmPassword" mb={4}>
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required // Add required attribute for better UX
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="teal"
                size="lg"
                width="full"
                style={{ marginTop: "1rem" }}
              >
                Submit
              </Button>
            </form>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
