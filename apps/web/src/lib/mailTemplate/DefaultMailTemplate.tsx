import MailFooter from "@/src/lib/mailTemplate/MailFooter";
import MailHeader from "@/src/lib/mailTemplate/MailHeader";

const DefaultMailTemplate = (message: string) => {
  // full html template here
  return `${MailHeader()}
        <!-- Highlight -->
        <tr>
            <td style="padding-top: 40px; padding-bottom: 120px;">
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
        ${MailFooter()}`;
};

export default DefaultMailTemplate;
