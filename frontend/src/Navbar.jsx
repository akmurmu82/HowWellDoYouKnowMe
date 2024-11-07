import { Heading, HStack, Image, Text } from '@chakra-ui/react';
import PropTypes from 'prop-types';

function Navbar({ title, timer, currentUser }) {
    return (
        <HStack bg={'black'} mx={"auto"} w={'100%'} justifyContent={"space-between"} position={"fixed"} zIndex={9} top={0} left={0} textAlign="center" p={4}>
            <Heading size="md" textAlign="center">
                {title}
            </Heading>
            {timer ? <Heading size="md">Timer: {String(timer).padStart(2, '0')}</Heading> : null}
            <HStack>
                <Text>{currentUser.name.length > 10 ? currentUser.name.slice(0, 10) + "..." : currentUser.name}</Text>
                <Image w={10} borderRadius={"50%"} src={currentUser.profilePic} />
            </HStack>
        </HStack>
    );
}

Navbar.propTypes = {
    title: PropTypes.string,
    timer: PropTypes.Number,
    currentUser: PropTypes.object,

};

export default Navbar;