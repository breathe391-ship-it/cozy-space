import jwt from "jsonwebtoken";
import fs from "fs";

export default function handler(req, res) {
  try {
    const privateKey = process.env.JITSI_PRIVATE_KEY;

  const payload = {
  aud: "jitsi",
  iss: "chat",
  sub: process.env.JITSI_APP_ID,
  room: "*",
  exp: Math.floor(Date.now() / 1000) + (60 * 60),

  context: {
    features: {
      livestreaming: true,
      recording: true,
      transcription: true,
      "outbound-call": true
    },

    user: {
      moderator: true,
      name: "Cozy User"
    }
  }
};

    const token = jwt.sign(payload, privateKey, {
  algorithm: "RS256",
  header: {
    kid: process.env.JITSI_KEY_ID
  }
});

    res.status(200).json({ token });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
