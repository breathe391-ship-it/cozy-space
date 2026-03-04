import jwt from "jsonwebtoken";
import fs from "fs";

export default function handler(req, res) {
  try {
    const privateKey = process.env.JITSI_PRIVATE_KEY;

    const payload = {
      aud: "jitsi",
      iss: process.env.JITSI_APP_ID,
      sub: "8x8.vc",
      room: "*",
      exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour
      context: {
        user: {
          name: "Host"
        }
      }
    };

    const token = jwt.sign(payload, privateKey, {
      algorithm: "RS256"
    });

    res.status(200).json({ token });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
