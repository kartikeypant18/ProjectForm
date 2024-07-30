"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
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
    name: "",
    email: "",
    country_code: "",
    mobile_number: "",
    gender: "",
    country_id: "",
    state_id: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    country_code: "",
    mobile_number: "",
    gender: "",
    country_id: "",
    state_id: "",
    password: "",
    confirmPassword: "",
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const toast = useToast();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/country")
      .then((response) => {
        console.log("Fetched countries:", response.data); // Debugging log
        setCountries(response.data);
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
      });
  }, []);

  useEffect(() => {
    if (formData.country_id) {
      axios
        .get(
          `http://localhost:5000/api/states?country_id=${formData.country_id}`
        )
        .then((response) => {
          console.log("Fetched states:", response.data); // Debugging log
          setStates(response.data);
        })
        .catch((error) => {
          console.error("Error fetching states:", error);
        });
    }
  }, [formData.country_id]);

  const validate = (name, value) => {
    let error = "";
    switch (name) {
      case "name":
        if (!value) error = "Name is required";
        break;
      case "email":
        if (!value) error = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(value)) error = "Email is invalid";
        break;
      case "country_code":
        if (!value) error = "Country code is required";
        break;
      case "mobile_number":
        if (!value) error = "Mobile number is required";
        else if (!/^\d{1,15}$/.test(value)) error = "Mobile number is invalid";
        break;
      case "gender":
        if (!value) error = "Gender is required";
        break;
      case "country_id":
        if (!value) error = "Country is required";
        break;
      case "state_id":
        if (!value) error = "State is required";
        break;
      case "password":
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
        else if (value !== formData.password) error = "Passwords do not match";
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
    validate(name, value);
  };

  const handleGenderChange = (value) => {
    setFormData({
      ...formData,
      gender: value,
    });
    validate("gender", value);
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
      axios
        .post("http://localhost:5000/api/register", formData)
        .then((response) => {
          toast({
            title: "Success",
            description: "Student registered successfully",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        })
        .catch((error) => {
          console.error("There was an error registering the student!", error);
          toast({
            title: "Error",
            description: "There was an error registering the student",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        });
    }
  };

  const getBorderColor = (name) => {
    return errors[name] ? "red" : formData[name] ? "green" : "white";
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
              <FormControl id="name" isInvalid={!!errors.name} mb={4}>
                <FormLabel>Name</FormLabel>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  borderColor={getBorderColor("name")}
                />
                {errors.name && <Text color="red.500">{errors.name}</Text>}
              </FormControl>

              <FormControl id="email" isInvalid={!!errors.email} mb={4}>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  borderColor={getBorderColor("email")}
                />
                {errors.email && <Text color="red.500">{errors.email}</Text>}
              </FormControl>

              <Flex mb={4}>
                <FormControl
                  id="country_code"
                  isInvalid={!!errors.country_code}
                  mr={4}
                >
                  <FormLabel>Country Code</FormLabel>
                  <Select
                    name="country_code"
                    value={formData.country_code}
                    onChange={handleChange}
                    borderColor={getBorderColor("country_code")}
                  >
                    <option value="">Country Code</option>
                    <option value="1">(+1) USA</option>
                    <option value="44">(+44) GBR</option>
                    <option value="91">(+91) IND</option>
                    <option value="61">(+61) AUS</option>
                    <option value="81">(+81) JPN</option>
                    <option value="49">(+49) DEU</option>
                    <option value="33">(+33) FRA</option>
                    <option value="39">(+39) ITA</option>
                    <option value="86">(+86) CHN</option>
                    <option value="7">(+7) RUS</option>
                    <option value="34">(+34) ESP</option>
                    <option value="55">(+55) BRA</option>
                    <option value="27">(+27) ZAF</option>
                    <option value="82">(+82) KOR</option>
                    <option value="31">(+31) NLD</option>
                    <option value="46">(+46) SWE</option>
                    <option value="41">(+41) CHE</option>
                    <option value="52">(+52) MEX</option>
                    <option value="65">(+65) SGP</option>
                    <option value="60">(+60) MYS</option>
                    <option value="32">(+32) BEL</option>
                    <option value="47">(+47) NOR</option>
                    <option value="48">(+48) POL</option>
                    <option value="45">(+45) DNK</option>
                    <option value="20">(+20) EGY</option>
                    <option value="66">(+66) THA</option>
                    <option value="63">(+63) PHL</option>
                    <option value="90">(+90) TUR</option>
                    <option value="62">(+62) IDN</option>
                    <option value="58">(+58) VEN</option>
                    <option value="92">(+92) PAK</option>
                    <option value="98">(+98) IRN</option>
                    <option value="234">(+234) NGA</option>
                    <option value="250">(+250) RWA</option>
                    <option value="256">(+256) UGA</option>
                    <option value="254">(+254) KEN</option>
                    <option value="64">(+64) NZL</option>
                    <option value="36">(+36) HUN</option>
                    <option value="48">(+48) POL</option>
                    <option value="43">(+43) AUT</option>
                    <option value="51">(+51) PER</option>
                    <option value="53">(+53) CUB</option>
                    <option value="56">(+56) CHL</option>
                    <option value="58">(+58) VEN</option>
                    <option value="57">(+57) COL</option>
                    <option value="354">(+354) ISL</option>
                  </Select>
                  {errors.country_code && (
                    <Text color="red.500">{errors.country_code}</Text>
                  )}
                </FormControl>

                <FormControl
                  id="mobile_number"
                  isInvalid={!!errors.mobile_number}
                >
                  <FormLabel>Mobile Number</FormLabel>
                  <Input
                    type="text"
                    name="mobile_number"
                    value={formData.mobile_number}
                    onChange={handleChange}
                    borderColor={getBorderColor("mobile_number")}
                  />
                  {errors.mobile_number && (
                    <Text color="red.500">{errors.mobile_number}</Text>
                  )}
                </FormControl>
              </Flex>

              <FormControl id="gender" isInvalid={!!errors.gender} mb={4}>
                <FormLabel>Gender</FormLabel>
                <RadioGroup
                  name="gender"
                  value={formData.gender}
                  onChange={handleGenderChange}
                >
                  <Stack direction="row">
                    <Radio value="male" borderColor={getBorderColor("gender")}>
                      Male
                    </Radio>
                    <Radio
                      value="female"
                      borderColor={getBorderColor("gender")}
                    >
                      Female
                    </Radio>
                  </Stack>
                </RadioGroup>
                {errors.gender && <Text color="red.500">{errors.gender}</Text>}
              </FormControl>

              <Flex mb={4}>
                <FormControl
                  id="country_id"
                  isInvalid={!!errors.country_id}
                  mr={4}
                >
                  <FormLabel>Country</FormLabel>
                  <Select
                    name="country_id"
                    value={formData.country_id}
                    onChange={handleChange}
                    borderColor={getBorderColor("country_id")}
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option
                        key={country.country_id}
                        value={country.country_id}
                      >
                        {country.country_name}
                      </option>
                    ))}
                  </Select>
                  {errors.country_id && (
                    <Text color="red.500">{errors.country_id}</Text>
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
                    <option value="">Select State</option>
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

              <FormControl id="password" isInvalid={!!errors.password} mb={4}>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  borderColor={getBorderColor("password")}
                />
                {errors.password && (
                  <Text color="red.500">{errors.password}</Text>
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

              <Stack spacing={10}>
                <Checkbox isChecked={isChecked} onChange={handleCheckboxChange}>
                  I agree to the terms and conditions
                </Checkbox>
                <Button
                  type="submit"
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                >
                  Sign up
                </Button>
              </Stack>
            </form>
            <Stack pt={6}>
              <Text align={"center"}>
                Already a user?{" "}
                <Link href="/" color={"blue.400"}>
                  Login
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
