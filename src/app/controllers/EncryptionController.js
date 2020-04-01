import axios from "axios";
import fs from "fs";
import sha1 from "sha1";
import { resolve } from "path";

const baseUrl =
  "https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=";

const caminhoArquivo = resolve("files", "answer.json");

class EncryptionController {
  async index(req, res) {
    try {
      const { data } = await axios.get(`${baseUrl}${req.userToken}`);
      req.data = data;
    } catch ({ message }) {
      return res.json({ error: message });
    }

    fs.writeFile(caminhoArquivo, JSON.stringify(req.data), err => {
      if (err) {
        fs.unlink(caminhoArquivo, err => {
          if (err) {
            console.log(err);
          }
        });
        return res.status(500).json({ error: "error saving file" });
      }
    });

    const { numero_casas, cifrado } = req.data;

    const alfabeto = "a b c d e f g h i j k l m n o p q r s t u v w x y z".split(
      " "
    );

    let decifrado = "";

    for (const caractere of cifrado) {
      if (caractere.match(/^[a-zA-Z]*$/)) {
        const i = alfabeto.indexOf(caractere.toLowerCase());
        decifrado +=
          alfabeto[
            i - numero_casas < 0
              ? alfabeto.length - (numero_casas - i)
              : i - numero_casas
          ];
      } else {
        decifrado += caractere.toLowerCase();
      }
    }

    req.data = { ...req.data, decifrado };

    fs.writeFile(caminhoArquivo, JSON.stringify(req.data), err => {
      if (err) {
        fs.unlink(caminhoArquivo, err => {
          if (err) {
            console.log(err);
          }
        });
        return res.status(500).json({ error: "error saving file" });
      }
    });

    const resumo_criptografico = sha1(decifrado);

    req.data = { ...req.data, resumo_criptografico };

    fs.writeFile(caminhoArquivo, JSON.stringify(req.data), err => {
      if (err) {
        fs.unlink(caminhoArquivo, err => {
          if (err) {
            console.log(err);
          }
        });
        return res.status(500).json({ error: "error saving file" });
      }
    });

    return res.json({
      message: "the text has been decrypted and saved in the 'awnser.json'"
    });
  }
}

export default new EncryptionController();
