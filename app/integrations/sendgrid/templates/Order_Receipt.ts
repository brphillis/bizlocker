import { OrderItemWithDetails, OrderWithDetails } from "~/models/Orders/types";
import { staticPathImageToBase64 } from "../sendgrid.server";

export const Order_Receipt = (
  recipient: string,
  order: OrderWithDetails,
  subject: string,
  message: string,
) => {
  const { items } = order || {};

  const { firstName, lastName, address } = order;

  const template = {
    to: recipient,
    from: "brock@brockdev.com.au",
    subject: subject,
    attachments: [
      {
        content: staticPathImageToBase64("twitter.png"),
        filename: "twitterBase64.png",
        type: "image/png",
        content_id: "twitter",
        disposition: "inline",
      },
      {
        content: staticPathImageToBase64("instagram.png"),
        filename: "instagramBase64.png",
        type: "image/png",
        content_id: "instagram",
        disposition: "inline",
      },
      {
        content: staticPathImageToBase64("youtube.png"),
        filename: "youtubeBase64.png",
        type: "image/png",
        content_id: "youtube",
        disposition: "inline",
      },
    ],
    text: message,
    html: `
    <!DOCTYPE HTML
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
    xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
    <!--[if gte mso 9]>
<xml>
  <o:OfficeDocumentSettings>
    <o:AllowPNG/>
    <o:PixelsPerInch>96</o:PixelsPerInch>
  </o:OfficeDocumentSettings>
</xml>
<![endif]-->
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <!--[if !mso]><!-->
    <meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
    <title></title>

    <style type="text/css">
        @media only screen and (min-width: 620px) {
            .u-row {
                width: 600px !important;
            }

            .u-row .u-col {
                vertical-align: top;
            }

            .u-row .u-col-50 {
                width: 300px !important;
            }

            .u-row .u-col-100 {
                width: 600px !important;
            }

        }

        @media (max-width: 620px) {
            .u-row-container {
                max-width: 100% !important;
                padding-left: 0px !important;
                padding-right: 0px !important;
            }

            .u-row .u-col {
                min-width: 320px !important;
                max-width: 100% !important;
                display: block !important;
            }

            .u-row {
                width: 100% !important;
            }

            .u-col {
                width: 100% !important;
                margin-top: -1px !important;
            }

            .u-col>div {
                margin: 0 auto;
            }
        }

        body {
            margin: 0;
            padding: 0;
        }

        table,
        tr,
        td {
            vertical-align: top;
            border-collapse: collapse;
        }

        p {
            margin: 0;
        }

        .ie-container table,
        .mso-container table {
            table-layout: fixed;
        }

        * {
            line-height: inherit;
        }

        a[x-apple-data-detectors='true'] {
            color: inherit !important;
            text-decoration: none !important;
        }

        table,
        td {
            color: #000000;
        }

        #u_body a {
            color: #0000ee;
            text-decoration: underline;
        }

        #u_content_social_1 .v-container-padding-padding {
            padding: 10px 0px 15px 0px !important;
        }

        @media (max-width: 480px) {
            #u_content_heading_1 .v-container-padding-padding {
                padding: 20px 10px 0px 30px !important;
            }

            #u_content_heading_2 .v-container-padding-padding {
                padding: 10px 10px 0px 30px !important;
            }

            #u_content_text_1 .v-container-padding-padding {
                padding: 10px 30px 20px !important;
            }

            #u_content_heading_4 .v-container-padding-padding {
                padding: 30px 10px 0px 30px !important;
            }

            #u_content_divider_2 .v-container-padding-padding {
                padding: 10px 30px !important;
            }

            #u_content_heading_5 .v-container-padding-padding {
                padding: 0px 10px 10px 30px !important;
            }

            #u_content_text_3 .v-container-padding-padding {
                padding: 10px 10px 10px 30px !important;
            }

            #u_content_heading_6 .v-container-padding-padding {
                padding: 10px 10px 10px 30px !important;
            }

            #u_content_divider_8 .v-container-padding-padding {
                padding: 10px 30px !important;
            }

            #u_content_heading_13 .v-container-padding-padding {
                padding: 0px 10px 10px 30px !important;
            }

            #u_content_heading_14 .v-container-padding-padding {
                padding: 10px 10px 10px 30px !important;
            }

            #u_content_divider_9 .v-container-padding-padding {
                padding: 10px 30px !important;
            }

            #u_content_heading_10 .v-container-padding-padding {
                padding: 0px 10px 0px 30px !important;
            }

            #u_content_divider_6 .v-container-padding-padding {
                padding: 10px 30px 0px !important;
            }

            #u_content_text_7 .v-container-padding-padding {
                padding: 10px 10px 30px 30px !important;
            }

            #u_content_heading_9 .v-container-padding-padding {
                padding: 0px 10px 0px 30px !important;
            }

            #u_content_divider_5 .v-container-padding-padding {
                padding: 10px 30px 0px !important;
            }

            #u_content_text_6 .v-container-padding-padding {
                padding: 10px 10px 40px 30px !important;
            }

            #u_content_text_8 .v-container-padding-padding {
                padding: 20px 20px 10px !important;
            }

            #u_content_text_8 .v-text-align {
                text-align: center !important;
            }
        }
    </style>



</head>

<body class="clean-body u_body"
    style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #616060;color: #000000">
    <!--[if IE]><div class="ie-container"><![endif]-->
    <!--[if mso]><div class="mso-container"><![endif]-->
    <table id="u_body"
        style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #616060;width:100%"
        cellpadding="0" cellspacing="0">
        <tbody>
            <tr style="vertical-align: top">
                <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #616060;"><![endif]-->



                    <div class="u-row-container" style="padding: 0px;background-color: transparent">
                        <div class="u-row"
                            style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                            <div
                                style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->

                                <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #232227;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                                <div class="u-col u-col-100"
                                    style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                                    <div
                                        style="background-color: #232227;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                        <!--[if (!mso)&(!IE)]><!-->
                                        <div
                                            style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                            <!--<![endif]-->

                                            <table style="font-family:arial,helvetica,sans-serif;" role="presentation"
                                                cellpadding="0" cellspacing="0" width="100%" border="0">
                                                <tbody>
                                                    <tr>
                                                        <td class="v-container-padding-padding"
                                                            style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;"
                                                            align="left">

                                                            <h1 class="v-text-align"
                                                                style="margin: 0px; color: #ecf0f1; line-height: 140%; text-align: center; word-wrap: break-word; font-size: 32px; font-weight: 700;">
                                                                CLUTCH.</h1>

                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                            <!--[if (!mso)&(!IE)]><!-->
                                        </div><!--<![endif]-->
                                    </div>
                                </div>
                                <!--[if (mso)|(IE)]></td><![endif]-->
                                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                            </div>
                        </div>
                    </div>

                    <div class="u-row-container" style="padding: 0px;background-color: transparent">
                        <div class="u-row"
                            style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                            <div
                                style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->

                                <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #ecf0f1;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                                <div class="u-col u-col-100"
                                    style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                                    <div style="background-color: #ecf0f1;height: 100%;width: 100% !important;">
                                        <!--[if (!mso)&(!IE)]><!-->
                                        <div
                                            style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                                            <!--<![endif]-->

                                            <table id="u_content_heading_1"
                                                style="font-family:arial,helvetica,sans-serif;" role="presentation"
                                                cellpadding="0" cellspacing="0" width="100%" border="0">
                                                <tbody>
                                                    <tr>
                                                        <td class="v-container-padding-padding"
                                                            style="overflow-wrap:break-word;word-break:break-word;padding:40px 10px 0px 50px;font-family:arial,helvetica,sans-serif;"
                                                            align="left">

                                                            <h1 class="v-text-align"
                                                                style="margin: 0px; line-height: 110%; text-align: left; word-wrap: break-word; font-size: 37px; font-weight: 700;">
                                                                Thankyou for your order.<span
                                                                    data-metadata="&lt;!--(figmeta)eyJmaWxlS2V5IjoiWndhNUFhYWxsSU1hVEhMTXZZNFJKVCIsInBhc3RlSUQiOjEzMTI3NTgzOTQsImRhdGFUeXBlIjoic2NlbmUifQo=(/figmeta)--&gt;"
                                                                    style="line-height: 40.7px;"></span></h1>

                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                            <table id="u_content_heading_2"
                                                style="font-family:arial,helvetica,sans-serif;" role="presentation"
                                                cellpadding="0" cellspacing="0" width="100%" border="0">
                                                <tbody>
                                                    <tr>
                                                        <td class="v-container-padding-padding"
                                                            style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 0px 50px;font-family:arial,helvetica,sans-serif;"
                                                            align="left">

                                                            <h1 class="v-text-align"
                                                                style="margin: 0px; line-height: 140%; text-align: left; word-wrap: break-word; font-size: 17px; font-weight: 400;">
                                                                <span
                                                                    data-metadata="&lt;!--(figmeta)eyJmaWxlS2V5IjoiWndhNUFhYWxsSU1hVEhMTXZZNFJKVCIsInBhc3RlSUQiOjIxMTY1MjA5NjYsImRhdGFUeXBlIjoic2NlbmUifQo=(/figmeta)--&gt;"></span><span>Order
                                                                    # : ${
                                                                      order.id
                                                                    }</span>
                                                            </h1>

                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                            <table style="font-family:arial,helvetica,sans-serif;" role="presentation"
                                                cellpadding="0" cellspacing="0" width="100%" border="0">
                                                <tbody>
                                                    <tr>
                                                        <td class="v-container-padding-padding"
                                                            style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;"
                                                            align="left">

                                                            <table height="0px" align="center" border="0"
                                                                cellpadding="0" cellspacing="0" width="86%"
                                                                style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                                                <tbody>
                                                                    <tr style="vertical-align: top">
                                                                        <td
                                                                            style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                                                            <span>&#160;</span>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>

                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                            <table id="u_content_text_1" style="font-family:arial,helvetica,sans-serif;"
                                                role="presentation" cellpadding="0" cellspacing="0" width="100%"
                                                border="0">
                                                <tbody>
                                                    <tr>
                                                        <td class="v-container-padding-padding"
                                                            style="overflow-wrap:break-word;word-break:break-word;padding:10px 100px 20px 50px;font-family:arial,helvetica,sans-serif;"
                                                            align="left">

                                                            <div class="v-text-align"
                                                                style="font-size: 14px; line-height: 140%; text-align: left; word-wrap: break-word;">
                                                                <p style="line-height: 140%;"><span
                                                                        data-metadata="&lt;!--(figmeta)eyJmaWxlS2V5IjoiWndhNUFhYWxsSU1hVEhMTXZZNFJKVCIsInBhc3RlSUQiOjE4NjczMDI1MDMsImRhdGFUeXBlIjoic2NlbmUifQo=(/figmeta)--&gt;"
                                                                        style="line-height: 19.6px;"></span><span
                                                                        style="line-height: 19.6px;"></span><span
                                                                        style="line-height: 19.6px;">${message}</span></p>
                                                            </div>

                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                            <!--[if (!mso)&(!IE)]><!-->
                                        </div><!--<![endif]-->
                                    </div>
                                </div>
                                <!--[if (mso)|(IE)]></td><![endif]-->
                                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                            </div>
                        </div>
                    </div>





                    <div class="u-row-container" style="padding: 0px;background-color: transparent">
                        <div class="u-row"
                            style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                            <div
                                style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->

                                <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #232227;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                                <div class="u-col u-col-100"
                                    style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                                    <div
                                        style="background-color: #232227;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                        <!--[if (!mso)&(!IE)]><!-->
                                        <div
                                            style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                            <!--<![endif]-->

                                            <table id="u_content_heading_4"
                                                style="font-family:arial,helvetica,sans-serif;" role="presentation"
                                                cellpadding="0" cellspacing="0" width="100%" border="0">
                                                <tbody>
                                                    <tr>
                                                        <td class="v-container-padding-padding"
                                                            style="overflow-wrap:break-word;word-break:break-word;padding:40px 10px 0px 50px;font-family:arial,helvetica,sans-serif;"
                                                            align="left">

                                                            <h1 class="v-text-align"
                                                                style="margin: 0px; color: #ffffff; line-height: 140%; text-align: left; word-wrap: break-word; font-size: 20px; font-weight: 400;">
                                                                <span
                                                                    data-metadata="&lt;!--(figmeta)eyJmaWxlS2V5IjoiWndhNUFhYWxsSU1hVEhMTXZZNFJKVCIsInBhc3RlSUQiOjEwODMwNTU0MTEsImRhdGFUeXBlIjoic2NlbmUifQo=(/figmeta)--&gt;"></span><span>Order
                                                                    Details</span>
                                                            </h1>

                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                            <table id="u_content_divider_2"
                                                style="font-family:arial,helvetica,sans-serif;" role="presentation"
                                                cellpadding="0" cellspacing="0" width="100%" border="0">
                                                <tbody>
                                                    <tr>
                                                        <td class="v-container-padding-padding"
                                                            style="overflow-wrap:break-word;word-break:break-word;padding:10px 50px;font-family:arial,helvetica,sans-serif;"
                                                            align="left">

                                                            <table height="0px" align="center" border="0"
                                                                cellpadding="0" cellspacing="0" width="100%"
                                                                style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #687481;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                                                <tbody>
                                                                    <tr style="vertical-align: top">
                                                                        <td
                                                                            style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                                                            <span>&#160;</span>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>

                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                            <!--[if (!mso)&(!IE)]><!-->
                                        </div><!--<![endif]-->
                                    </div>
                                </div>
                                <!--[if (mso)|(IE)]></td><![endif]-->
                                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                            </div>
                        </div>
                    </div>



                   ${items
                     ?.map(
                       ({
                         variant,
                         unitPrice,
                         quantity,
                       }: OrderItemWithDetails) => {
                         return `


<div class="u-row-container" style="padding: 0px;background-color: transparent">
<div class="u-row"
    style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
    <div
        style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->

        <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #232227;width: 600px;padding: 5px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
        <div class="u-col u-col-100"
            style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
            <div
                style="background-color: #232227;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                <!--[if (!mso)&(!IE)]><!-->
                <div
                    style="box-sizing: border-box; height: 100%; padding: 5px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--<![endif]-->

                    <table id="u_content_heading_5"
                        style="font-family:arial,helvetica,sans-serif;" role="presentation"
                        cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                            <tr>
                                <td class="v-container-padding-padding"
                                    style="overflow-wrap:break-word;word-break:break-word;padding:15px 10px 10px 42px;font-family:arial,helvetica,sans-serif;"
                                    align="left">

                                    <h1 class="v-text-align"
                                        style="margin: 0px; color: #ffffff; line-height: 110%; text-align: left; word-wrap: break-word; font-size: 14px; font-weight: 700;">
                                        <span
                                            data-metadata="&lt;!--(figmeta)eyJmaWxlS2V5IjoiMnk1YTR0OTU5aGt5MmdGR2JvazREOSIsInBhc3RlSUQiOjE0NTI2MzE5OTgsImRhdGFUeXBlIjoic2NlbmUifQo=(/figmeta)--&gt;"
                                            style="line-height: 22px;"></span><span
                                            style="line-height: 22px;"></span><span
                                            style="line-height: 22px;">${variant
                                              ?.product?.name}</span>
                                    </h1>

                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <table id="u_content_text_3" style="font-family:arial,helvetica,sans-serif;"
                        role="presentation" cellpadding="0" cellspacing="0" width="100%"
                        border="0">
                        <tbody>
                            <tr>
                                <td class="v-container-padding-padding"
                                    style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 10px 42px;font-family:arial,helvetica,sans-serif;"
                                    align="left">

                                    <div class="v-text-align"
                                        style="font-size: 14px; color: #ecf0f1; line-height: 20%; text-align: left; word-wrap: break-word;">
                                        <p style="line-height: 20%;"><span
                                                data-metadata="&lt;!--(figmeta)eyJmaWxlS2V5IjoiMnk1YTR0OTU5aGt5MmdGR2JvazREOSIsInBhc3RlSUQiOjkyOTgzNjY3OCwiZGF0YVR5cGUiOiJzY2VuZSJ9Cg==(/figmeta)--&gt;"
                                                style="line-height: 2.8px;"></span><span
                                                style="line-height: 2.8px;"></span><span
                                                style="line-height: 2.8px;">Quantity - x ${quantity}</span>
                                        </p>
                                    </div>

                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <table id="u_content_heading_6"
                        style="font-family:arial,helvetica,sans-serif;" role="presentation"
                        cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                            <tr>
                                <td class="v-container-padding-padding"
                                    style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 10px 42px;font-family:arial,helvetica,sans-serif;"
                                    align="left">

                                    <h1 class="v-text-align"
                                        style="margin: 0px; color: #ffffff; line-height: 110%; text-align: left; word-wrap: break-word; font-size: 14px; font-weight: 700;">
                                        <span
                                            data-metadata="&lt;!--(figmeta)eyJmaWxlS2V5IjoiMnk1YTR0OTU5aGt5MmdGR2JvazREOSIsInBhc3RlSUQiOjg1Nzc0NDc4NSwiZGF0YVR5cGUiOiJzY2VuZSJ9Cg==(/figmeta)--&gt;"
                                            style="line-height: 22px;"></span><span
                                            style="line-height: 22px;"></span><span
                                            style="line-height: 22px;">$${unitPrice.toFixed(
                                              2,
                                            )}</span>
                                    </h1>

                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <table id="u_content_divider_8"
                        style="font-family:arial,helvetica,sans-serif;" role="presentation"
                        cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                            <tr>
                                <td class="v-container-padding-padding"
                                    style="overflow-wrap:break-word;word-break:break-word;padding:10px 50px;font-family:arial,helvetica,sans-serif;"
                                    align="left">

                                    <table height="0px" align="center" border="0"
                                        cellpadding="0" cellspacing="0" width="100%"
                                        style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #687481;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                        <tbody>
                                            <tr style="vertical-align: top">
                                                <td
                                                    style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                                    <span>&#160;</span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <!--[if (!mso)&(!IE)]><!-->
                </div><!--<![endif]-->
            </div>
        </div>
        <!--[if (mso)|(IE)]></td><![endif]-->
        <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
    </div>
</div>
</div>
`;
                       },
                     )
                     .join("")}

                    <div class="u-row-container" style="padding: 0px;background-color: transparent">
                        <div class="u-row"
                            style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                            <div
                                style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->

                                <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #232227;width: 600px;padding: 5px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                                <div class="u-col u-col-100"
                                    style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                                    <div
                                        style="background-color: #232227;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                        <!--[if (!mso)&(!IE)]><!-->
                                        <div
                                            style="box-sizing: border-box; height: 100%; padding: 5px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                            <!--<![endif]-->

                                            <table id="u_content_heading_13"
                                                style="font-family:arial,helvetica,sans-serif;" role="presentation"
                                                cellpadding="0" cellspacing="0" width="100%" border="0">
                                                <tbody>
                                                    <tr>
                                                        <td class="v-container-padding-padding"
                                                            style="overflow-wrap:break-word;word-break:break-word;padding:15px 10px 10px 42px;font-family:arial,helvetica,sans-serif;"
                                                            align="left">

                                                            <h1 class="v-text-align"
                                                                style="margin: 0px; color: #ffffff; line-height: 110%; text-align: left; word-wrap: break-word; font-size: 20px; font-weight: 700;">
                                                                <span
                                                                    data-metadata="&lt;!--(figmeta)eyJmaWxlS2V5IjoiMnk1YTR0OTU5aGt5MmdGR2JvazREOSIsInBhc3RlSUQiOjE0NTI2MzE5OTgsImRhdGFUeXBlIjoic2NlbmUifQo=(/figmeta)--&gt;"
                                                                    style="line-height: 22px;"></span><span
                                                                    style="line-height: 22px;"></span><span
                                                                    style="line-height: 22px;">Order Total</span>
                                                            </h1>

                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                            <table id="u_content_heading_14"
                                                style="font-family:arial,helvetica,sans-serif;" role="presentation"
                                                cellpadding="0" cellspacing="0" width="100%" border="0">
                                                <tbody>
                                                    <tr>
                                                        <td class="v-container-padding-padding"
                                                            style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 10px 42px;font-family:arial,helvetica,sans-serif;"
                                                            align="left">

                                                            <h1 class="v-text-align"
                                                                style="margin: 0px; color: #ffffff; line-height: 110%; text-align: left; word-wrap: break-word; font-size: 20px; font-weight: 700;">
                                                                <span
                                                                    data-metadata="&lt;!--(figmeta)eyJmaWxlS2V5IjoiMnk1YTR0OTU5aGt5MmdGR2JvazREOSIsInBhc3RlSUQiOjg1Nzc0NDc4NSwiZGF0YVR5cGUiOiJzY2VuZSJ9Cg==(/figmeta)--&gt;"
                                                                    style="line-height: 22px;"></span><span
                                                                    style="line-height: 22px;"></span><span
                                                                    style="line-height: 22px;">$20.00</span>
                                                            </h1>

                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                            <table id="u_content_divider_9"
                                                style="font-family:arial,helvetica,sans-serif;" role="presentation"
                                                cellpadding="0" cellspacing="0" width="100%" border="0">
                                                <tbody>
                                                    <tr>
                                                        <td class="v-container-padding-padding"
                                                            style="overflow-wrap:break-word;word-break:break-word;padding:10px 50px;font-family:arial,helvetica,sans-serif;"
                                                            align="left">

                                                            <table height="0px" align="center" border="0"
                                                                cellpadding="0" cellspacing="0" width="100%"
                                                                style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #687481;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                                                <tbody>
                                                                    <tr style="vertical-align: top">
                                                                        <td
                                                                            style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                                                            <span>&#160;</span>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>

                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                            <!--[if (!mso)&(!IE)]><!-->
                                        </div><!--<![endif]-->
                                    </div>
                                </div>
                                <!--[if (mso)|(IE)]></td><![endif]-->
                                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                            </div>
                        </div>
                    </div>





                    <div class="u-row-container" style="padding: 0px;background-color: transparent">
                        <div class="u-row"
                            style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                            <div
                                style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->

                                <!--[if (mso)|(IE)]><td align="center" width="300" style="background-color: #232227;width: 300px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                                <div class="u-col u-col-50"
                                    style="max-width: 320px;min-width: 300px;display: table-cell;vertical-align: top;">
                                    <div
                                        style="background-color: #232227;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                        <!--[if (!mso)&(!IE)]><!-->
                                        <div
                                            style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                            <!--<![endif]-->

                                            <table id="u_content_heading_10"
                                                style="font-family:arial,helvetica,sans-serif;" role="presentation"
                                                cellpadding="0" cellspacing="0" width="100%" border="0">
                                                <tbody>
                                                    <tr>
                                                        <td class="v-container-padding-padding"
                                                            style="overflow-wrap:break-word;word-break:break-word;padding:30px 10px 0px 50px;font-family:arial,helvetica,sans-serif;"
                                                            align="left">

                                                            <h1 class="v-text-align"
                                                                style="margin: 0px; color: #ffffff; line-height: 140%; text-align: left; word-wrap: break-word; font-size: 20px; font-weight: 700;">
                                                                <span
                                                                    data-metadata="&lt;!--(figmeta)eyJmaWxlS2V5IjoiWndhNUFhYWxsSU1hVEhMTXZZNFJKVCIsInBhc3RlSUQiOjIxNDE5NDE0MSwiZGF0YVR5cGUiOiJzY2VuZSJ9Cg==(/figmeta)--&gt;"></span><span>Shipping
                                                                    Address</span>
                                                            </h1>

                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                            <table id="u_content_divider_6"
                                                style="font-family:arial,helvetica,sans-serif;" role="presentation"
                                                cellpadding="0" cellspacing="0" width="100%" border="0">
                                                <tbody>
                                                    <tr>
                                                        <td class="v-container-padding-padding"
                                                            style="word-break:break-word; padding:10px 50px; font-family:arial,helvetica,sans-serif">

                                                            <table height="0px" align="center" border="0"
                                                                cellpadding="0" cellspacing="0" width="100%"
                                                                style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #687481;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                                                <tbody>
                                                                    <tr style="vertical-align: top">
                                                                        <td
                                                                            style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                                                            <span>&#160;</span>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>

                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                            <table id="u_content_text_7" style="font-family:arial,helvetica,sans-serif;"
                                                role="presentation" cellpadding="0" cellspacing="0" width="100%"
                                                border="0">
                                                <tbody>
                                                    <tr>
                                                        <td class="v-container-padding-padding"
                                                            style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 30px 50px;font-family:arial,helvetica,sans-serif;"
                                                            align="left">

                                                            <div class="v-text-align"
                                                                style="font-size: 13px; color: #ffffff; line-height: 140%; text-align: left; word-wrap: break-word;">
                                                                <p style="line-height: 140%;"><span
                                                                        data-metadata="&lt;!--(figmeta)eyJmaWxlS2V5IjoiWndhNUFhYWxsSU1hVEhMTXZZNFJKVCIsInBhc3RlSUQiOjE4MTI1MzIwNjAsImRhdGFUeXBlIjoic2NlbmUifQo=(/figmeta)--&gt;"
                                                                        style="line-height: 18.2px;"></span><span
                                                                        style="line-height: 18.2px;"></span><span
                                                                        style="line-height: 18.2px;">
                                                                        ${firstName} ${lastName}
                                                                        <br />
                                                                        ${address?.addressLine1}
                                                                        <br />
                                                                        ${
                                                                          address?.addressLine2
                                                                            ? address?.addressLine2 +
                                                                              `<br />`
                                                                            : ""
                                                                        }
                                                                        ${address?.suburb} ${address?.state} ${address?.postcode}  
                                                                        <br />
                                                                       ${address?.country}
                                                                        </span></p>
                                                            </div>

                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                            <!--[if (!mso)&(!IE)]><!-->
                                        </div><!--<![endif]-->
                                    </div>
                                </div>
                                <!--[if (mso)|(IE)]></td><![endif]-->
                                <!--[if (mso)|(IE)]><td align="center" width="300" style="background-color: #232227;width: 300px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->


                            </div>
                        </div>
                    </div>





                    <div class="u-row-container" style="padding: 0px;background-color: transparent">
                        <div class="u-row"
                            style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                            <div
                                style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->

                                <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #ecf0f1;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                                <div class="u-col u-col-100"
                                    style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                                    <div
                                        style="background-color: #ecf0f1;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                        <!--[if (!mso)&(!IE)]><!-->
                                        <div
                                            style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                            <!--<![endif]-->

                                            <table id="u_content_text_8" style="font-family:arial,helvetica,sans-serif;"
                                                role="presentation" cellpadding="0" cellspacing="0" width="100%"
                                                border="0">
                                                <tbody>
                                                    <tr>
                                                        <td class="v-container-padding-padding"
                                                            style="overflow-wrap:break-word;word-break:break-word;padding:13px 60px 10px 35px;font-family:arial,helvetica,sans-serif;"
                                                            align="left">

                                                            <div class="v-text-align"
                                                                style="font-size: 13px; line-height: 170%; text-align: left; word-wrap: break-word;">
                                                                <p style="line-height: 170%;"><span
                                                                        data-metadata="&lt;!--(figmeta)eyJmaWxlS2V5IjoiMlBQSXNjNFd3Q2ZlU0tINFZVMlBXeiIsInBhc3RlSUQiOjE5NDM5MjkyMjcsImRhdGFUeXBlIjoic2NlbmUifQo=(/figmeta)--&gt;"
                                                                        style="line-height: 22.1px;"></span><span
                                                                        style="line-height: 22.1px;">${message}</span></p>
                                                            </div>

                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                            <table id="u_content_social_1"
                                                style="font-family:arial,helvetica,sans-serif;background-color:#232227;margin-top:-1px;" role="presentation"
                                                cellpadding="0" cellspacing="0" width="100%" border="0">
                                                <tbody>
                                                    <tr>
                                                        <td class="v-container-padding-padding"
                                                            style="overflow-wrap:break-word;word-break:break-word;font-family:arial,helvetica,sans-serif;"
                                                            align="left">

                                                            <div align="center">
                                                                <div style="display: table; max-width:179px;">
                                                                    <!--[if (mso)|(IE)]><table width="179" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-collapse:collapse;" align="center"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; mso-table-lspace: 0pt;mso-table-rspace: 0pt; width:179px;"><tr><![endif]-->


                                                                    <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 13px;" valign="top"><![endif]-->
                                                                    <table align="left" border="0" cellspacing="0"
                                                                        cellpadding="0" width="32" height="32"
                                                                        style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 13px">
                                                                        <tbody>
                                                                            <tr style="vertical-align: top">
                                                                                <td align="left" valign="middle"
                                                                                    style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                                                                                    <a href="https://twitter.com/"
                                                                                        title="Twitter" target="_blank">
                                                                                        <img src="cid:twitter"
                                                                                            alt="Twitter"
                                                                                            title="Twitter" width="32"
                                                                                            style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                                                                                    </a>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                    <!--[if (mso)|(IE)]></td><![endif]-->

                                                                    <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 13px;" valign="top"><![endif]-->
                                                                    <table align="left" border="0" cellspacing="0"
                                                                        cellpadding="0" width="32" height="32"
                                                                        style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 13px">
                                                                        <tbody>
                                                                            <tr style="vertical-align: top">
                                                                                <td align="left" valign="middle"
                                                                                    style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                                                                                    <a href="https://instagram.com/"
                                                                                        title="Instagram"
                                                                                        target="_blank">
                                                                                        <img src="cid:instagram"
                                                                                            alt="Instagram"
                                                                                            title="Instagram" width="32"
                                                                                            style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                                                                                    </a>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                    <!--[if (mso)|(IE)]></td><![endif]-->

                                                                    <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 13px;" valign="top"><![endif]-->
                                                                    <table align="left" border="0" cellspacing="0"
                                                                        cellpadding="0" width="32" height="32"
                                                                        style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 13px">
                                                                        <tbody>
                                                                            <tr style="vertical-align: top">
                                                                                <td align="left" valign="middle"
                                                                                    style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                                                                                    <a href="https://youtube.com/"
                                                                                        title="YouTube" target="_blank">
                                                                                        <img src="cid:youtube"
                                                                                            alt="YouTube"
                                                                                            title="YouTube" width="32"
                                                                                            style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                                                                                    </a>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                    <!--[if (mso)|(IE)]></td><![endif]-->

                                                                    <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                                                                </div>
                                                            </div>

                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                            <!--[if (!mso)&(!IE)]><!-->
                                        </div><!--<![endif]-->
                                    </div>
                                </div>
                                <!--[if (mso)|(IE)]></td><![endif]-->
                                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                            </div>
                        </div>
                    </div>



                    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                </td>
            </tr>
        </tbody>
    </table>
    <!--[if mso]></div><![endif]-->
    <!--[if IE]></div><![endif]-->
</body>

</html>
      `,
  };

  return template;
};
