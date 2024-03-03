import { Container } from "react-bootstrap";
import Header from "../components/header";
import { useEffect } from "react";
import { axiosInstance } from "../things";

export default function Protected() {
    useEffect(() => {
        let isMounted = true;

        const fetch_data = async () => {
            try {
                const response = await axiosInstance.get("protected")

                if (isMounted) {
                    console.log(response);
                }
            } catch (error) {
                throw error
            }
        }
        
        fetch_data();

        return () => {
            isMounted = false; 
        };
    })

    return (
        <div>
            <Header/>
            <Container>

            </Container>
        </div>
    );
}