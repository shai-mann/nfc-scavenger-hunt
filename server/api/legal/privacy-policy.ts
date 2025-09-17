import { VercelRequest, VercelResponse } from "@vercel/node";
import { withMethodRestriction } from "../../lib/api";

async function privacyPolicyHandler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(
    `
    <!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Privacy Policy — NFC Hunt</title>
    <style>
      body {font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial; line-height:1.6; color:#111; max-width:900px; margin:40px auto; padding:0 20px;}
      h1,h2,h3 {color:#0b2545}
      header {border-bottom:1px solid #e6e9ef; padding-bottom:12px; margin-bottom:20px}
      p {margin:0 0 12px}
      ul {margin:0 0 12px 20px}
      .meta {color:#596174; font-size:0.95em}
      .footnote {font-size:0.92em; color:#596174; margin-top:24px}
      a.button {display:inline-block; padding:8px 12px; border-radius:6px; border:1px solid #cfd8e3; text-decoration:none; color:#0b2545; background:#f8fbff}
    </style>
  </head>
  <body>
    <header>
      <h1>Privacy Policy for NFC Hunt</h1>
      <div class="meta">Effective Date: 17 September 2025</div>
    </header>

    <main>
      <p>NFC Hunt ("the App," "we," "our," or "us") respects your privacy and is committed to protecting it. This Privacy Policy explains what information we collect, how we use it, and your rights when you use NFC Hunt.</p>

      <h2>1. Information We Collect</h2>
      <p>When you use NFC Hunt, we collect only the minimal information necessary to provide and improve the App:</p>
      <ul>
        <li><strong>Username</strong>: The name you choose to represent yourself in the App.</li>
        <li><strong>Game Progress</strong>: Your scavenger hunt clue progress and leaderboard status.</li>
        <li><strong>Device Identifier</strong>: We may collect your device’s <strong>MAC ID</strong> to connect your account to your device and help prevent cheating.</li>
        <li><strong>Diagnostic &amp; Usage Data</strong>: Through analytics vendors (for example, Datadog, PostHog, and Sentry), we may collect anonymized information related to crashes, errors, and general usage to help us improve the App.</li>
      </ul>
      <p>We do <strong>not</strong> collect or request any personally identifying information such as your real name, email address, phone number, or precise location unless you provide such information separately (for example, if you contact us via email).</p>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>To provide core game functionality (usernames, clue progress, leaderboards).</li>
        <li>To maintain game fairness by linking accounts to devices via MAC ID.</li>
        <li>To improve performance, stability, and features of the App through analytics.</li>
        <li>To detect and resolve technical issues and bugs.</li>
      </ul>

      <h2>3. Sharing of Information</h2>
      <p>We do not sell, rent, or trade your information to third parties. We may share limited data with trusted third-party service providers (for example, Datadog, PostHog, and Sentry) solely to provide analytics, error reporting, and performance monitoring services. These vendors are contractually obligated to safeguard your information and to use it only to provide services to us.</p>
      <p>No other sharing of information occurs except as required by applicable law (for example, to comply with a valid legal process) or to protect the rights, property, or safety of NFC Hunt, its users, or the public.</p>

      <h2>4. Data Retention</h2>
      <ul>
        <li><strong>Game Progress &amp; Username</strong>: Retained for as long as you maintain your account to allow gameplay continuity and leaderboard functionality.</li>
        <li><strong>MAC ID</strong>: Retained only for the purpose of linking your account to your device to prevent cheating.</li>
        <li><strong>Diagnostic &amp; Usage Data</strong>: Retained in accordance with the policies of our analytics vendors and as necessary to diagnose and fix issues.</li>
      </ul>
      <p>If you uninstall the App, we may retain limited anonymized usage data but will no longer actively associate such data with your device.</p>

      <h2>5. Your Rights</h2>
      <p>Depending on your jurisdiction, you may have the right to:</p>
      <ul>
        <li>Access the information we have about you.</li>
        <li>Request deletion of your data.</li>
        <li>Object to or restrict certain uses of your information.</li>
      </ul>
      <p>To exercise these rights, please contact us at <a href="mailto:ddnfchunt@gmail.com">ddnfchunt@gmail.com</a>.</p>

      <h2>6. Security</h2>
      <p>We implement reasonable administrative, technical, and physical safeguards intended to protect your information from unauthorized access, disclosure, alteration, or destruction. However, no system can guarantee absolute security.</p>

      <h2>7. Children’s Privacy</h2>
      <p>NFC Hunt is not directed to children under the age of 13 (or the minimum age required in your jurisdiction). We do not knowingly collect personal information from children. If we become aware that we have collected personal information from a child without parental consent, we will take steps to delete such information promptly.</p>

      <h2>8. Changes to This Policy</h2>
      <p>We may update this Privacy Policy from time to time. If we make material changes we will update the "Effective Date" above and may provide additional notice within the App.</p>

      <h2>9. Contact Us</h2>
      <p>If you have questions or concerns about this Privacy Policy or our data practices, please contact us at:</p>
      <p><strong>Email:</strong> <a href="mailto:ddnfchunt@gmail.com">ddnfchunt@gmail.com</a></p>
    </main>

    <footer>
      <p class="meta">© NFC Hunt. All rights reserved.</p>
    </footer>
  </body>
</html>
`
  );
}

export default withMethodRestriction(["GET"], privacyPolicyHandler);
