import { useLocation } from "react-router-dom";
import axios from "axios"
import { useSnackbar } from 'notistack';

function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

const ActivateAccount = () => {
    const { enqueueSnackbar } = useSnackbar();
    const query = useQuery()
    
    const token = query.get("token")
    if (token) {
        axios.post(`${process.env.REACT_APP_API}/api/account/activateAccount`, {activationToken: token})
            .then(res => res.data)
            .then(res => {
                enqueueSnackbar(res.message)
            })
            .catch(err => {
                if (err.response && err.response.data && err.response.data.message) {
                    enqueueSnackbar(err.response.data.message)
                } else {
                    enqueueSnackbar("Błąd serwera")
                }
            })
    }
    return null
}

export default ActivateAccount