import MailFooter from "@/src/lib/mailTemplate/MailFooter";
import MailHeader from "@/src/lib/mailTemplate/MailHeader";

const ConfirmMailTemplate = (message: string, confirmUrl: string) => {
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

        <!-- Button -->
        <tr>
            <td style="padding-bottom: 100px;">
                <table width="100%">
                    <tr>
                        <td style="padding: 0 40px; text-align: center;">
                            <a href="${confirmUrl}">
                                <button>
                                    Confirm
                                </button>
                            </a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        ${MailFooter()}`;
};

export default ConfirmMailTemplate;
