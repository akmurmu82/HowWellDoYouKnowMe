import { useCallback, useEffect, useState } from 'react'
import axios from "axios"
import { Box, VStack, Text, Button, Container, Spinner } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { Toaster, toaster } from './components/ui/toaster'
import Navbar from './Navbar'

const beBaseUrl = import.meta.env.VITE_BE_BASE_URL
// const lsUser = JSON.parse(localStorage.getItem("currentUser"))

export default function MCQs() {
    const [isLoading, setLoading] = useState(false)
    const [selectedAnswers, setSelectedAnswers] = useState({})
    const [questions, setQuestions] = useState([])
    // let [currentUser, setCurrentUser] = useState(lsUser)
    const [isActive, setIsActive] = useState(true)
    const navigate = useNavigate()
    const [timer, setTimer] = useState(90) // 60 seconds timer
    // console.log(currentUser)
    const currentUser = JSON.parse(localStorage.getItem("currentUser"))

    useEffect(() => {
        const fetchAllQuestions = async () => {
            try {
                const res = await axios.get(`${beBaseUrl}/questions`)
                setQuestions(res.data)
            } catch (error) {
                toaster.create({
                    title: "Error fetching questions!",
                    description: error.message,
                    duration: 2000
                })
            }
        }
        fetchAllQuestions()
    }, [])

    const handleAnswerClick = (questionId, option) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: option,
        }))
    }

    const handleSubmit = useCallback(async () => {
        setIsActive(false)
        setLoading(true)

        // Score calculation
        let score = 0
        questions.forEach((question) => {
            if (selectedAnswers[question._id] === question.correctAnswer) {
                score++
            }
        })

        const updatedUser = { ...currentUser, score, timeTaken: 90 - timer, credits: currentUser.credits - 1 }
        console.log("updatedUser:", updatedUser)

        console.log("user to update:", updatedUser)

        try {
            await axios.patch(`${beBaseUrl}/update`, updatedUser);
            localStorage.setItem("currentUser", JSON.stringify(updatedUser))
            navigate("/leaderboard")
        } catch (error) {
            toaster.create({
                title: "Error updating credits",
                description: error.message,
                status: "error",
                duration: 2000
            })
            setLoading(true)
            console.error("Error updating user credits:", error);
        } finally {
            setLoading(false)
        }

    }, [selectedAnswers, currentUser, navigate, questions, timer])

    // Timer effect with auto-submit on timeout
    useEffect(() => {
        if (isActive && timer > 0) {
            const interval = setInterval(() => setTimer(prev => prev - 1), 1000)
            return () => clearInterval(interval);
        } else if (timer === 0) {
            handleSubmit()
        }
    }, [isActive, timer, handleSubmit])

    return (
        <Container maxW="container.md" mt={8}>
            <Toaster />
            <Navbar title="MCQs" timer={timer} currentUser={currentUser} />
            {/* <HStack bg={'black'} mx={"auto"} w={'100%'} justifyContent={"space-between"} position={"fixed"} zIndex={9} top={0} left={0} textAlign="center" p={4}>
                <Heading size="md" textAlign="center">
                    MCQs
                </Heading>
                <Heading size="md">Timer: {String(timer).padStart(2, '0')}</Heading>
                <HStack>
                    <Text>{currentUser.name.length > 10 ? currentUser.name.slice(0, 10) + "..." : currentUser.name}</Text>
                    <Image w={10} borderRadius={"50%"} src={currentUser.profilePic} />
                </HStack>
            </HStack> */}

            <VStack spacing={6} align="stretch" my={5} mt={20}>
                {questions.map((question) => (
                    <Box key={question._id} p={6} borderWidth={1} borderRadius="lg" bg="white" color="black">
                        <Text mb={4} fontWeight="bold">{question.questionText}</Text>
                        <VStack align="stretch" spacing={3}>
                            {question.options.map((option) => {
                                const isCorrect = option === question.correctAnswer;
                                const isSelected = selectedAnswers[question._id] === option;
                                const bgColor = isSelected ? (isCorrect ? 'green.400' : 'red.400') : 'gray.200';

                                return (
                                    <Button
                                        key={option}
                                        bg={bgColor}
                                        color="black"
                                        onClick={() => handleAnswerClick(question._id, option)}
                                        _hover={{ bg: isSelected ? bgColor : 'gray.300' }}
                                        disabled={!!selectedAnswers[question._id]}
                                    >
                                        {option}
                                    </Button>
                                );
                            })}
                        </VStack>
                    </Box>
                ))}

                <Button
                    colorScheme="blue"
                    size="lg"
                    onClick={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? <Spinner size="md" /> : "Bas, Itna hi pata hai"}
                </Button>
            </VStack>
        </Container>
    )
}