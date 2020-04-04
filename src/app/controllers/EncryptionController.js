import axios from "axios";
import fs from "fs";
import sha1 from "sha1";
import { resolve } from "path";
import FormData from "form-data";

const baseUrl = "https://api.codenation.dev/v1/challenge/dev-ps";

const pathFile = resolve("files", "answer.json");

class EncryptionController {
  async index(req, res) {
    try {
      const { data } = await axios.get(
        `${baseUrl}/generate-data?token=${req.userToken}`
      );
      req.data = data;
    } catch ({ message }) {
      return res.json({ error: message });
    }

    fs.writeFile(pathFile, JSON.stringify(req.data), (err) => {
      if (err) {
        fs.unlink(pathFile, (err) => {
          if (err) {
            console.log(err);
          }
        });
        return res.status(500).json({ error: "error saving file" });
      }
    });

    const { numero_casas: shift, cifrado: encrypted } = req.data;

    const alphabet = "a b c d e f g h i j k l m n o p q r s t u v w x y z".split(
      " "
    );

    let decrypted = "";

    for (const char of encrypted) {
      if (char.match(/^[a-zA-Z]*$/)) {
        const i = alphabet.indexOf(char.toLowerCase());
        decrypted +=
          alphabet[i - shift < 0 ? alphabet.length - (shift - i) : i - shift];
      } else {
        decrypted += char.toLowerCase();
      }
    }

    req.data = { ...req.data, decifrado: decrypted };

    fs.writeFile(pathFile, JSON.stringify(req.data), (err) => {
      if (err) {
        fs.unlink(pathFile, (err) => {
          if (err) {
            console.log(err);
          }
        });
        return res.status(500).json({ error: "error saving file" });
      }
    });

    const hash = sha1(decrypted);

    req.data = { ...req.data, resumo_criptografico: hash };

    fs.writeFile(pathFile, JSON.stringify(req.data), (err) => {
      if (err) {
        fs.unlink(pathFile, (err) => {
          if (err) {
            console.log(err);
          }
        });
        return res.status(500).json({ error: "error saving file" });
      }
    });

    return res.json({
      message: "the text has been decrypted and saved in the 'answer.json'",
    });
  }

  async store(req, res) {
    let fd = new FormData();
    fd.append("answer", fs.createReadStream(pathFile));
    console.log(fd);
    let response = {};

    try {
      response = await axios.post(
        `${baseUrl}/submit-solution?token=${req.userToken}`,
        fd,
        {
          headers: fd.getHeaders(),
        }
      );
    } catch (err) {
      console.log(err);
    }

    // console.log(fd.getHeaders());

    // try {
    // } catch (err) {
    //   console.log(err);
    // }

    return res.json(response);
  }
}

export default new EncryptionController();
