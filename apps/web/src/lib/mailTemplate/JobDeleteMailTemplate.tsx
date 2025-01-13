import MailFooter from "@/src/lib/mailTemplate/MailFooter";
import MailHeader from "@/src/lib/mailTemplate/MailHeader";

const JobDeleteMailTemplate = (
  message: string | undefined,
  jobInfo: { jobTitle: string; category: string } | undefined
) => {
  // full html template here
  return `${MailHeader()}
        <!-- Highlight -->
        <tr>
            <td style="padding-top: 40px;">
                <table width="100%">
                    <tr>
                        <td style="padding-top: 40px;">
                            <p class="highlights">
                                ${message}
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>

        <!-- Body -->
        <tr>
            <td style="padding: 24px 40px;">
                <table width="100%">

                    <tr>
                        <td>
                            <p><strong>Details:</strong></p>
                            <p style="margin: 0;">Job Title: <span
                                    style="font-size: 15px;">${
                                      jobInfo?.jobTitle
                                    }</span></p>
                            <p style="margin: 0;">Job Category: <span
                                    style="font-size: 15px;">${
                                      jobInfo?.category
                                    }</span></p> ,
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
        ${MailFooter()}`;
};

export default JobDeleteMailTemplate;
