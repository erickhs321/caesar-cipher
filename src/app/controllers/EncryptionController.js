import axios from "axios";
const baseUrl =
  "https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=";

class EncryptionController {
  async index(req, res, next) {
    try {
      const { data } = await axios.get(`${baseUrl}${req.userToken}`);
      req.data = data;
    } catch (err) {
      return res.json(err);
    }

    console.log(req.data);
  }
}

export default new EncryptionController();
