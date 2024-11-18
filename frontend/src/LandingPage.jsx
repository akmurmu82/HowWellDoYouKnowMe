import { Box, Button, Center, Container, Fieldset, Heading, HStack, IconButton, Image, Input, Spinner, Stack, Text, VStack } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Field } from './components/ui/field';
import {
    NativeSelectField,
    NativeSelectRoot,
} from "./components/ui/native-select"
import heroImage from './assets/hero-image.gif';
import { useEffect, useState } from 'react';
import { Toaster, toaster } from "./components/ui/toaster"
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { InputGroup } from './components/ui/input-group';
import { FaRegEye } from "react-icons/fa";
const beBaseUrl = import.meta.env.VITE_BE_BASE_URL;

function LandingPage() {
    let currentUser = JSON.parse(localStorage.getItem("currentUser")) || { name: "", profilePic: "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Image.png" }
    console.log(currentUser, Boolean(currentUser.name))
    const navigate = useNavigate()
    const [isLoading, setLoading] = useState(false)
    // const [passwordVisible, setPasswordVisible] = useState(false)
    const [formData, setFormData] = useState(currentUser)
    const [formSubmitted, setFormSubmitted] = useState(false)

    useEffect(() => {
        const fetchUpdatedUser = async (name) => {
            try {
                const res = await axios.post(`${beBaseUrl}/register`, { name })
                console.log("updated user:", res.data.user)
                localStorage.setItem("currentUser", JSON.stringify(res.data.user))
            } catch (error) {
                console.log(error)
            }
        }
        // If user account exist in the device, then try to fetch updated user
        { currentUser.name ? fetchUpdatedUser(currentUser.name) : null }
    }, [])

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async () => {
        setFormSubmitted(true)
        if (!formData.name) return
        try {
            setLoading(true)
            console.log("formData:", formData)
            // console.log(beBaseUrl)
            const res = await axios.post(`${beBaseUrl}/register`, formData)
            setLoading(false)
            console.log(res.data)
            localStorage.setItem("currentUser", JSON.stringify(res.data.user))
            toaster.create({
                title: "Ho gya",
                description: "Thanks for registering.",
                duration: 2000,
            })
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }

    const handleLogOut = () => {
        localStorage.clear()
        console.log("logged out!")
        navigate("/")
    }

    return (
        <>
            <Navbar title="HOME" currentUser={currentUser} />
            <Toaster />
            {/* Content Section */}
            <Container maxW="container.md" mt={20} p={5} borderRadius="lg" boxShadow="md">
                <VStack spacing={4} align="center">
                    {/* Hero Image */}
                    <Image
                        src={heroImage}
                        borderRadius="md"
                        boxShadow="lg"
                        maxW="100%"
                        maxH="300px"
                        objectFit="cover"
                    />

                    {/* Description */}
                    <Box textAlign="center" >
                        <Heading fontSize="2xl" color="yellow.500" mb={3}>
                            <Text color="#fff">Welcome to</Text>
                            <Text size="sm">&ldquo;How Well Do You Know Me?&ldquo;</Text>
                        </Heading>
                        <Text fontSize="lg" color="#fff">
                            The ultimate friend test! Here, I’ll find out who’s been paying attention and who’s just been nodding along. With questions that range from the easy (What’s my favorite snack?) to the downright tricky (What would I save in a fire?), this app is your chance to prove just how well you know me.</Text>
                        <Text mt={4} fontSize="md" color="#fff">
                            Ready to uncover some secrets and share a few laughs? Let’s get started!                        </Text>
                        {/* Form */}
                        <Center mt={6} color={'black'}>
                            {currentUser.name ?
                                <HStack>
                                    {currentUser.credits <= 0 ?
                                        <Button variant="surface" onClick={() => navigate("/leaderboard")}>See Leaderboard</Button> :
                                        <Button variant="surface" onClick={() => navigate("/mcqs")}>Play MCQ</Button>
                                    }
                                    <Button variant="surface" onClick={handleLogOut}>Log out</Button>
                                </HStack> :
                                <Fieldset.Root size="lg" maxW="md">
                                    <Stack>
                                        <Fieldset.Legend>Contact details</Fieldset.Legend>
                                        <Fieldset.HelperText>
                                            Please provide your contact details below.
                                        </Fieldset.HelperText>
                                    </Stack>
                                    <Fieldset.Content color={'#fff'}>
                                        <Field label="Name" value={formData.name} invalid={formSubmitted & !formData.name} errorText="Oye, apna naam dalo yaha!">
                                            <Input variant={"subtle"} name="name" placeholder="Tumhara naam..." onChange={handleChange} />
                                        </Field>
                                        {/* <Field label="Password" value={formData.password} invalid={formSubmitted & !formData.password} errorText="8 Letter ka password!">
                                            <InputGroup flex="1" endElement={<IconButton onClick={() => setPasswordVisible(!passwordVisible)} aria-label="Search database"><FaRegEye /></IconButton>}>
                                                <Input variant={"subtle"} name="password" type={passwordVisible ? "text" : "password"} placeholder="Achcha sa password dalo..." onChange={handleChange} />
                                            </InputGroup>
                                        </Field> */}
                                        <Field label="Relation">
                                            <NativeSelectRoot variant={"subtle"}>
                                                <NativeSelectField name="relation" items={["Sibling", "Friend", "Cousine", "Uncle", "Aunt", "Niece", "Nephew", "Unknown", "Admin"]} value={formData.relation} onChange={handleChange} />
                                            </NativeSelectRoot>
                                        </Field>
                                        <Field label="Email" value={formData.email} invalid={formSubmitted & !formData.email} errorText="Ab ye bhi daal hi do na..">
                                            <Input variant={"subtle"} name="email" placeholder="jaise ki aman@gmail.com" onChange={handleChange} />
                                        </Field>
                                    </Fieldset.Content>
                                    <Button type="submit" onClick={handleSubmit} mt={4} bg="pink" disabled={isLoading}>
                                        {isLoading && <Spinner size="md" />}
                                        Sign In...
                                    </Button>
                                </Fieldset.Root>
                            }
                        </Center>
                        <Box color="#fff">
                            <Text mt={5}>
                                Build by <b>Amit Murmu</b> and designed by <b>Aman Hansda</b> 💚
                            </Text>
                        </Box>
                    </Box>
                </VStack>
            </Container>

        </>
    );
}

LandingPage.propTypes = {
    props: PropTypes.any
};

export default LandingPage;