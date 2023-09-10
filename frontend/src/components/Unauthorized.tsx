import { useNavigate } from "react-router-dom"
import '../css/notauth.css'

const Unauthorized = () => {
    const navigate = useNavigate();

    const goBack = () => navigate(-1);

    return (
        <div className="body">
            <div className="mainbox">
                <div className="err">4</div>
                <i className="far fa-question-circle fa-spin"></i>
                <div className="err2">4</div>   
                <div className="msg">Maybe this page moved? Got deleted? Is hiding out in quarantine? Never existed in the first place? <p>Let's <a className="a" href="/" onClick={goBack}>Go Back</a> and try from there.</p></div>
            </div>
        </div>
    )
}

export default Unauthorized;