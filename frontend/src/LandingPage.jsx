import { Box, Button, Center, Container, Fieldset, Heading, HStack, Image, Input, Spinner, Stack, Text, VStack } from '@chakra-ui/react';
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
const beBaseUrl = import.meta.env.VITE_BE_BASE_URL;

function LandingPage() {
    let currentUser = JSON.parse(localStorage.getItem("currentUser")) || { name: "", profilePic: "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Image.png" }
    // console.log(currentUser)
    const navigate = useNavigate()
    const [isLoading, setLoading] = useState(false)
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
        try {
            setLoading(true)
            console.log("formData:", formData)
            const res = await axios.post(`${beBaseUrl}/register`, formData)
            // console.log(res)
            if (res.status == 201) {
                setLoading(false)
                console.log(res.data)
                localStorage.setItem("currentUser", JSON.stringify(res.data.user))
                toaster.create({
                    title: "Ho gya",
                    description: "Thanks for registering.",
                    duration: 2000,
                    onStatusChange({ status }) {
                        if (status === "unmounted") navigate("/mcqs")
                    },
                })
            }
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
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
                        <Heading fontSize="2xl" color="pink.500" mb={3}>
                            Welcome to My World
                        </Heading>
                        <Text fontSize="lg" color="#fff">
                            Life’s simple pleasures hold a special magic—like the first sip of{" "}
                            <Text as="span" fontWeight="bold">freshly brewed coffee</Text>, the{" "}
                            <Text as="span" fontWeight="bold">tap of rain</Text> on the window with a{" "}
                            <Text as="span" fontWeight="bold">good mystery novel</Text>, the thrill of an{" "}
                            <Text as="span" fontWeight="bold">epic road trip</Text>, or{" "}
                            <Text as="span" fontWeight="bold">cozy rainy days</Text>. These little favorites brighten my world.
                        </Text>

                        <Text mt={4} fontSize="md" color="#fff">
                            But can you guess them all? Take the quiz and see how well you know me!
                        </Text>
                        {/* Form */}
                        <Center mt={6} color={'black'}>
                            {currentUser.name ?
                                <HStack>
                                    {currentUser.credits <= 0 ?
                                        <Button variant="surface" onClick={()=> navigate("/leaderboard")}>See Leaderboard</Button> :
                                        <Button variant="surface" onClick={()=> navigate("/mcqs")}>Play MCQ</Button>
                                    }
                                    <Button variant="surface">Log out</Button>
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
                                            <Input name="name" placeholder="Aman" onChange={handleChange} />
                                        </Field>
                                        <Field label="Relation">
                                            <NativeSelectRoot>
                                                <NativeSelectField name="relation" items={["Sibling", "Friend", "Cousine", "Uncle", "Aunt", "Niece", "Nephew", "Unknown"]} value={formData.relation} onChange={handleChange} />
                                            </NativeSelectRoot>
                                        </Field>
                                        <Field label="Email" value={formData.email} invalid={formSubmitted & !formData.email} errorText="Ab ye bhi daal hi do na..">
                                            <Input name="email" placeholder="jaise ki aman@gmail.com" onChange={handleChange} />
                                        </Field>
                                    </Fieldset.Content>
                                    <Button type="submit" onClick={handleSubmit} mt={4} bg="pink" disabled={isLoading}>
                                        {isLoading && <Spinner size="md" />}
                                        Submit
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