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

    const { numero_casas, cifrado } = req.data;

    const alphabet = "a b c d e f g h i j k l m n o p q r s t u v w x y z".split(
      " "
    );

    let translate = "";

    for (const char of cifrado) {
      if (char.match(/^[a-zA-Z]*$/)) {
        const i = alphabet.indexOf(char.toLowerCase());
        translate +=
          alphabet[
            i - numero_casas < 0
              ? alphabet.length - (numero_casas - i)
              : i - numero_casas
          ];
      } else {
        translate += char.toLowerCase();
      }
    }

    console.log(translate);
    return res.send();
  }
}

export default new EncryptionController();
