import { useEffect, useState } from 'react';
import { Box, VStack, Button, Text, Container, Image, HStack, SimpleGrid } from '@chakra-ui/react';
import Certificate from './Certificate';
import axios from 'axios';
import Navbar from './Navbar';
import PlayerCard from './PlayerCard';
import {
    DialogActionTrigger,
    DialogBody,
    DialogCloseTrigger,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogRoot,
    DialogTitle,
    DialogTrigger,
} from './components/ui/dialog';
import { useNavigate } from 'react-router-dom';

const LeaderBoard = () => {
    const navigate = useNavigate()
    const [isLoading, setLoading] = useState(false);
    const [players, setPlayers] = useState([]);
    const [showCertificate, setShowCertificate] = useState(false);
    const currentUser = JSON.parse(localStorage.getItem("currentUser"))
    // console.log("currentUser:", currentUser)
    const beBaseUrl = import.meta.env.VITE_BE_BASE_URL

    useEffect(() => {
        const fetchAllPlayers = async () => {
            setLoading(true)
            try {
                let res = await axios.get(`${beBaseUrl}/players`);
                // console.log("Players fetched successfully.", res, res.data);
                if (res.status == 200) {
                    setPlayers(res.data)
                }
            } catch (error) {
                console.error("Error fetching players!", error);
            } finally {
                setLoading(false)
            }
        }
        fetchAllPlayers()
    }, [beBaseUrl])

    const handleShareOnWhatsApp = () => {
        const message = `Check out my achievement! I scored ${currentUser.score} with a time of ${currentUser.timeTaken} seconds on the LeaderBoard.`;
        const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const handlePlayAgain = () => {
        navigate("/mcqs")
    }

    return (
        <Container maxW="container.md" py={8}>

            <Navbar title="Leaderboard" currentUser={currentUser} />
            <SimpleGrid spacing={4} align="stretch" borderWidth={1} borderRadius="lg" mt={10} p={4} overflowY="auto" h={"600px"}>

                {isLoading ? (
                    <Text>Players ranking is loading...</Text>
                ) :
                    players.length === 0 ? (
                        <Text>No players to display</Text>
                    ) : (players.map(({name, score, credits, profilePic, timeTaken}, index) => (
                        <PlayerCard key={index} index={index} name={name} score={score} credits={credits} profilePic={profilePic} timeTaken={timeTaken} />
                    )
                    ))}
            </SimpleGrid>

            <VStack spacing={2} align="stretch" mt={4} borderWidth={1} borderRadius="lg" p={4}>
                <Button colorScheme="whatsapp" onClick={handleShareOnWhatsApp}>
                    Share on WhatsApp
                </Button>
                <Button colorScheme="purple" onClick={() => setShowCertificate(true)}>
                    Download Certificate
                </Button>
                {currentUser.credits > 0 ?
                    (<DialogRoot>
                        <DialogTrigger asChild>
                            <Button colorScheme="blue" isDisabled={currentUser.credits <= 0}>
                                Play Again Credit ({currentUser.credits})
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Play Again?</DialogTitle>
                            </DialogHeader>
                            <DialogBody>
                                <p>
                                    Everytime you play, you loose a credit. The credits renew everyday.
                                    So don&apos;t worry if you&apos;re out of credits.
                                </p>
                            </DialogBody>
                            <DialogFooter>
                                <DialogActionTrigger asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogActionTrigger>
                                <Button onClick={handlePlayAgain}>Play</Button>
                            </DialogFooter>
                            <DialogCloseTrigger />
                        </DialogContent>
                    </DialogRoot>) : (
                        <>
                            <Text textAlign="center" color="gray.600">
                                Bas beta, tumhare saare credits khatam ho gye 😈. Ab yaa to paise do yaa kal aao.
                            </Text>
                            <Button colorScheme="teal" onClick={() => console.log('Play Again using Payment')}>
                                Play Again Pay (5Rs)
                            </Button></>)}
            </VStack>

            {showCertificate && (
                <Certificate name={currentUser.name} score={currentUser.score} timeTaken={currentUser.timeTaken} />
            )}
        </Container>
    );
};

export default LeaderBoard;