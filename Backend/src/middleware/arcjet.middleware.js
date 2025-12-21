// import aj from "../lib/arcjet.lib.js";
// import { isSpoofedBot } from "@arcjet/inspect";

// export const arcjetProtection = async (req, res, next) => {
//   try {
//     const decision = await aj.protect(req);

//     if (decision.isDenied()) {
//       if (decision.reason.isRateLimit()) {
//         return res
//           .status(429)
//           .send("Too Many Requests - your IP is being rate limited.");
//       } 
//       else if (decision.reason.isBot()) {
//         return res
//           .status(403)
//           .send("Access Denied - bot traffic is not allowed.");
//       } 
//       else {
//         return res.status(403).send("Access Denied.");
//       }
//     }

//     // Check for spoofed bots
//     if (decision.results.some(isSpoofedBot)) {
//       return res
//         .status(403)
//         .send("Access Denied - spoofed bots are not allowed.");
//     }

//     next(); // only reaches here if request is allowed
//   } catch (error) {
//     console.error("Arcjet Protection Error:", error);
//     next(); // fail-open behavior
//   }
// };
