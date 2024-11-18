import { useCallback, useEffect, useState } from 'react'
import axios from "axios"
import { Box, VStack, Text, Button, Container, Spinner, SimpleGrid } from '@chakra-ui/react'
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

import correctSoundFile from './assets/correct-answer.mp3';
import wrongSoundFile from './assets/wrong-sound.mp3';
import submitSoundFile from './assets/submit-sound.mp3';
import updateUser from './utils/updateUser'

const beBaseUrl = import.meta.env.VITE_BE_BASE_URL

export default function MCQs() {
    const [currentUser, serCurrentUser] = useState(() => JSON.parse(localStorage.getItem("currentUser")) || { name: "", profilePic: "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Image.png" })
    const [isLoading, setLoading] = useState(false)
    const [selectedAnswers, setSelectedAnswers] = useState({})
    const [questions, setQuestions] = useState([])
    const [isDialogOpen, setIsDialogOpen] = useState(true)
    const navigate = useNavigate()
    const [timer, setTimer] = useState(120) // 120 seconds timer
    // console.log(currentUser)

    // Create Audio instances with volume control
    const correctSound = new Audio(correctSoundFile);
    correctSound.volume = 0.3; // Adjusts the volume to 50%

    const wrongSound = new Audio(wrongSoundFile);
    wrongSound.volume = 0.2; // Adjusts the volume to 30%

    const submitSound = new Audio(submitSoundFile);
    submitSound.volume = 0.3; // Adjusts the volume to 70%

    const fetchAllQuestions = useCallback(async () => {
        try {
            const res = await axios.get(`${beBaseUrl}/questions`);
            setQuestions(res.data);
        } catch (error) {
            toaster.create({
                title: "Error fetching questions!",
                description: error.message,
                duration: 2000,
            });
        }
    }, []);

    useEffect(() => {
        fetchAllQuestions()
    }, [fetchAllQuestions])

    const handleAnswerClick = useCallback((questionId, option) => {
        const isCorrect = option === questions.find((q) => q._id === questionId).correctAnswer;

        // Play sound based on answer correctness
        isCorrect ? correctSound.play() : wrongSound.play();

        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: option,
        }));
    }, [questions]);

    const handleSubmit = useCallback(async () => {
        setLoading(true);

        // Play submit sound
        submitSound.play();

        let score = questions.reduce((acc, question) => {
            return acc + (selectedAnswers[question._id] === question.correctAnswer ? 1 : 0);
        }, 0);
        const updatedUser = { ...currentUser, score, timeTaken: 120 - timer, credits: currentUser.credits - 1 };
        console.log(score, timer, updatedUser.timeTaken)

        try {
            await axios.patch(`${beBaseUrl}/update`, updatedUser);
            updateUser(updatedUser)
            serCurrentUser(updatedUser)
            navigate("/leaderboard");
        } catch (error) {
            toaster.create({
                title: "Error updating credits",
                description: error.message,
                status: "error",
                duration: 2000,
            });
        } finally {
            setLoading(false);
        }
    }, [selectedAnswers, navigate, currentUser, questions, timer]);

    // Timer effect with auto-submit on timeout
    useEffect(() => {
        if (!isDialogOpen && timer > 0) {
            const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
            return () => clearInterval(interval);
        } else if (timer === 0) {
            handleSubmit();
        }
    }, [isDialogOpen, timer, handleSubmit]);

    return (
        <Container maxW="container.md" mt={8}>
            <DialogRoot defaultOpen={!!currentUser.name} lazyMount size={'lg'} open={isDialogOpen} onOpenChange={() => currentUser.credits <= 0 ? navigate("/leaderboard") : null}>
                <DialogContent>
                    <DialogHeader>
                        {currentUser.credits <= 0 ? (
                            <DialogTitle>Credits nhi bache ab 🥲</DialogTitle>
                        ) : (
                            <DialogTitle>MCQ Test Information</DialogTitle>
                        )}
                    </DialogHeader>
                    {currentUser.credits <= 0 ? (
                        <DialogBody>
                            <Text>Ab tumhe kal tak ka wait karna padega 😉</Text>
                        </DialogBody>
                    ) : (
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
                            <Text fontWeight="bold" mt={4}>Let’s see how well you know me!</Text>
                        </DialogBody>
                    )}
                    <DialogFooter>
                        <DialogActionTrigger asChild>
                            <Button colorScheme="blue" onClick={() => setIsDialogOpen(false)}>
                                {currentUser.credits <= 0 ? "Thik hai" : "Start Test"}
                            </Button>
                        </DialogActionTrigger>
                    </DialogFooter>
                    <DialogCloseTrigger />
                </DialogContent>
            </DialogRoot>
            <Toaster />
            <Navbar title="MCQs" timer={timer} currentUser={currentUser} />
            <VStack spacing={6} align="stretch" my={5} mt={20}>
                {questions.map((question) => (
                    <Box key={question._id} p={3} borderWidth={1} borderRadius="lg" bg="white" color="black">
                        <Text mb={4} fontWeight="bold">{question.questionText}</Text>
                        <SimpleGrid columns={2} gap={2}>
                            {question.options.map((option) => {
                                const isCorrect = option === question.correctAnswer;
                                const isSelected = selectedAnswers[question._id] === option;
                                const bgColor = isSelected ? (isCorrect ? 'green' : 'red') : 'gray.200';

                                return (
                                    <Button
                                        key={option}
                                        bg={bgColor}
                                        color="black"
                                        onClick={() => handleAnswerClick(question._id, option)}
                                        _hover={{ bg: isSelected ? bgColor : 'gray.300' }}
                                        disabled={!!selectedAnswers[question._id]}
                                        whiteSpace="normal" // Allow text wrapping
                                        textAlign="center"  // Center align the text
                                        padding="4"         // Adjust padding for better spacing
                                        overflow="hidden"   // Prevent any overflowing text from being visible
                                    
                                    >
                                        {/* <Text> */}
                                            {option}
                                        {/* </Text> */}
                                    </Button>
                                );
                            })}
                        </SimpleGrid>
                    </Box>
                ))}
                <Button bg="black" color="#fff" size="lg" onClick={handleSubmit} position={'fixed'} bottom={5} left={"50%"} transform={"translateX(-50%)"} disabled={isLoading}>
                    {isLoading ? <Spinner size="md" /> : "Bas, Itna hi pata hai"}
                </Button>
            </VStack>
        </Container>
    )
}