import { Button, Heading, HStack, Image, Text, VStack } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import {
    DrawerActionTrigger,
    DrawerBackdrop,
    DrawerBody,
    DrawerCloseTrigger,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerRoot,
    DrawerTitle,
    DrawerTrigger,
} from "./components/ui/drawer"
import { useNavigate } from 'react-router-dom';

function Navbar({ title, timer, currentUser }) {
    const navigate = useNavigate()
    const { name, profilePic } = currentUser
    const handleLogOut = () => {
        localStorage.clear()
        console.log("logged out!", currentUser)
        navigate("/")
    }

    return (
        <HStack bg={'black'} mx={"auto"} w={'100%'} justifyContent={"space-between"} position={"fixed"} zIndex={9} top={0} left={0} textAlign="center" p={4}>
            <Heading size="md" textAlign="center">
                {title}
            </Heading>
            {timer ? <Heading size="md">Timer: {String(timer).padStart(2, '0')}</Heading> : null}

            {!timer ? <HStack>
                <Text>{!name ? "Welcome" : name.length > 10 ? name.slice(0, 10) + "..." : name}</Text>
                <DrawerRoot>
                    <DrawerBackdrop />
                    <DrawerTrigger asChild>
                        <Image w={10} borderRadius={"50%"} src={profilePic} />
                    </DrawerTrigger>
                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle>Welcome, {name}</DrawerTitle>
                        </DrawerHeader>
                        <DrawerBody>
                            <p>{name ?
                                "Agar achcha laga to WhatsApp pe bata dena.😉" :
                                "Sign in to see the Leaderboard.😉"
                            }</p>

                            <VStack gap={2} textAlign={'left'} mt={2} alignItems={"flex-start"} >
                                <Button w={"90%"} variant="surface" onClick={() => navigate("/")}>Home</Button>
                                <Button disabled={!name} w={"90%"} variant="surface" onClick={() => navigate("/leaderboard")}>LEADERBOARD</Button>
                                {name ?
                                    <>
                                        <Button w={"90%"} variant="surface" onClick={() => navigate("/mcqs")}>MCQs</Button>
                                        <Button w={"90%"} variant="surface" onClick={handleLogOut}>Log out</Button>
                                    </> :
                                    null
                                }
                            </VStack>
                        </DrawerBody>
                        <DrawerFooter>
                            <DrawerActionTrigger asChild>
                                <Button variant="outline">Close</Button>
                            </DrawerActionTrigger>
                        </DrawerFooter>
                        <DrawerCloseTrigger />
                    </DrawerContent>
                </DrawerRoot>
            </HStack> : null}
        </HStack>
    );
}

Navbar.propTypes = {
    title: PropTypes.string,
    timer: PropTypes.number,
    currentUser: PropTypes.object,

};

export default Navbar;