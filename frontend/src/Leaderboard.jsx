import { useEffect, useState } from 'react';
import { Box, VStack, Button, Text, Container, Heading, Image, HStack, Spacer } from '@chakra-ui/react';
import Certificate from './Certificate';
import axios from 'axios';

const LeaderBoard = () => {
    const [players, setPlayers] = useState([]);
    const [credits, setCredits] = useState(3);
    const [showCertificate, setShowCertificate] = useState(false);
    const currentUser = JSON.parse(localStorage.getItem("currentUser"))
    // console.log("currentUser:", currentUser)
    const beBaseUrl = import.meta.env.VITE_BE_BASE_URL

    useEffect(() => {
        const fetchAllPlayers = async () => {
            try {
                let res = await axios.get(`${beBaseUrl}/players`);
                console.log("Players fetched successfully.", res, res.data);
                if (res.status == 200) {
                    setPlayers(res.data)
                }
            } catch (error) {
                console.error("Error fetching players!", error);
            }
        }
        fetchAllPlayers()
    }, [beBaseUrl])

    const handleShareOnWhatsApp = () => {
        const message = `Check out my achievement! I scored ${currentUser.score} with a time of ${currentUser.timeTaken} seconds on the LeaderBoard.`;
        const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <Container maxW="container.md" py={8}>
            <HStack bg={'black'} mx={"auto"} w={'100%'} justifyContent={"space-between"} position={"fixed"} zIndex={9} top={0} left={0} textAlign="center" p={4}>
                <Heading size="md" textAlign="center">
                    LeaderBoard
                </Heading>
                <HStack>
                    <Text>{currentUser.name}</Text>
                    <Image w={10} borderRadius={"50%"} src={currentUser.profilePic} />
                </HStack>
            </HStack>
            <VStack spacing={4} align="stretch" borderWidth={1} borderRadius="lg" mt={10} p={4} overflowY="auto" h={"600px"}>

                {players.length === 0 ? (
                    <Text>No players to display</Text>
                ) : (players.map((player, index) => {
                    console.log("Rendering player:", players);
                    return (
                        <HStack
                            key={player.name}
                            p={3}
                            color={"black"}
                            justifyContent={"space-around"}
                            borderWidth={1}
                            borderRadius="md"
                            bg={index === 0 ? 'yellow.100' : 'gray.100'}
                            textAlign="center"
                        >
                            <Image w={20} borderRadius={"50%"} src={player.profilePic} />
                            <Box>
                                <Text fontWeight="bold">
                                    {index + 1 === 1 ? '1st ' : `${index + 1}th `} {player.name}
                                </Text>
                                <Text>Score: {player.score}</Text>
                                <Text>Time Taken: {player.timeTaken}s</Text>
                            </Box>
                        </HStack>
                    )
                }))}
            </VStack>

            <VStack spacing={2} align="stretch" mt={4} borderWidth={1} borderRadius="lg" p={4}>
                <Button colorScheme="whatsapp" onClick={handleShareOnWhatsApp}>
                    Share on WhatsApp
                </Button>
                <Button colorScheme="purple" onClick={() => setShowCertificate(true)}>
                    Download Certificate
                </Button>
                <Button colorScheme="blue" onClick={() => console.log('Play Again using Credit')} isDisabled={credits <= 0}>
                    Play Again Credit ({credits})
                </Button>
                <Text textAlign="center" color="gray.600">
                    Agar saare credit khatam ho gye to:
                </Text>
                <Button colorScheme="teal" onClick={() => console.log('Play Again using Payment')}>
                    Play Again Pay (5Rs)
                </Button>
            </VStack>

            {showCertificate && (
                <Certificate name={currentUser.name} score={currentUser.score} timeTaken={currentUser.timeTaken} />
            )}
        </Container>
    );
};

export default LeaderBoard;