import './Login.css';
import Footer from "../../Components/Footer/Footer";
import Button from "../../Components/Button/Button"
const TelaLogin = () => {
    return (
        <div className='TelaLogin'>
        <div className="login-geral">
            <h2>RECIBO CIS IVAIPORÃ</h2>
            <form className="login-form">
                <div className="form-group">
                    <label htmlFor="username">Usuário:</label>
                    <input type="text" id="username" name="username" required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Senha:</label>
                    <input type="password" id="password" name="password" required />
                </div>

                <Button type="submit" className="login-button">Entrar</Button>
            </form>
        </div>
        <Footer/>
        </div>

       
    );
};

export default TelaLogin;
