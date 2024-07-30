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
  Text,
  useColorModeValue,
  Link,
  useToast,
  Checkbox, // Import useToast
} from "@chakra-ui/react";

export default function Login() {
  const toast = useToast(); // Initialize toast
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!errors.email && !errors.password) {
      axios
        .post("http://localhost:5000/api/login", formData)
        .then((response) => {
          toast({
            title: "Login Successful",
            description: response.data.message,
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          // Handle successful login (e.g., redirect, store user data, etc.)
        })
        .catch((error) => {
          console.error("There was an error logging in!", error);
          toast({
            title: "Login Failed",
            description: error.response?.data?.message || "An error occurred",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
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
            Login
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
              <FormControl id="email" isInvalid={!!errors.email}>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  mb={4}
                />
              </FormControl>

              <FormControl id="password" isInvalid={!!errors.password} mb={4}>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </FormControl>
              <Stack spacing={10}>
                <Stack
                  direction={{ base: "column", sm: "row" }}
                  align={"start"}
                  justify={"space-between"}
                >
                  <Checkbox>Remember me</Checkbox>
                  <Link color={"blue.400"}>Forgot password?</Link>
                </Stack>
              </Stack>
              <Button
                type="submit"
                colorScheme="teal"
                size="lg"
                width="full"
                style={{ marginTop: "1rem" }}
              >
                Login
              </Button>
            </form>
            <Stack pt={6}>
              <Text align={"center"}>
                Create a new account?{" "}
                <Link href="/signUp" color={"blue.400"}>
                  Sign Up
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
