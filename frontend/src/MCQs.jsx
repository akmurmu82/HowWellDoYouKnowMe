import { useCallback, useEffect, useState } from 'react'
import axios from "axios"
import { Box, VStack, Text, Button, Container, Heading, HStack, Image, Spacer } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

const beBaseUrl = import.meta.env.VITE_BE_BASE_URL

export default function MCQs() {
    const [selectedAnswers, setSelectedAnswers] = useState({})
    const [questions, setQuestions] = useState([])
    let [currentUser, setCurrentUser] = useState({})
    const [quizCompleted, setQuizCompleted] = useState(false)
    const [score, setScore] = useState(0)
    const [isActive, setIsActive] = useState(true)
    const navigate = useNavigate()
    const [timer, setTimer] = useState(90) // 60 seconds timer

    const handleAnswerClick = (questionId, option) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: option,
        }))
        console.log("selectedAnswers: ", selectedAnswers, "currentUser:", currentUser)
    }

    useEffect(() => {
        const fetchAllQuestions = async () => {
            const res = await axios.get(`${beBaseUrl}/questions`)
            setQuestions(res.data)
        }
        fetchAllQuestions()
        setCurrentUser(JSON.parse(localStorage.getItem("currentUser")))
    }, [])

    const handleSubmit = useCallback(async () => {
        setIsActive(false)

        // Score calculation
        let newScore = 0
        questions.forEach((question) => {
            if (selectedAnswers[question._id] === question.correctAnswer) {
                newScore++
                console.log("correct", newScore)
            } else {
                console.log("incorrect")
            }
        })

        const updatedUser = { ...currentUser, score: newScore, timeTaken: 90 - timer }
        console.log("updatedUser:", updatedUser)

        setCurrentUser(updatedUser)
        setScore(newScore)
        setQuizCompleted(true)

        localStorage.setItem("currentUser", JSON.stringify(updatedUser))

        // Decrement credits by 1
        const updatedCredits = updatedUser.credits - 1;
        updatedUser.credits = updatedCredits;

        console.log("user to update:", updatedUser)

        try {
            let res = await axios.patch(
                `${beBaseUrl}/update`,
                updatedUser
            );
            console.log("User credits updated successfully.", res.data.user, currentUser);
        } catch (error) {
            console.error("Error updating user credits:", error);
        }

        navigate("/leaderboard")
    }, [selectedAnswers, currentUser, navigate, questions, timer])

    // Timer
    useEffect(() => {
        let interval

        if (isActive && timer > 0) {
            interval = setInterval(() => {
                setTimer(prev => prev - 1)
            }, 1000)
        } else if (timer === 0) {
            handleSubmit()
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [isActive, timer, handleSubmit])

    return (
        <Container maxW="container.md" mt={8}>
            <HStack bg={'black'} mx={"auto"} w={'100%'} position={"fixed"} zIndex={9} top={0} left={0} textAlign="center" p={4}>
                <HStack>
                    <Image w={10} borderRadius={"50%"} src={currentUser.profilePic} />
                    <Text>{currentUser.name}</Text>
                </HStack>
                <Spacer />
                <Heading size="md">Timer: {String(timer).padStart(2, '0')}</Heading>
            </HStack>
            <VStack spacing={6} align="stretch" my={5} mt={20}>
                {questions.map((question) => (
                    <Box color={'black'} key={question._id} p={6} borderWidth={1} borderRadius="lg" bg="white">
                        <Text mb={4} fontWeight="bold">
                            {question.questionText}
                        </Text>
                        <VStack align="stretch" spacing={3}>
                            {question.options.map((option) => {
                                const isCorrect = option === question.correctAnswer
                                const isSelected = selectedAnswers[question._id] === option
                                const bgColor = isSelected
                                    ? isCorrect ? 'green.400' : 'red.400'
                                    : 'gray.200'

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
                                )
                            })}
                        </VStack>
                    </Box>
                ))}

                <Button
                    colorScheme="blue"
                    size="lg"
                    onClick={handleSubmit}
                    isDisabled={!isActive}
                >
                    Submit
                </Button>

                {quizCompleted && (
                    <Box
                        p={6}
                        borderWidth={1}
                        borderRadius="lg"
                        bg="green.100"
                        color="green.800"
                        textAlign="center"
                    >
                        <Heading size="md" mb={2}>
                            Quiz Completed!
                        </Heading>
                        <Text fontSize="lg">
                            Your score: {score}/{questions.length}
                        </Text>
                    </Box>
                )}

            </VStack>
        </Container>
    )
}