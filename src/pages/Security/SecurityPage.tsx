import { LegalPage } from "../../components/LegalPage/LegalPage";

export function SecurityPage() {
  return (
    <LegalPage title="Security" intro="How we protect your account and data, and how to report a concern.">
      <p>
        <strong>Authentication.</strong> Sign-in is handled by Clerk, a dedicated authentication provider — Hoopin
        never sees or stores your password. Sessions are verified on every request before any account-specific data
        is returned.
      </p>

      <p>
        <strong>Data in transit.</strong> All traffic between the app and our servers is encrypted (HTTPS/TLS).
      </p>

      <p>
        <strong>Access controls.</strong> A run's exact address is only ever included in a response to that run's
        host, or to a requester the host has explicitly approved — this is enforced server-side, not just hidden in
        the interface. Hosting and account actions (approving requests, editing a run, editing your profile) require
        a verified, signed-in session tied to your account.
      </p>

      <p>
        <strong>Infrastructure.</strong> Hoopin runs on Cloudflare's platform (Workers and D1), which provides
        DDoS protection and encryption at rest for stored data.
      </p>

      <p>
        <strong>What you can do.</strong> Use a strong, unique password (or a passkey/social sign-in) for your Hoopin
        account, and don't share your sign-in link or session with anyone else.
      </p>

      <p>
        <strong>Reporting a vulnerability.</strong> If you believe you've found a security issue in Hoopin, please
        report it responsibly rather than exploiting it or disclosing it publicly. <em>Contact information to be
        added.</em> We'll acknowledge reports and keep you updated as we investigate.
      </p>
    </LegalPage>
  );
}
