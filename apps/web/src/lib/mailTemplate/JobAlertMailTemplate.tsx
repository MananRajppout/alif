import MailFooter from "@/src/lib/mailTemplate/MailFooter";
import MailHeader from "@/src/lib/mailTemplate/MailHeader";
import theme_config from "@/theme_config";

const JobAlertMailTemplate = (message: string) => {
  const { primary } = theme_config;
  // full html template here
  return `${MailHeader()}
        <!-- Heading -->
        <tr>
            <td>
                <table width="100%">
                    <tr>
                        <td style="padding: 40px 40px 0 40px;">
                            <h2 style="margin: 0; font-weight: 500;font-size: 24px;color: ${primary};font-family: 'Jost', 'arial', sans-serif;text-align: center;">
                                Job Alert
                            </h2>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>

        <!-- Highlight -->
        <tr>
            <td style="padding-top: 30px; padding-bottom: 120px;">
                <table width="100%">
                    <tr>
                        <td style="padding-top: 40px; text-align: center;">
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

export default JobAlertMailTemplate;
