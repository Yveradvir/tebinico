import { useState } from "react";
import Header from "../../components/header";
import { Container } from "react-bootstrap";
import SignUp from "./signUp";
import LogIn from "./logIn";


export default function Auth() {
    const [formType, setFormType] = useState('s');

    return (
        <div>
            <Header />
            <Container className="h-100">
                {(formType === 's') ?
                    (<SignUp formSetter={setFormType} />)
                    :
                    (<LogIn formSetter={setFormType} />)
                }
            </Container>
        </div>
    );
}
