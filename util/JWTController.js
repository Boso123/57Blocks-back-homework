const { JWE, JWK, JWS } = require('node-jose');
const fs = require('fs');
const { join } = require('path');
const logger = require('./logger/logger');
const Mongo = require('./mongoConnection');


class JWTController {
  #certDir = ".cert";
  #keyStoreFile = join(this.#certDir, 'keystore.json');


  constructor() {/** */ }

  /**
   * Generates a new token for a user.
   * @param {*} userToSign Email of the user to generate the new token
   * @returns `string` JWT token as string
   */
  async signingUser(userToSign) {
    try {
      var userKid = await this.getUserInformation(userToSign.email);
      var key = await this.#retriveKey(userKid, userToSign.email);
      const opt = { compact: true, jwk: key, fields: { typ: 'jwt' } };
      const payload = JSON.stringify({
        exp: Math.floor((Date.now() + this.#ms(20)) / 1000),
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

  /**
   * Convert pass minutes in milliseconds
   * @param {*} minutes Minutes to convert
   * @returns `Number` milliseconds
   */
  #ms(minutes) {
    return minutes * 60000;
  }

  /**
   * Validates a JWT token
   * @param {*} token JWT token
   * @returns email of the user in the token
   */
  async validateKey(token) {
    try {
      const validate = await JWS.createVerify(this.keyStore).verify(token);
      var payload = JSON.parse(validate.payload.toString());

      if (payload.exp < (Date.now() / 1000)) throw "Token expired";

      return {
        email: payload.sub
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Charge in the system credentials saved in the internal storage
   */
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
      logger.info("Keystore founded importing")
      const ks = fs.readFileSync(join('.cert', 'keystore.json'));
      this.keyStore = await JWK.asKeyStore(ks.toString());
    }
  }
  
  /**
   * Retrives user key kid
   * @param {*} email Email to find user
   * @returns kid of the key 
   */
  async getUserInformation(email) {
    const mongo = new Mongo();
    try {
      const user = await mongo.find('user', { email: email });
      return user[0].kid;
    } catch (error) {
      return null;
    }
  }

  /**
   * Generates a new key
   * @param {*} kid previusly key of the user
   * @param {*} email User to generate the key
   * @returns A new JWK key for the user
   */
  async #retriveKey(kid, email) {   
    if (kid) {
      var key = this.keyStore.get({ kid: kid });
      this.keyStore.remove(key);
    }
    
    key = await this.#generate_key();
    const mongo = new Mongo();
    mongo.update('user', { email: email }, { kid: key.kid, lastConnection: Date.now()});

    return key;
  }

  /**
   * Create a new RSA key and saved in the storage
   * @returns New key
   */
  async #generate_key() {
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