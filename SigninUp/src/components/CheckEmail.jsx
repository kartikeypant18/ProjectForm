// CheckEmail.jsx
"use client";
import React, { useState } from "react";
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

export default function CheckEmail({ onEmailConfirmed }) {
  const toast = useToast();
  const [email, setEmail] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Check if the email exists in the database
      const response = await axios.post(
        "http://localhost:5000/api/checkEmail",
        { email }
      );

      if (response.data.exists) {
        onEmailConfirmed(email); // Call the function to confirm the email
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
