"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { debounce } from "lodash";
import {
  Flex,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  Text,
  useColorModeValue,
  Select,
  RadioGroup,
  Radio,
  Center,
  Link,
  useToast,
} from "@chakra-ui/react";

export default function SignUp() {
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    user_country_code: "",
    user_mobile_number: "",
    user_gender: "",
    state_country_id: "", // Corrected from country_id to state_country_id
    state_id: "",
    user_password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const toast = useToast();

  const resetForm = () => {
    setFormData({
      user_name: "",
      user_email: "",
      user_country_code: "",
      user_mobile_number: "",
      user_gender: "",
      state_country_id: "", // Corrected from country_id to state_country_id
      state_id: "",
      user_password: "",
      confirmPassword: "",
    });
    setErrors({});
    setIsChecked(false);
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/countries") // Correct endpoint
      .then((response) => {
        console.log("Fetched countries:", response.data);
        setCountries(response.data);
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
      });
  }, []);

  useEffect(() => {
    if (formData.state_country_id) {
      axios
        .get(
          `http://localhost:5000/api/states?country_id=${formData.state_country_id}`
        ) // Use country_id for state fetching
        .then((response) => {
          console.log("Fetched states:", response.data);
          setStates(response.data);
        })
        .catch((error) => {
          console.error("Error fetching states:", error);
        });
    }
  }, [formData.state_country_id]);

  const validate = (name, value) => {
    let error = "";
    switch (name) {
      case "user_name":
        if (!value) error = "Name is required";
        break;
      case "user_email":
        if (!value) error = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(value)) error = "Email is invalid";
        break;
      case "user_country_code":
        if (!value) error = "Country code is required";
        break;
      case "user_mobile_number":
        if (!value) error = "Mobile number is required";
        else if (!/^\d{1,15}$/.test(value)) error = "Mobile number is invalid";
        break;
      case "user_gender":
        if (!value) error = "Gender is required";
        break;
      case "state_country_id":
        if (!value) error = "Country is required";
        break;
      case "state_id":
        if (!value) error = "State is required";
        break;
      case "user_password":
        if (!value) error = "Password is required";
        else if (value.length < 8 || value.length > 18)
          error = "Password must be between 8 to 18 characters";
        else if (!/[A-Z]/.test(value))
          error = "Password must contain at least one uppercase letter";
        else if (!/[a-z]/.test(value))
          error = "Password must contain at least one lowercase letter";
        else if (!/[0-9]/.test(value))
          error = "Password must contain at least one number";
        else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value))
          error = "Password must contain at least one special character";
        break;
      case "confirmPassword":
        if (!value) error = "Confirm password is required";
        else if (value !== formData.user_password)
          error = "Passwords do not match";
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (name === "user_email") {
      debounceValidateEmail(value);
    } else {
      validate(name, value);
    }
  };

  const debounceValidateEmail = useCallback(
    debounce((value) => {
      validate("user_email", value);
    }, 500),
    []
  );

  const handleGenderChange = (value) => {
    setFormData({
      ...formData,
      user_gender: value,
    });
    validate("user_gender", value);
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let isValid = true;
    Object.keys(formData).forEach((key) => {
      validate(key, formData[key]);
      if (errors[key]) isValid = false;
    });

    if (!isChecked) {
      toast({
        title: "Error",
        description: "You must agree to the terms and conditions",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      isValid = false;
    }

    if (isValid) {
      const { confirmPassword, ...signupData } = formData;
      axios
        .post("http://localhost:5000/api/signup", {
          ...signupData,
          state_country_id: formData.state_country_id, // Ensure this is sent
        })
        .then((response) => {
          toast({
            title: "Success",
            description: "User registered successfully",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          resetForm();
        })
        .catch((error) => {
          console.error("There was an error registering the user!", error);
          toast({
            title: "Error",
            description:
              error.response?.data?.message ||
              "There was an error registering the user",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          resetForm();
        });
    }
  };

  const getBorderColor = (name) => {
    return errors[name] ? "red" : formData[name] ? "green" : "gray.500";
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Sign up
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <form onSubmit={handleSubmit}>
              <FormControl id="user_name" isInvalid={!!errors.user_name} mb={4}>
                <FormLabel>Name</FormLabel>
                <Input
                  type="text"
                  name="user_name"
                  value={formData.user_name}
                  onChange={handleChange}
                  borderColor={getBorderColor("user_name")}
                />
                {errors.user_name && (
                  <Text color="red.500">{errors.user_name}</Text>
                )}
              </FormControl>

              <FormControl
                id="user_email"
                isInvalid={!!errors.user_email}
                mb={4}
              >
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  name="user_email"
                  value={formData.user_email}
                  onChange={handleChange}
                  borderColor={getBorderColor("user_email")}
                />
                {errors.user_email && (
                  <Text color="red.500">{errors.user_email}</Text>
                )}
              </FormControl>

              <Flex mb={4}>
                <FormControl
                  id="user_country_code"
                  isInvalid={!!errors.user_country_code}
                  mr={4}
                >
                  <FormLabel>Country Code</FormLabel>
                  <Select
                    name="user_country_code"
                    value={formData.user_country_code}
                    onChange={handleChange}
                    borderColor={getBorderColor("user_country_code")}
                  >
                    <option value="">Select country code</option>
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
                  {errors.user_country_code && (
                    <Text color="red.500">{errors.user_country_code}</Text>
                  )}
                </FormControl>

                <FormControl
                  id="user_mobile_number"
                  isInvalid={!!errors.user_mobile_number}
                >
                  <FormLabel>Mobile Number</FormLabel>
                  <Input
                    type="text"
                    name="user_mobile_number"
                    value={formData.user_mobile_number}
                    onChange={handleChange}
                    borderColor={getBorderColor("user_mobile_number")}
                  />
                  {errors.user_mobile_number && (
                    <Text color="red.500">{errors.user_mobile_number}</Text>
                  )}
                </FormControl>
              </Flex>

              <FormControl
                id="user_gender"
                isInvalid={!!errors.user_gender}
                mb={4}
              >
                <FormLabel>Gender</FormLabel>
                <RadioGroup
                  name="user_gender"
                  onChange={handleGenderChange}
                  value={formData.user_gender}
                >
                  <Stack spacing={4} direction="row">
                    <Radio value="male">Male</Radio>
                    <Radio value="female">Female</Radio>
                    <Radio value="other">Other</Radio>
                  </Stack>
                </RadioGroup>
                {errors.user_gender && (
                  <Text color="red.500">{errors.user_gender}</Text>
                )}
              </FormControl>

              <Flex mb={4}>
                <FormControl
                  id="state_country_id"
                  isInvalid={!!errors.state_country_id}
                  mr={4}
                >
                  <FormLabel>Country</FormLabel>
                  <Select
                    name="state_country_id"
                    value={formData.state_country_id}
                    onChange={handleChange}
                    borderColor={getBorderColor("state_country_id")}
                  >
                    <option value="">Select a country</option>
                    {countries.map((country) => (
                      <option
                        key={country.country_id}
                        value={country.country_id}
                      >
                        {country.country_name}
                      </option>
                    ))}
                  </Select>
                  {errors.state_country_id && (
                    <Text color="red.500">{errors.state_country_id}</Text>
                  )}
                </FormControl>

                <FormControl id="state_id" isInvalid={!!errors.state_id}>
                  <FormLabel>State</FormLabel>
                  <Select
                    name="state_id"
                    value={formData.state_id}
                    onChange={handleChange}
                    borderColor={getBorderColor("state_id")}
                  >
                    <option value="">Select a state</option>
                    {states.map((state) => (
                      <option key={state.state_id} value={state.state_id}>
                        {state.state_name}
                      </option>
                    ))}
                  </Select>
                  {errors.state_id && (
                    <Text color="red.500">{errors.state_id}</Text>
                  )}
                </FormControl>
              </Flex>

              <FormControl
                id="user_password"
                isInvalid={!!errors.user_password}
                mb={4}
              >
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  name="user_password"
                  value={formData.user_password}
                  onChange={handleChange}
                  borderColor={getBorderColor("user_password")}
                />
                {errors.user_password && (
                  <Text color="red.500">{errors.user_password}</Text>
                )}
              </FormControl>

              <FormControl
                id="confirmPassword"
                isInvalid={!!errors.confirmPassword}
                mb={4}
              >
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  borderColor={getBorderColor("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <Text color="red.500">{errors.confirmPassword}</Text>
                )}
              </FormControl>

              <Checkbox
                isChecked={isChecked}
                onChange={handleCheckboxChange}
                mb={4}
              >
                I agree to the terms and conditions
              </Checkbox>

              <Button
                type="submit"
                colorScheme="teal"
                size="lg"
                width="full"
                style={{ marginTop: "0.2rem" }}
              >
                Sign Up
              </Button>
            </form>
            <Center>
              <Text>
                Already have an account?{" "}
                <Link color="blue.400" href="/">
                  Log in
                </Link>
              </Text>
            </Center>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
