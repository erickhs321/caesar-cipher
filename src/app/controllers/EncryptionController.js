import axios from "axios";
import fs from "fs";
const baseUrl =
  "https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=";

class EncryptionController {
  async index(req, res) {
    try {
      const { data } = await axios.get(`${baseUrl}${req.userToken}`);
      req.data = data;
    } catch ({ message }) {
      return res.json({ error: message });
    }

    fs.writeFile("./files/answer.json", JSON.stringify(req.data), err => {
      if (err) {
        return res.status(500).json({ error: "error saving file" });
      }
    });

    return res.send();
  }
}

export default new EncryptionController();
