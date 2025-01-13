import themeSettings from "@/theme_config";

const MailFooter = () => {
  // year from today date
  const year = new Date().getFullYear();

  // theme colors
  const { site_name, site_link, footer_bg, footer_text } = themeSettings;

  return `<!-- Footer -->
        <tr>
            <td style="background-color: ${footer_bg}; padding: 14px 40px;">
                <table width="100%">
                    <tr>
                        <td class="footer-columns" style=" display: flex; align-items: center;">
                            <table class="column">
                                <tr>
                                    <td class="copyright">
                                        <p style="font-size: 14px; font-weight: 400; color: ${footer_text};">
                                            © ${year} ${site_name}
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            <table class="column">
                                <tr style="display: table-cell;">
                                    <td class="social" style="display: flex; align-items: center;">
                                        <a href=${`${site_link}/about-us`}
                                           style="font-size: 14px; color:${footer_text}; display: inline-block;  display: flex; align-items: center; justify-content: center; margin-left: 18px;">
                                            About Us
                                        </a>
                                        <a href=${`${site_link}/contact-us`}
                                           style="font-size: 14px; color:${footer_text}; display: inline-block;  display: flex; align-items: center; justify-content: center; margin-left: 18px;">
                                            Contact Us
                                        </a>
                                        <a href=${`${site_link}/find-job`}
                                           style="font-size: 14px; color:${footer_text}; display: inline-block;  display: flex; align-items: center; justify-content: center; margin-left: 18px;">
                                            Find Job
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>

    </table>
</center>
</body>

</html>`;
};

export default MailFooter;
