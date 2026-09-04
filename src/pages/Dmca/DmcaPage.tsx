import { LegalPage } from "../../components/LegalPage/LegalPage";

export function DmcaPage() {
  return (
    <LegalPage
      title="Copyright / DMCA Policy"
      intro="How to report content you believe infringes your copyright, and how we respond."
    >
      <p>
        Hoopin respects intellectual property rights and responds to clear notices of alleged copyright infringement
        under the Digital Millennium Copyright Act (DMCA). Run titles, descriptions, and profile bios are written by
        users — if you believe something posted on Hoopin infringes your copyright, you can submit a takedown notice.
      </p>

      <p>
        <strong>To file a notice, include:</strong>
      </p>
      <ul>
        <li>A description of the copyrighted work you claim has been infringed.</li>
        <li>The specific URL or location within Hoopin of the material you claim is infringing.</li>
        <li>Your name, address, phone number, and email address.</li>
        <li>
          A statement that you have a good-faith belief that the use is not authorized by the copyright owner, its
          agent, or the law.
        </li>
        <li>
          A statement, made under penalty of perjury, that the information in the notice is accurate and that you
          are the copyright owner or authorized to act on their behalf.
        </li>
        <li>Your physical or electronic signature.</li>
      </ul>

      <p>
        <strong>Where to send it.</strong> <em>Designated agent contact information to be added.</em>
      </p>

      <p>
        <strong>Counter-notification.</strong> If content you posted was removed and you believe it was removed in
        error, you may submit a counter-notification identifying the removed material and stating, under penalty of
        perjury, that you have a good-faith belief it was removed by mistake or misidentification. We'll forward
        valid counter-notifications to the original complainant.
      </p>

      <p>
        <strong>Repeat infringers.</strong> We may suspend or terminate the accounts of users who are found to
        repeatedly infringe others' copyrights.
      </p>
    </LegalPage>
  );
}
