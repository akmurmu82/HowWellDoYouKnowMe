import { Box, VStack, Button, Text, Container, Image, HStack } from '@chakra-ui/react';

const PlayerCard = ({name, index, score, credits, profilePic, timeTaken})=> {
    return (
        <HStack
            p={3}
            color={"black"}
            justifyContent={"space-around"}
            borderWidth={1}
            borderRadius="md"
            bg={index === 0 ? 'yellow.100' : 'gray.100'}
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