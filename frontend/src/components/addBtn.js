import { useEffect, useState } from "react";
import { Button, Overlay, Tooltip } from "react-bootstrap";
import { PlusCircle } from "react-bootstrap-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosInstance, cookies } from "../things";
import ErrorModal from "./errModal";

export default function AddBtn({ am_i_owner=false }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [showOptions, setShowOptions] = useState(false);

    const [errModal, setErrModal] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    
    const closeModal = () => {
        setErrModal(false);
        setErrMsg('');
    };

    useEffect(() => {
        let isMounted = true

        if (isMounted) {
            if (!cookies.get('refresh')) {
                navigate('/auth')
            }
        }

        return () => {
            isMounted = false
        }
    }, [navigate])

    const onDeleteBtn = async () => {
        try {
            if (am_i_owner) {
                if (location.pathname.startsWith("/group")) {
                    const groupId = location.pathname.split('/').pop();
                    const isConfirm = window.confirm(`Are you sure to delete a group with id ${groupId}? You are the owner, and you won't be able to undo your decision after confirmation.`)
                    
                    if (isConfirm) {
                        const response = await axiosInstance.delete(`group/${groupId}`)
                        if (response.status === 200) {
                            navigate(-1)
                        }
                    }
                } else if (location.pathname.startsWith("/post")) {
                    const postId = location.pathname.split('/').pop();
                    const isConfirm = window.confirm(`Are you sure to delete a post with id ${postId}? You are the owner, and you won't be able to undo your decision after confirmation.`)
                    
                    if (isConfirm) {
                        const response = await axiosInstance.delete(`post?id=${postId}`)
                        if (response.status === 200) {
                            navigate(-1)
                        }
                    }
                }
            }
        } catch (error) {
            console.error(error);

            let errorMessage = error.response?.data?.message || 'An error occurred';

            if (typeof errorMessage === 'object') {
                errorMessage = Object.values(errorMessage).join(', ');
            }

            setErrMsg(errorMessage);
        }
    }


    const handleButtonClick = () => {
        setShowOptions(!showOptions);
    };

    const handleOptionClick = () => {
        setShowOptions(false);
    };

    return (
        <div className="position-fixed bottom-0 end-0 p-3">
            <Overlay
                show={showOptions}
                target={document.getElementById('add-btn')}
                placement="top"
            >
                {(props) => (
                    <Tooltip id="overlay-options" {...props}>
                        <Button
                            variant="success"
                            className="m-1"
                            onClick={() => handleOptionClick('post')}
                            href="/add_post"
                        >
                            Post
                        </Button>
                        <Button
                            variant="info"
                            className="m-1"
                            href="/add_group"
                        >
                            Group
                        </Button>
                        {am_i_owner && (
                            <Button
                                variant="danger"
                                className="m-1"
                                onClick={onDeleteBtn}
                            >
                                Delete
                            </Button>
                        )}
                    </Tooltip>
                )}
            </Overlay>

            <Button
                id="add-btn"
                variant="primary"
                onClick={handleButtonClick}
                className="rounded-circle"
            >
                <PlusCircle size={32} />
            </Button>
            <ErrorModal handleClose={closeModal} show={errModal} errorMessage={errMsg}/>
        </div>
    );
}
