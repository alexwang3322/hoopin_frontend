import { useNavigate } from "react-router-dom";
import styles from "./DisclaimerPage.module.css";

export function DisclaimerPage() {
  const navigate = useNavigate();

  return (
    <div>
      <div className={styles.pageHead}>
        <h1>Disclaimer &amp; Liability Waiver</h1>
        <p>Please read and understand before you play. By creating an account, hosting, or joining a run, you agree to the terms below.</p>
      </div>

      <div className={styles.body}>
        <p>
          <strong>Demo product.</strong> Hoopin is a design prototype. Every user, run, request, and message shown is
          sample data and resets on reload — no real games are scheduled through this app.
        </p>

        <p>
          <strong>Assumption of risk.</strong> Basketball and other physical activity carry an inherent risk of injury,
          including sprains, fractures, collisions, and cardiac events. By joining or hosting a run, you voluntarily
          assume these risks and take full responsibility for your own health and safety. Consult a physician before
          starting any new physical activity — Hoopin does not supervise, insure, or medically screen any run or
          participant.
        </p>

        <p>
          <strong>User-generated content.</strong> Run titles, descriptions, bios, join-request messages, and decline
          reasons are written by users, not by Hoopin. We don't review, verify, or endorse this content before it's
          shown to others, and it doesn't reflect Hoopin's views. You're solely responsible for anything you post, and
          agree not to post content that's false, unlawful, infringing, harassing, or unsafe. We may remove or decline
          to display any content at any time, for any reason, without notice.
        </p>

        <p>
          <strong>Service availability.</strong> Hoopin is provided on an "as available" basis. We don't guarantee
          that the app, or any run, request, or message in it, will be available, uninterrupted, error-free, or
          preserved. To the fullest extent the law allows, Hoopin is not liable for lost data, missed runs, or other
          damages resulting from downtime, maintenance, technical failure, or discontinuation of the service.
        </p>

        <p>
          <strong>User-organized activity.</strong> Runs are created and run by individual users, not by Hoopin. We
          don't verify hosts, venues, or participants, and we aren't responsible for the accuracy of a listing, the
          conduct of any user, or disputes between users.
        </p>

        <p>
          <strong>Meeting people safely.</strong> Exact addresses are shared only with approved participants, at the
          host's discretion. Use your own judgment when meeting people you don't know, and prefer public, well-lit
          venues.
        </p>

        <p>
          <strong>Release of claims between users.</strong> To the fullest extent the law allows, you release Hoopin
          from any and all claims, demands, damages, or losses — known or unknown — arising from your interactions
          with other users, whether those interactions happen in the app or in person at a run. This release doesn't
          apply to Hoopin's own gross negligence or willful misconduct, where the law doesn't allow it to be waived.
        </p>

        <p>
          <strong>Third-party links and services.</strong> Hoopin may link to or rely on third-party sites and
          services — for example, maps or venue pages — that we don't own or control. We aren't responsible for the
          content, accuracy, security, or privacy practices of any third-party site, and linking to one isn't an
          endorsement of it.
        </p>

        <p>
          <strong>No warranty; limitation of liability.</strong> This application is provided "as is" and "as
          available," without warranties of any kind, express or implied. To the fullest extent the law allows, Pull
          Up disclaims all liability — direct, indirect, incidental, or consequential — for any injury, loss, or
          damage arising from your use of the app or participation in any listed run.
        </p>
      </div>

      <button type="button" className={styles.backLink} onClick={() => navigate(-1)}>
        &larr; Back
      </button>
    </div>
  );
}
