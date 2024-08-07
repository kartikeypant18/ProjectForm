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
  Checkbox,
} from "@chakra-ui/react";

export default function Login() {
  const toast = useToast();
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
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Change the keys here to match your backend
      const loginData = {
        user_email: formData.email,
        user_password: formData.password,
      };

      console.log("Login Data:", loginData); // Log the data being sent

      axios
        .post("http://localhost:5000/api/login", loginData)
        .then((response) => {
          toast({
            title: "Login Successful",
            description: response.data.message,
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          sessionStorage.setItem("token", response.data.token); // Store token in session storage
          window.location.href = "/homepage"; // Redirect to home or dashboard
        })
        .catch((error) => {
          console.error("There was an error logging in!", error);
          if (error.response) {
            console.error("Error response:", error.response.data); // Log the error response
            toast({
              title: "Login Failed",
              description: error.response.data.message || "An error occurred",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          } else {
            console.error("Error:", error.message);
            toast({
              title: "Login Failed",
              description: "An error occurred while trying to log in",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          }
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
                {errors.email && <Text color="red.500">{errors.email}</Text>}
              </FormControl>

              <FormControl id="password" isInvalid={!!errors.password} mb={4}>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <Text color="red.500">{errors.password}</Text>
                )}
              </FormControl>

              <Stack spacing={10}>
                <Stack
                  direction={{ base: "column", sm: "row" }}
                  align={"start"}
                  justify={"space-between"}
                >
                  <Checkbox>Remember me</Checkbox>
                  <Link href="/forgotPassword" color={"blue.400"}>
                    Forgot password?
                  </Link>
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
              <Stack pt={6}>
                <Text align={"center"}>
                  Create a new account?{" "}
                  <Link href="/signUp" color={"blue.400"}>
                    Sign Up
                  </Link>
                </Text>
              </Stack>
            </form>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
