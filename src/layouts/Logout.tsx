import { CAS_URL_EXIT } from "@/constants"
import { Button } from "antd"


const Logout = () => {

  const onClick = () => {
    localStorage.clear()
    location.href = CAS_URL_EXIT
  }

  return (<Button type='link' onClick={onClick}>退出</Button>)
}

export default Logout;