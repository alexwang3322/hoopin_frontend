import { LegalPage } from "../../components/LegalPage/LegalPage";

export function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      intro="These terms govern your use of Hoopin. By creating an account or using the app, you agree to them."
    >
      <p>
        <strong>1. The service.</strong> Hoopin lets users create ("host") and join ("request to play") pickup
        basketball runs. We provide the platform that connects hosts and players — we don't organize, staff, insure,
        or supervise any run ourselves.
      </p>

      <p>
        <strong>2. Accounts.</strong> You need an account to host a run, request to join one, or see a run's exact
        address. You're responsible for keeping your account credentials secure and for all activity under your
        account. You must be able to form a binding contract to use Hoopin, and you agree to provide accurate
        information when signing up.
      </p>

      <p>
        <strong>3. Hosting and joining runs.</strong> As a host, you're responsible for the accuracy of what you post
        (time, location, format, capacity) and for how you manage requests to join. As a requester, you're
        responsible for showing up as agreed or withdrawing your request if your plans change. Hoopin doesn't
        guarantee that any run will happen, that a host will approve your request, or that a listed run is safe,
        suitable, or accurately described.
      </p>

      <p>
        <strong>4. Acceptable use.</strong> Don't use Hoopin to harass, threaten, or discriminate against anyone;
        post false, misleading, or unlawful content; impersonate another person; scrape or automate access to the
        service; or attempt to bypass any access control (for example, viewing an exact address you weren't approved
        for). We may suspend or terminate accounts that violate this section.
      </p>

      <p>
        <strong>5. Content you post.</strong> You keep ownership of the run descriptions, messages, and profile
        content you post, but you grant Hoopin a license to display it within the app so the product can function.
        You're solely responsible for anything you post — see the{" "}
        <a href="/disclaimer">Disclaimer &amp; Liability Waiver</a> for more on user-generated content.
      </p>

      <p>
        <strong>6. Assumption of risk and liability.</strong> Basketball and organizing in-person meetups carry
        inherent risk. Full detail on assumption of risk, release of claims between users, and limitation of
        liability is in the <a href="/disclaimer">Disclaimer &amp; Liability Waiver</a>, which is part of these
        Terms.
      </p>

      <p>
        <strong>7. Termination.</strong> You may stop using Hoopin and delete your account at any time. We may
        suspend or terminate your access if you violate these Terms, at our discretion.
      </p>

      <p>
        <strong>8. Changes to these terms.</strong> We may update these Terms as the product changes. Continued use
        of Hoopin after an update means you accept the revised Terms.
      </p>

      <p>
        <strong>9. Governing law.</strong> <em>To be finalized.</em>
      </p>

      <p>
        <strong>10. Contact.</strong> Questions about these Terms? <em>Contact information to be added.</em>
      </p>
    </LegalPage>
  );
}
