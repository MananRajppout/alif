import themeSettings from "@/theme_config";

const MailHeader = () => {
  // today date
  const date = new Date().toDateString();

  // theme colors
  const { site_name, site_url, site_link, primary, header_bg, header_text } =
    themeSettings;

  return `<!DOCTYPE html>
<html>

<head>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type"/>
    <meta content="IE=edge" http-equiv="X-UA-Compatible"/>
    <link href="https://fonts.googleapis.com" rel="preconnect">
    <link crossorigin href="https://fonts.gstatic.com" rel="preconnect">
    <title>${site_name}</title>
    <style type="text/css">@import url(https://fonts.googleapis.com/css2?family=Jost:wght@400;500;700&display=swap);body{background-color:#f6f6f6;font-family:"Jost","arial",sans-serif;-webkit-font-smoothing:antialiased;line-height:1.4;margin:0;padding:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}table{border-spacing:0}td{padding:0}img{border:0}h2{color:${primary};font-family:"Jost","arial",sans-serif;font-size:24px;font-weight:500}h3{color:${primary};font-family:"Jost","arial",sans-serif;font-size:24px;font-weight:500}h4{color:#13161C;font-family:"Jost","arial",sans-serif;font-size:24px;font-weight:500;line-height:120%}p{color:#66737F;font-family:"Jost","arial",sans-serif;font-size:18px;font-weight:400;line-height:120%}a{color:${primary};text-decoration:none}button{background:${primary};border:none;border-radius:8px;box-shadow:0 8px 20px ${primary}21;color:#fff;cursor:pointer;font-size:16px;font-weight:400;margin:24px 0;padding:12px 51px}.highlights{background:${primary}21;border-radius:8px;color:#13161C;font-size:20px;font-weight:400;line-height:120%;margin:0 40px;padding:16px}.wrapper{background-color:#f6f6f6;padding-bottom:60px;table-layout:fixed;width:100%}.main{background-color:#fff;border-spacing:0;color:#66737F;font-family:"Jost","arial",sans-serif;margin:0 auto;max-width:640px;width:100%}.header-columns{align-items:center;display:flex}.header-columns .column{max-width:320px;width:100%}.header-columns .logo{text-align:left}.header-columns .address{text-align:right}.footer-columns .column{width:100%}.footer-columns .copyright{text-align:left}.footer-columns .social{justify-content:end}@media only screen and (max-width:620px){.main{width:100%}.header-columns{flex-direction:column}.header-columns .column{width:100%}.header-columns .logo{text-align:center}.header-columns .address{text-align:center}.footer-columns{flex-direction:column}.footer-columns .column{width:100%}.footer-columns .copyright{text-align:center}.footer-columns .social{justify-content:center}}</style>
</head>

<body>
<center class="wrapper" >
    <table class="main" width="100%">
        <!-- Header -->
        <tr>
            <td style="background-color: ${header_bg}; padding: 22px 40px;">
                <table width="100%">
                    <tr>
                        <td class="header-columns">
                            <table class="column">
                                <tr>
                                    <td class="logo">
                                        <a href={site_link}>
                                            <h1 style="font-size: 32px; color: ${header_text}; font-weight: 700; margin: 0;">
                                                ${site_name}
                                            </h1>
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <table class="column">
                                <tr>
                                    <td class="address">
                                        <a href={site_link}
                                           style="color:${header_text}; font-size: 24px; font-weight: 500; text-decoration: none; margin-bottom: 8px;">
                                            ${site_url}
                                        </a>
                                        <p style="font-weight: 400; font-size: 16px; color:${header_text}; margin: 0;">
                                            ${date}
                                        </p>
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>

                </table>
            </td>
        </tr>`;
};

export default MailHeader;
