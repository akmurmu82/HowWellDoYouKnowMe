import { useCallback, useEffect, useState } from 'react'
import axios from "axios"
import { Box, VStack, Text, Button, Container, Spinner } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { Toaster, toaster } from './components/ui/toaster'
import Navbar from './Navbar'
import {
    DialogActionTrigger,
    DialogBody,
    DialogCloseTrigger,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogRoot,
    DialogTitle,
    // DialogTrigger,
} from "./components/ui/dialog"

const beBaseUrl = import.meta.env.VITE_BE_BASE_URL

export default function MCQs() {
    const [isLoading, setLoading] = useState(false)
    const [selectedAnswers, setSelectedAnswers] = useState({})
    const [questions, setQuestions] = useState([])
    const [isDialogOpen, setIsDialogOpen] = useState(true)
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
        if (!isDialogOpen && isActive && timer > 0) {
            const interval = setInterval(() => setTimer(prev => prev - 1), 1000)
            return () => clearInterval(interval);
        } else if (timer === 0) {
            handleSubmit()
        }
    }, [isActive, timer, handleSubmit])

    return (
        <Container maxW="container.md" mt={8}>
            <DialogRoot lazyMount size={'cover'} open={isDialogOpen} onOpenChange={() => currentUser.credits <= 0 ? navigate("/leaderboard") : null}>
                {/* <DialogTrigger>
                </DialogTrigger> */}
                <DialogContent>
                    <DialogHeader>
                        {currentUser.credits <= 0 ?
                            (<DialogTitle>Credits nhi bache ab 🥲</DialogTitle>) :
                            (<DialogTitle>MCQ Test Information</DialogTitle>)
                        }
                    </DialogHeader>
                    {currentUser.credits <= 0 ?
                        <DialogBody>
                            <Text>
                                Ab tumhe kal tak ka wait karna padega 😉
                            </Text>
                        </DialogBody> :
                        <DialogBody>
                            <Text mb={4}>
                                You are about to take an MCQ test with <b>20 questions</b>. Each question is worth <b>1 point</b>.
                            </Text>
                            <Text mb={4}>
                                A <b>90-second timer</b> will track your speed. Once you select an answer, you won&apos;t be able to change it.
                            </Text>
                            <Text>
                                After completing the test, you&apos;ll be ranked based on your <b>score and time taken</b> and your credits will be <b>decreased</b> by 1.
                            </Text>
                            <Text fontWeight="bold" mt={4}>
                                Let’s see how well you know me!
                            </Text>
                        </DialogBody>}
                    <DialogFooter>
                        <DialogActionTrigger asChild>
                            <Button colorScheme="blue" onClick={() => setIsDialogOpen(false)}>{currentUser.credits <= 0 ? "Thik hai" : "Start Test"}</Button>
                        </DialogActionTrigger>
                    </DialogFooter>
                    <DialogCloseTrigger />
                </DialogContent>

            </DialogRoot>
            <Toaster />
            <Navbar title="MCQs" timer={timer} />
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