import { LegalPage } from "../../components/LegalPage/LegalPage";

export function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="What we collect, why, and how it's shared — in plain language."
    >
      <p>
        <strong>Account &amp; identity data.</strong> Sign-up and sign-in are handled by Clerk, our authentication
        provider. Depending on how you sign up, this includes your name, email address, or phone number. We use this
        to create your Hoopin account and to show your name/initials to other users on runs you host or join.
      </p>

      <p>
        <strong>Profile data.</strong> Your bio and any other profile fields you fill in are stored so they can be
        shown on your public profile within the app.
      </p>

      <p>
        <strong>Run &amp; request data.</strong> When you host a run, we store what you enter — title, description,
        schedule, venue name, exact address, capacity, and visibility. When you request to join a run, we store your
        message and the request's status. A run's exact address is only shown to the host and to requesters the host
        has approved — see the "Court" section of any run for how that's gated.
      </p>

      <p>
        <strong>How we share data.</strong> We don't sell your data. A run's public details (title, time, venue name,
        host, going count) are visible to anyone browsing Hoopin, including signed-out visitors, unless the host
        marks it private. Your exact address on a run you host is only ever shown to you and to players you've
        approved. We share data with service providers who help run Hoopin (currently Clerk for authentication and
        Cloudflare for hosting/infrastructure), bound to only use it to provide those services.
      </p>

      <p>
        <strong>Local storage.</strong> The app may store lightweight preferences (like your last-selected city
        filter) in your browser. This isn't sent to us and stays on your device.
      </p>

      <p>
        <strong>Data retention.</strong> We keep your account, run, and request data for as long as your account is
        active. If you delete your account, we remove your profile data; runs you hosted or requests you made may be
        retained in an anonymized form to keep other users' history (like a run's roster) intact.
      </p>

      <p>
        <strong>Your rights.</strong> You can view and edit your profile in the Account page at any time. To request
        deletion of your account or data, <em>contact information to be added</em>.
      </p>

      <p>
        <strong>Children's privacy.</strong> Hoopin isn't directed at children, and we don't knowingly collect data
        from anyone under 13.
      </p>

      <p>
        <strong>Changes to this policy.</strong> We may update this policy as the product changes. We'll update the
        date this page was last revised when we do.
      </p>

      <p>
        <strong>Contact.</strong> Questions about this policy or your data? <em>Contact information to be added.</em>
      </p>
    </LegalPage>
  );
}
