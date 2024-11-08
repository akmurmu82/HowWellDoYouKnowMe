import PropTypes from 'prop-types';
import { Box, VStack, Text, Image, HStack } from '@chakra-ui/react';

const PlayerCard = ({ currentUser, name, index, score, credits, profilePic, timeTaken }) => {
    return (
        <HStack
            p={3}
            color={"black"}
            justifyContent={"space-around"}
            borderWidth={1}
            borderRadius="md"
            bg={currentUser.name == name ? "blue.200" : index === 0 ? 'yellow.200' : index === 1 ? 'gray.200' : index === 2 ? 'orange.200' : "gray.200"}
            textAlign="center"
        >
            <Image w={20} borderRadius={"50%"} src={profilePic} />
            <VStack textAlign="left">
                <Box>
                    <Text fontWeight="bold">
                        {index + 1 === 1 ? '1st ' : `${index + 1}th `} {name}
                    </Text>
                    <Text>Score: {score}</Text>
                    <Text>Time Taken: {timeTaken}s</Text>
                    <Text>Credits remaining: {credits}s</Text>
                </Box>
            </VStack>
        </HStack>
    )
}

PlayerCard.propTypes = {
    currentUser: PropTypes.object,
    name: PropTypes.string,
    index: PropTypes.number,
    score: PropTypes.number,
    credits: PropTypes.number,
    profilePic: PropTypes.string,
    timeTaken: PropTypes.number
};

export default PlayerCard;
