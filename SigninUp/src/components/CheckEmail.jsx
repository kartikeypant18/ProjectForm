"use client";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
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
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";

export default function CheckEmail() {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const navigate = useNavigate(); // Initialize navigate

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Check if the email exists in the database and send reset link
      const response = await axios.post(
        "http://localhost:5000/api/check-email",
        { email }
      );

      if (response.data.exists) {
        // Show success toast
        toast({
          title: "Email Sent.",
          description: "A reset link has been sent to your email.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        // Redirect to home page after 3 seconds
        setTimeout(() => {
          navigate("/"); // Redirect to home
        }, 3000);
      } else {
        toast({
          title: "Email not found.",
          description: "Please enter a valid email.",
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
    <Flex minH={"100vh"} justify={"center"}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Confirm Your Email
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <form onSubmit={handleSubmit}>
            <FormControl id="email" mb={4}>
              <FormLabel>Email</FormLabel>
              <Input type="email" value={email} onChange={handleChange} />
            </FormControl>
            <Button type="submit" colorScheme="teal" size="lg" width="full">
              Submit
            </Button>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
}
