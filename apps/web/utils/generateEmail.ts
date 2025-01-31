export const generateMail = (content:string) => (`
    <!DOCTYPE html>
            <html>

            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <title>Meta Jobs</title>
                <style type="text/css">
                    @import url('https://fonts.googleapis.com/css2?family=Jost:wght@400;500;700&display=swap');

                    body {
                        background-color: #f6f6f6;
                        font-family: 'Jost', 'arial', sans-serif;
                        -webkit-font-smoothing: antialiased;
                        line-height: 1.4;
                        margin: 0;
                        padding: 0;
                        -ms-text-size-adjust: 100%;
                        -webkit-text-size-adjust: 100%;
                    }

                    table {
                        border-spacing: 0;
                    }

                    td {
                        padding: 0;
                    }

                    img {
                        border: 0;
                    }

                    h2 {
                        font-weight: 500;
                        font-size: 24px;
                        color: #1CAF57;
                        font-family: 'Jost', 'arial', sans-serif;
                    }

                    h3 {
                        font-weight: 500;
                        font-size: 24px;
                        color: #1CAF57;
                        font-family: 'Jost', 'arial', sans-serif;
                    }

                    h4 {
                        font-weight: 500;
                        font-size: 24px;
                        line-height: 120%;
                        color: #13161C;
                        font-family: 'Jost', 'arial', sans-serif;
                    }

                    p {
                        font-weight: 400;
                        font-size: 18px;
                        color: #66737F;
                        line-height: 120%;
                        font-family: 'Jost', 'arial', sans-serif;
                    }

                    a {
                        color: #1CAF57;
                        text-decoration: none;
                    }

                    button {
                        background: #1CAF57;
                        box-shadow: 0px 8px 20px rgba(28, 175, 87, 0.4);
                        border-radius: 8px;
                        padding: 12px 51px;
                        border: none;
                        color: #ffffff;
                        font-weight: 400;
                        font-size: 16px;
                        margin: 24px 0;
                        cursor: pointer;
                    }

                    .highlights {
                        font-weight: 400;
                        font-size: 20px;
                        line-height: 120%;
                        color: #13161C;
                        background: rgba(28, 175, 87, 0.1);
                        border-radius: 8px;
                        margin: 0 40px;
                        padding: 16px;
                    }

                    .wrapper {
                        width: 100%;
                        table-layout: fixed;
                        background-color: #f6f6f6;
                        padding-bottom: 60px;
                    }

                    .main {
                        background-color: #ffffff;
                        margin: 0 auto;
                        width: 100%;
                        max-width: 640px;
                        border-spacing: 0;
                        font-family: 'Jost', 'arial', sans-serif;
                        color: #66737F;
                    }

                    .header-columns {
                        display: flex;
                        align-items: center;
                    }

                    .header-columns .column {
                        width: 100%;
                        max-width: 320px;
                    }

                    .header-columns .logo {
                        text-align: left;
                    }

                    .header-columns .address {
                        text-align: right;
                    }

                    .footer-columns {
                        display: flex;
                    }

                    .footer-columns .column {
                        width: 100%;
                    }

                    .footer-columns .copyright {
                        text-align: left;
                    }

                    .footer-columns .social {
                        display: flex;
                        justify-content: end;
                        align-items: center;
                    }

                    /* -------------------------------------
                      RESPONSIVE AND MOBILE FRIENDLY STYLES
                  ------------------------------------- */
                    @media only screen and (max-width: 620px) {
                        .main {
                            width: 100%;
                        }

                        .header-columns {
                            flex-direction: column;
                        }

                        .header-columns .column {
                            width: 100%;
                        }

                        .header-columns .logo {
                            text-align: center;
                        }

                        .header-columns .address {
                            text-align: center;
                        }

                        .footer-columns {
                            flex-direction: column;
                        }

                        .footer-columns .column {
                            width: 100%;
                        }

                        .footer-columns .copyright {
                            text-align: center;
                        }

                        .footer-columns .social {
                            justify-content: center;
                        }
                    }
                </style>
            </head>

            <body>
                <center class="wrapper">
                    <table class="main" width="100%">
                        <!-- Header -->
                        <tr>
                            <td style="background-color: #1CAF57; padding: 22px 40px;">
                                <table width="100%">

                                    <tr>
                                        <td class="header-columns">

                                            <table class="column">
                                                <tr>
                                                    <td class="logo">
                                                        <a href="https://metajobs-frontend.vercel.app">
                                                            <h1
                                                                style="font-size: 32px; color: #13161C; font-weight: 700; margin: 0;">
                                                                Meta
                                                                <span style="color: #ffffff;">Jobs</span>
                                                            </h1>
                                                        </a>
                                                    </td>
                                                </tr>
                                            </table>

                                            <table class="column">
                                                <tr>
                                                    <td class="address">
                                                        <a href="#"
                                                            style="color:#ffffff; font-size: 24px; font-weight: 500; text-decoration: none; margin-bottom: 8px;">
                                                            www.metajobs.net
                                                        </a>
                                                        <p style="font-weight: 400; font-size: 16px; color:#ffffff; margin: 0;">
                                                             ${new Date().toLocaleTimeString()}
                                                        </p>
                                                    </td>
                                                </tr>
                                            </table>

                                        </td>
                                    </tr>

                                </table>
                            </td>
                        </tr>

                        <!-- Highlight -->
                        <tr>
                            <td style="padding-top: 40px; padding-bottom: 100px;">
                                <table width="100%">
                                    <tr>
                                        <td style="padding-top: 40px;">
                                             <p class="highlights">
                                                ${content}
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #13161C; padding: 14px 40px;">
                                <table width="100%">
                                    <tr>
                                        <td class="footer-columns" style="align-items: center;">
                                            <table class="column">
                                                <tr>
                                                    <td class="copyright">
                                                        <p style="font-size: 14px; font-weight: 400; color:#a8aca9;">
                                                            © 2022 Mata Jobs
                                                        </p>
                                                    </td>
                                                </tr>
                                            </table>
                                            <table class="column">
                                                <tr style="display: table-cell;">
                                                    <td class="social" style="display: flex; align-items: center;">
                                                        <a href="https://metajobs-frontend.vercel.app/about-us"
                                                            style="font-size: 14px; color:#a8aca9; display: inline-block;  display: flex; align-items: center; justify-content: center; margin-left: 18px;">
                                                            About Us
                                                        </a>
                                                        <a href="https://metajobs-frontend.vercel.app/contact-us"
                                                            style="font-size: 14px; color:#a8aca9; display: inline-block;  display: flex; align-items: center; justify-content: center; margin-left: 18px;">
                                                            Contact Us
                                                        </a>
                                                        <a href="https://metajobs-frontend.vercel.app/find-job"
                                                            style="font-size: 14px; color:#a8aca9; display: inline-block;  display: flex; align-items: center; justify-content: center; margin-left: 18px;">
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

            </html>    
    
`)