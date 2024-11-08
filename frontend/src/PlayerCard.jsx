import PropTypes from 'prop-types';
import { Box, VStack, Text, Image, HStack } from '@chakra-ui/react';

const PlayerCard = ({ name, currentUser, index, score, credits, profilePic, timeTaken }) => {
    return (
        <HStack
            p={3}
            color={"black"}
            justifyContent={"space-around"}
            borderWidth={currentUser.name === name ? 5 : 1}
            borderColor={currentUser.name === name ? "red" : ''}
            borderRadius="md"
            bg={index === 0 ? 'yellow.300' : index === 1 ? '#C0C0C0' : index === 2 ? '#B08D57' : 'gray.100'}
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

export default PlayerCard;

PlayerCard.propTypes = {
    currentUser: PropTypes.object,
    name: PropTypes.string,
    index: PropTypes.number,
    score: PropTypes.number,
    credits: PropTypes.number,
    profilePic: PropTypes.string,
    timeTaken: PropTypes.number
};