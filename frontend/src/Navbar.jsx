import { Box, Button, Center, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import axios from 'axios';
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
import {
    FileInput,
    FileUploadClearTrigger,
    FileUploadRoot,
} from "./components/ui/file-button"
import { InputGroup } from "./components/ui/input-group"
import { Avatar } from "./components/ui/avatar"
import { LuFileUp } from "react-icons/lu"
import { CloseButton } from "./components/ui/close-button"
import updateUser from './utils/updateUser';
import { toaster } from './components/ui/toaster';

function Navbar({ title, timer, currentUser }) {
    const beBaseUrl = import.meta.env.VITE_BE_BASE_URL
    const [isFileUploadOpen, setIsFileUploadOpen] = useState(false)
    const [uploadedImg, setUploadedImg] = useState(null)
    const [submitBtn, setSubmitBtn] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const { name, profilePic } = currentUser
    const handleLogOut = () => {
        localStorage.clear()
        console.log("logged out!", currentUser)
        navigate("/")
    }

    const handleChangeProfile = async () => {
        setIsLoading(true)
        // update user on backend
        // Create FormData to send file and text data
        console.log("started updating...")
        const formData = new FormData();
        formData.append("profilePic", uploadedImg); // Add image file
        formData.append("name", name);

        console.log("body:", formData)

        try {

            const response = await axios.patch(`${beBaseUrl}/update`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("Profile updated successfully:", response);
            if (response.status == 200) {
                toaster.create({
                    title: "Image Updated.",
                    description: "Lag gayi tumhari picture😉.Page refresh karo🔃",
                    duration: 3000,
                })
                updateUser(response.data.user)
            }
        } catch (error) {
            console.error("Error uploading file:", error);
        } finally {
            setIsLoading(false)
            setSubmitBtn(false)
            setIsFileUploadOpen(!isFileUploadOpen)
        }

    }

    const handleFileUploadSucces = (e) => {
        setSubmitBtn(true)
        console.log("uploaded file", e.files[0])
        setUploadedImg(e.files[0])
    }

    return (
        <HStack bg={'black'} color="#fff" mx={"auto"} w={'100%'} justifyContent={"space-between"} position={"fixed"} zIndex={9} top={0} left={0} textAlign="center" p={4}>
            <Heading size="md" textAlign="center">
                {title}
            </Heading>
            {timer ? <Heading size="md">Timer: {String(timer).padStart(2, '0')}</Heading> : null}

            {!timer ? <HStack>
                <Text>{!name ? "Welcome" : name.length > 10 ? name.slice(0, 10) + "..." : name}</Text>
                <DrawerRoot>
                    <DrawerBackdrop />
                    <DrawerTrigger asChild>
                        <Avatar name={name} src={profilePic} />
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
                            <Center>
                                <VStack>
                                    <Text my={2}>My Profile</Text>
                                    <Box>
                                        <Avatar src={profilePic} />
                                    </Box>
                                    {isFileUploadOpen ?
                                        <FileUploadRoot gap="1" maxWidth="300px" onFileAccept={(e) => handleFileUploadSucces(e)}>
                                            <VStack>
                                                <InputGroup
                                                    w="full"
                                                    startElement={<LuFileUp />}
                                                    endElement={
                                                        <FileUploadClearTrigger asChild>
                                                            <CloseButton
                                                                me="-1"
                                                                size="xs"
                                                                variant="plain"
                                                                focusVisibleRing="inside"
                                                                focusRingWidth="2px"
                                                                pointerEvents="auto"
                                                                color="fg.subtle"
                                                            />
                                                        </FileUploadClearTrigger>
                                                    }
                                                >
                                                    <FileInput />
                                                </InputGroup>
                                                {submitBtn ? <Button onClick={() => handleChangeProfile()}>Change</Button> : null}
                                            </VStack>
                                        </FileUploadRoot> :
                                        <Text disabled={isLoading} onClick={() => setIsFileUploadOpen(!isFileUploadOpen)}>Change</Text>
                                    }
                                    <Text>Name: <b>{name}</b></Text>
                                    <Text>Relation: <b>{currentUser.relation}</b></Text>
                                </VStack>
                            </Center>
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