import axios from "axios";

const URL = "http://localhost:3000"

export async function getFilme() {
  const response = await axios.get(`${URL}/filme`)

  if (response.status === 200) {
    return response.data
  } else {
    return
  }
}

export async function getVorstellung(id) {
  const response = await axios.get(`${URL}/filme/${id}`)

  if (response.status === 200) {
    return response.data
  } else {
    return
  }
}
