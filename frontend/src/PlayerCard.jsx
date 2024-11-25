import PropTypes from 'prop-types';
import { Box, VStack, Text, HStack, Button, SimpleGrid } from '@chakra-ui/react';
import { CiTrash } from "react-icons/ci";
import { SlUser } from "react-icons/sl";
import { Toaster, toaster } from "./components/ui/toaster"
import { PiHandCoinsLight } from "react-icons/pi";
import { Avatar } from './components/ui/avatar';
import axios from 'axios';
import { useState } from 'react';
const beBaseUrl = import.meta.env.VITE_BE_BASE_URL

const PlayerCard = ({ _id, name, currentUser, index, score, credits, profilePic, timeTaken }) => {
    const isAdmin = Boolean(currentUser.relation === "Admin")
    const [isLoading, setLoading] = useState(false)
    // console.log(isAdmin)

    const handleDeletePlayer = async () => {
        console.log(_id)
        setLoading(true)
        try {
            let res = await axios.delete(`${beBaseUrl}/players/delete/${_id}`);
            if (res.status == 200) {
                toaster.create({
                    title: `${res.data.player.name} remove ho gya.`,
                    description: "Refresh to see the updates",
                    duration: 4000,
                    type: "success"
                })
            }
        } catch (error) {
            console.error("Error deleting players!", error);
        } finally {
            setLoading(false)
        }
    }

    const handleGiveCredits = async () => {
        try {
            const response = await axios.put(`${beBaseUrl}/players/give-credits/${_id}`);

            if (response.status == 200) {
                toaster.create({
                    title: `${response.data.player.name} ko credits de diye.`,
                    description: `Refresh to see the updated players`,
                    duration: 4000,
                    type: 'success',
                })
            } else {
                toaster.create({
                    title: `Nahi hua bhai...`,
                    type: 'warning',
                    description: `${response.data.message}`,
                    duration: 4000,
                })
            }
        } catch (error) {
            console.error('Error giving credits:', error);
            toaster.create({
                title: `Error aa gaya bhai...`,
                type: 'error',
                description: `${error}`,
                duration: 4000,
            })
        }
    };


    return (
        <VStack
            p={4}
            color={"black"}
            justifyContent={"space-around"}
            borderWidth={currentUser.name === name ? 5 : 1}
            borderColor={currentUser.name === name ? "red" : ''}
            borderRadius="lg"
            bg={index === 0 ? 'yellow.300' : index === 1 ? '#C0C0C0' : index === 2 ? '#B08D57' : 'gray.50'}
            textAlign="center"
            boxShadow="lg" // Adding box-shadow
            transition="transform 0.2s, box-shadow 0.2s" // Smooth hover effect
            _hover={{
                transform: "scale(1.03)",
                boxShadow: "xl",
            }}
        >
            <Toaster />
            <HStack w="100%" justifyContent={"space-around"}>
                <Avatar size="2xl" src={profilePic} />
                <VStack textAlign="left">
                    <Box>
                        <Text fontWeight="extrabold" fontSize="xl" color="blue.800"> {/* Catchy font */}
                            {index + 1 === 1 ? '1st ' : `${index + 1}th `} {name}
                        </Text>
                        <Text fontWeight="medium" fontSize="md" color="gray.700">
                            Score: <span style={{ color: "green.600", fontWeight: "bold" }}>{score}</span>
                        </Text>
                        <Text fontWeight="medium" fontSize="md" color="gray.700">
                            Time Taken: <span style={{ color: "purple.600", fontWeight: "bold" }}>{timeTaken}s</span>
                        </Text>
                        <Text fontWeight="medium" fontSize="md" color="gray.700">
                            Credits remaining: <span style={{ color: "orange.600", fontWeight: "bold" }}>{credits}s</span>
                        </Text>
                    </Box>
                </VStack>
            </HStack>
            {isAdmin && (
                <SimpleGrid columns={2} gap={3} w="100%">
                    <Button size="md" colorScheme="teal" variant="solid">
                        View Player <SlUser />
                    </Button>
                    <Button size="md" bg="orange.800" color="white" _hover={{ bg: "orange.700" }} onClick={() => handleGiveCredits()}>
                        Edit Player <PiHandCoinsLight />
                    </Button>
                    <Button size="md" bg="green.800" color="white" _hover={{ bg: "green.700" }} onClick={() => handleGiveCredits()}>
                        Give Credits <PiHandCoinsLight />
                    </Button>
                    <Button
                        isLoading={isLoading}
                        bg="red.500"
                        color="white"
                        _hover={{ bg: "red.400" }}
                        size="md"
                        onClick={() => handleDeletePlayer()}
                    >
                        Remove Player <CiTrash />
                    </Button>
                </SimpleGrid>
            )}
        </VStack>
    );

}

export default PlayerCard;

PlayerCard.propTypes = {
    currentUser: PropTypes.object,
    _id: PropTypes.string,
    name: PropTypes.string,
    index: PropTypes.number,
    score: PropTypes.number,
    credits: PropTypes.number,
    profilePic: PropTypes.string,
    timeTaken: PropTypes.number
};