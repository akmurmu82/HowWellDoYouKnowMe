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
                // setPlayers(res.data)
                console.log("deleted")
                toaster.create({
                    title: "Ho gya",
                    description: "Thanks for registering.",
                    duration: 2000,
                    // placement:"top"
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
                alert(`Error: ${response.data.message}`);
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
            })        }
    };


    return (
        <VStack
            p={3}
            color={"black"}
            justifyContent={"space-around"}
            borderWidth={currentUser.name === name ? 5 : 1}
            borderColor={currentUser.name === name ? "red" : ''}
            borderRadius="md"
            bg={index === 0 ? 'yellow.300' : index === 1 ? '#C0C0C0' : index === 2 ? '#B08D57' : 'gray.100'}
            textAlign="center"
        >
            <Toaster />
            <HStack>
                <Avatar size="2xl" src={profilePic} />
                <VStack textAlign="left">
                    <Box>
                        <Text fontWeight="bold">
                            {index + 1 === 1 ? '1st ' : `${index + 1}th `} {name}
                        </Text>
                        <Text>Score: {score}</Text>
                        <Text>Time Taken: {timeTaken}s</Text>
                        <Text>Credits remaining: {credits}s</Text>
                    </Box>
                    {/* Conditionally render Update button if currentUser is Admin */}
                </VStack>
            </HStack>
            {isAdmin && (
                <SimpleGrid columns={2} gap={2}>
                    <Button size={'sm'} colorPalette="white" variant="subtle">
                        View Player <SlUser />
                    </Button>
                    <Button size={'sm'} bg="orange.800" colorPalette="white" variant="subtle" onClick={(_id) => handleGiveCredits(_id)}>
                        Edit Player <PiHandCoinsLight />
                    </Button>
                    <Button size={'sm'} bg="green.800" colorPalette="white" variant="subtle" onClick={(_id) => handleGiveCredits(_id)}>
                        Give Credits <PiHandCoinsLight />
                    </Button>
                    <Button isLoading={isLoading} bg="red.500" size={'sm'} colorPalette="white" variant="subtle" onClick={(_id) => handleDeletePlayer(_id)}>
                        Remove Player<CiTrash />
                    </Button>
                </SimpleGrid>
            )}
        </VStack>
    )
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