import { LegalPage } from "../../components/LegalPage/LegalPage";

export function AboutPage() {
  return (
    <LegalPage title="About Hoopin" intro="Pickup basketball, organized.">
      <p>
        Hoopin is a simple way to find and host pickup basketball runs. Instead of a group chat that goes stale or a
        regular run that's hard for new people to find, hosts post a run once — time, court, format, and capacity —
        and players request to play.
      </p>

      <p>
        <strong>How it works.</strong> Browse runs near you on Discover, or host your own from "Host a run." Players
        send a request to join; hosts approve or decline. Once you're approved, the exact address unlocks — courts
        stay unlisted publicly so hosts control who shows up. Auto-approve is available for hosts who'd rather skip
        the review step for an open run.
      </p>

      <p>
        <strong>Who it's for.</strong> Regulars who want an easier way to fill out their weekly run, and anyone
        looking to find a game without already knowing a crew.
      </p>

      <p>
        <strong>Where we are.</strong> Hoopin is early — we're still building out the basics and shipping fixes and
        features quickly. If something's confusing, missing, or plain broken, we want to hear about it.{" "}
        <em>Contact information to be added.</em>
      </p>
    </LegalPage>
  );
}
