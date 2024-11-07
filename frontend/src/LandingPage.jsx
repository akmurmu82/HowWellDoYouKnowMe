import { Box, Button, Center, Container, Fieldset, Heading, Image, Input, Spinner, Stack, Text, VStack } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Field } from './components/ui/field';
import heroImage from './assets/hero-image.gif';
import { useState } from 'react';
import { Toaster, toaster } from "./components/ui/toaster"
import { useNavigate } from 'react-router-dom';
const beBaseUrl = import.meta.env.VITE_BE_BASE_URL;

function LandingPage() {
    const navigate = useNavigate()
    const [isLoading, setLoading] = useState(false)

    const [formData, setFormData] = useState({ name: "", email: "", relation: "" })
    const [formSubmitted, setFormSubmitted] = useState(false)
    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async () => {
        setFormSubmitted(true)
        console.log(formData)
        try {
            setLoading(true)
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
            <Box p={6} bg="pink.400" textAlign="center">
                <Heading color="white" fontSize="3xl">
                    HowWellDoYouKnowMe
                </Heading>
            </Box>
            <Toaster />

            {/* Content Section */}
            <Container maxW="container.md" mt={8} p={5} bg="white" borderRadius="lg" boxShadow="md">
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
                    <Box textAlign="center">
                        <Heading fontSize="2xl" color="pink.500" mb={3}>
                            Welcome to My World
                        </Heading>
                        <Text fontSize="lg" color="gray.600">
                            Life’s simple pleasures hold a special magic—like the first sip of{" "}
                            <Text as="span" fontWeight="bold">freshly brewed coffee</Text>, the{" "}
                            <Text as="span" fontWeight="bold">tap of rain</Text> on the window with a{" "}
                            <Text as="span" fontWeight="bold">good mystery novel</Text>, the thrill of an{" "}
                            <Text as="span" fontWeight="bold">epic road trip</Text>, or{" "}
                            <Text as="span" fontWeight="bold">cozy rainy days</Text>. These little favorites brighten my world.
                        </Text>

                        <Text mt={4} fontSize="md" color="gray.700">
                            But can you guess them all? Take the quiz and see how well you know me!
                        </Text>
                        {/* Form */}
                        <Center mt={6} color={'black'}>
                            <Fieldset.Root size="lg" maxW="md">
                                <Stack>
                                    <Fieldset.Legend>Contact details</Fieldset.Legend>
                                    <Fieldset.HelperText>
                                        Please provide your contact details below.
                                    </Fieldset.HelperText>
                                </Stack>
                                <Fieldset.Content>
                                    <Field label="Name" value={formData.name} invalid={formSubmitted & !formData.name} errorText="Oye, apna naam dalo yaha!">
                                        <Input name="name" placeholder="Aman" onChange={handleChange} />
                                    </Field>
                                    <Field label="Relation" value={formData.relation} invalid={formSubmitted & !formData.relation} errorText="Are bhai kon ho wo to batao...">
                                        <Input name="relation" placeholder="Nephew" onChange={handleChange} />
                                    </Field>
                                    <Field label="Email" value={formData.email} invalid={formSubmitted & !formData.email} errorText="Ab ye bhi daal hi do na..">
                                        <Input name="email" placeholder="jaise ki aman@gmail.com" onChange={handleChange} />
                                    </Field>
                                </Fieldset.Content>
                                <Button type="submit" onClick={handleSubmit} mt={4} bg="pink">
                                    {isLoading && <Spinner size="md" />}
                                    Submit
                                </Button>
                            </Fieldset.Root>
                        </Center>
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