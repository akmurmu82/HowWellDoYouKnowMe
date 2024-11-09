import { useRef } from 'react';
import { Box, VStack, Text, Button, Container, Heading } from '@chakra-ui/react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import PropTypes from 'prop-types';

const Certificate = ({ name, score, timeTaken }) => {
    const certificateRef = useRef();

    const handleDownloadCertificate = async () => {
        const element = certificateRef.current;
        const canvas = await html2canvas(element, { scale: 2 });
        const imageData = canvas.toDataURL('image/png');

        const pdf = new jsPDF('landscape', 'pt', 'a4');
        // const imgProps = pdf.getImageProperties(imageData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        // const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imageData, 'PNG', 0, 0, pdfWidth, pdfHeight);

        pdf.save(`${name}_Certificate.pdf`);
    };

    return (
        <Container maxW="container.md" py={8} color="black">
            <Box ref={certificateRef} p={8} borderWidth={1} borderRadius="lg" textAlign="center" bg="teal.50">
                <Heading mb={4}>Certificate of Achievement</Heading>
                <Text fontSize="lg" mb={2}>This certifies that</Text>
                <Text fontSize="2xl" fontWeight="bold" mb={4}>{name}</Text>
                <Text fontSize="lg" mb={2}>achieved a score of {score} with a time of {timeTaken} seconds</Text>
                <Text fontSize="lg" mt={6}>Congratulations on your achievement!</Text>
            </Box>
            <VStack mt={6} spacing={4}>
                <Button colorScheme="whatsapp" onClick={handleDownloadCertificate}>
                    Download Certificate
                </Button>
            </VStack>
        </Container>
    );
};

Certificate.propTypes = {
    name: PropTypes.string,
    score: PropTypes.number,
    timeTaken: PropTypes.number,

};

export default Certificate;