const { JWE, JWK, JWS } = require('node-jose');
const fs = require('fs');
const { join } = require('path');
const logger = require('./logger/logger');
const Mongo = require('./mongoConnection');


class JWTController {
  #certDir = ".cert";
  #keyStoreFile = join(this.#certDir, 'keystore.json');


  constructor() {/** */ }

  async signingUser(userToSign) {
    try {
      var userKid = await this.getUserInformation(userToSign.email);
      var key = await this.#retriveKey(userKid);
      const opt = { compact: true, jwk: key, fields: { typ: 'jwt' } };
      const payload = JSON.stringify({
        exp: Math.floor((Date.now() + this.#ms(30)) / 1000),
        iat: Math.floor(Date.now() / 1000),
        sub: userToSign.email
      });

      const token = await JWS.createSign(opt, key)
        .update(payload)
        .final();

      return token;
    } catch (error) {
      throw error;
    }
  }

  #ms(minutes) {
    return minutes * 60000;
  }

  async validateKey(token) {
    try {
      const validate = await JWS.createVerify(this.keyStore).verify(token);
      var payload = JSON.parse(validate.payload.toString());

      if (payload.exp < (Date.now() / 1000)) throw "Token expired";

      return {
        email: payload.email
      };
    } catch (error) {
      throw error;
    }
  }

  async initializeKeyStore() {
    if (!fs.existsSync(this.#keyStoreFile)) {
      if (!fs.existsSync(this.#certDir)) {
        fs.mkdirSync(this.#certDir);
      }
      this.keyStore = JWK.createKeyStore();
      logger.info("Generated keystore file");
      fs.writeFileSync(this.#keyStoreFile, JSON.stringify(this.keyStore.toJSON(true)))
    }
    else {
      logger.info("Keystore finded importing")
      const ks = fs.readFileSync(join('.cert', 'keystore.json'));
      this.keyStore = await JWK.asKeyStore(ks.toString());
    }
  }

  async getUserInformation(email) {
    const mongo = new Mongo();
    try {
      const user = mongo.find('user', { email: email });
      return user.kid;
    } catch (error) {
      return null;
    }
  }

  async #retriveKey(kid) {
    // si esta vencido generar un nuevo token borrar viejo crear nuevo.
    //Guardar el kid
    const mongo = new Mongo();
    var key = this.keyStore.get(kid);

    if (key) {
      this.keyStore.remove(key);
    }

    key = await this.#generate_key(email);
    mongo.update('user', {kid: kid}, {kid: key.kid});

    return key;
  }

  async #generate_key(email) {
    try {
      var key = await this.keyStore.generate('RSA', 2048, { alg: 'RS256', use: 'sig' });
      fs.writeFileSync(this.#keyStoreFile, JSON.stringify(this.keyStore.toJSON(true)));
      return key;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = JWTController;