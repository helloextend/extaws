import { ExtAws } from '../lib/extaws'
import {CookieJar} from 'tough-cookie'
import { OktaAuthResponse, OktaFactor } from '../lib/types'
// eslint-disable-next-line
const exampleRawB64 = `<!DOCTYPE html>
<html lang="en">

<head>
\t<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
\t<meta name="robots" content="noarchive" />
\t<meta name="googlebot" content="noarchive" />
\t<meta name="robots" content="noindex" />
\t<meta http-equiv="X-UA-Compatible" content="IE=Edge" />
\t<meta name="apple-mobile-web-app-capable" content="yes">
\t<meta name="googlebot" content="noindex" />
\t<meta name="viewport" content="width=device-width, initial-scale=1.0">
\t<meta name="robots" content="none" />

\t<link
\t\thref="https://ok11static.oktacdn.com/assets/img/icons/favicons/favicon-16x16.c55b69ae49b08edc7c000d12b8e5483f.png"
\t\trel="icon" type="image/png" sizes="16x16" />
\t<link
\t\thref="https://ok11static.oktacdn.com/assets/img/icons/favicons/favicon-32x32.99bc356b6e293b927f9e3a2b69761c26.png"
\t\trel="icon" type="image/png" sizes="32x32" />
\t<link
\t\thref="https://ok11static.oktacdn.com/assets/img/icons/favicons/favicon-96x96.de98828614fa33ca04fcfaa07679f345.png"
\t\trel="icon" type="image/png" sizes="96x96" />
\t<meta name="msapplication-TileColor" content="#ffffff">
\t<meta name="msapplication-TileImage" content="/img/icons/favicons/ms-icon-144x144.png">
\t<meta name="application-name" content="Okta" />
\t<meta name="theme-color" content="#ffffff">
\t<meta name="msapplication-config" content="/img/icons/favicons/browserconfig.xml" />

\t<title>
\t\tokta-org-11111 - Signing in...</title>
\t<!--[if IE]><link href="https://ok11static.oktacdn.com/assets/css/ie/ie.67af4e98a9276b3eedc54211bb17ace8.css" type="text/css" rel="stylesheet"/><![endif]-->
\t<!--[if gte IE 9]><link href="https://ok11static.oktacdn.com/assets/css/ie/ie9.e98bfbcf44b614a6d63c04328b8b7b5e.css" type="text/css" rel="stylesheet"/><![endif]-->

\t<script>
\t\tif (typeof module === 'object') {window.module = module; module = undefined;}
\t</script>

\t<script>
\t\tvar okta = {
        migrateMute: true,
        locale: 'en',
        debug: false,
        deployEnv: 'PROD',
        userId: '00u28eyb6PR7PQZ474x6',
        settings: {
            orgId: '00omjce9Zr2Moz1TG4x5',
            orgName: 'okta\x2Dorg\x2D232794',
            serverStatus: 'ACTIVE',
            persona: '',
            isDeveloperConsole: '' === 'true',
            isPreview: 'false' === 'true',
            permissions: []
        },
        theme: ""
    };
\t</script>
\t<script>
\t\tvar _features=["MONTHLY_FLAG_2020_09","MONTHLY_FLAG_2019_05","MONTHLY_FLAG_2019_08","MONTHLY_FLAG_2020_03","MONTHLY_FLAG_2019_07","MONTHLY_FLAG_2019_01","APP_NOTES","MONTHLY_FLAG_2019_11","MONTHLY_FLAG_2020_07","MONTHLY_FLAG_2020_08","MONTHLY_FLAG_2020_01","MONTHLY_FLAG_2019_04","MONTHLY_FLAG_2020_05","APP_REQUEST_APPROVAL_WORKFLOW","MONTHLY_FLAG_2018_10","MONTHLY_FLAG_2019_02","MONTHLY_FLAG_2019_06","MONTHLY_FLAG_2018_12","MONTHLY_FLAG_2019_12","MONTHLY_FLAG_2018_09","MONTHLY_FLAG_2019_10","MONTHLY_FLAG_2018_11","MONTHLY_FLAG_2020_02","MONTHLY_FLAG_2019_09","MONTHLY_FLAG_2019_03","MONTHLY_FLAG_2020_06"];
\t</script>
\t<script>
\t\twindow.okta || (window.okta = {}); okta.cdnUrlHostname = "//ok11static.oktacdn.com"; okta.cdnPerformCheck = false;
\t</script>
\t<script>
\t\twindow.okta || (window.okta = {});window.okta.mixpanel = false;
\t</script>
\t<script src="https://ok11static.oktacdn.com/assets/js/jquery-1.12.4.cde246884d9601b57ecdf303e95e31d8.js"
\t\tcrossorigin="anonymous" integrity="sha384-EAnrwqhNk/nPrHfLFo6LnPoG47TinDmHN96Mc3nj1vTFttvkGM5dJoxMm5UeT6ML"
\t\ttype="text/javascript"></script>
\t<!--[if lt IE 9]><script src="https://ok11static.oktacdn.com/assets/enduser/js/vendor/css3-mediaqueries.fa295f0132f5335f352071ca3613a94a.js" crossorigin="anonymous" integrity="sha384-7pU2GSgyec3nzQMUNSuzanfJelP9UCOyHil0bOv+WnPKSS9lNA/tcxPyr7NV2w6c" type="text/javascript"></script><![endif]-->

\t<script>
\t\tif (window.module) module = window.module;
\t</script>

</head>

<body id="app" class="enduser-app  okta-legacy-theme  ">
\t<noscript>
\t\t<div id="noscript-mask"></div>
\t\t<div id="noscript-msg" class="infobox infobox-warning infobox-compact"><span class="icon warning-16"></span>
\t\t\t<h3>Javascript is disabled on your browser.</h3>
\t\t\t<p>Please enable Javascript and refresh this page to use Okta.</p>
\t\t</div>
\t</noscript>

\t<div id="container">
\t\t<link
\t\t\thref="https://ok11static.oktacdn.com/assets/css/sections/interstitial.a54a1edc95056b8486c088d765565d49.css"
\t\t\ttype="text/css" rel="stylesheet" />
\t\t<script>
\t\t\tvar interstitialMinWaitTime = 1200;
\t\t</script>
\t\t<!--[if lte IE 9]>
            <style type="text/css">
                #okta-auth-spin {
                    top: 35%;
                }
            </style>
        <![endif]-->

\t\t<!--[if lte IE 8]>
            <style type="text/css">
                #okta-auth-band {
                    height: 200px;
                }
            </style>
        <![endif]-->

\t\t<div id="okta-interstitial-wrap">
\t\t\t<div class="okta-auth-mask-new-interstitial"></div>
\t\t\t<div class="new-interstitial" id="new-interstitial">
\t\t\t\t<div id="okta-auth-band">
\t\t\t\t\t<svg alt="Please wait" class="new-img-static" width="376" height="160" viewBox="0 0 52 52"
\t\t\t\t\t\tfill="none" xmlns="http://www.w3.org/2000/svg">
\t\t\t\t\t\t<path fill-rule="evenodd" clip-rule="evenodd"
\t\t\t\t\t\t\td="M25.4745 0.115753C11.5432 0.115753 0 11.6589 0 25.5903C0 39.9197 11.5432 51.4629 25.4745 51.4629C39.804 51.4629 51.3471 39.9197 51.3471 25.5903C51.3471 11.6589 39.804 0.115753 25.4745 0.115753V0.115753ZM25.4745 38.3275C18.7078 38.3275 12.7373 32.755 12.7373 25.5902C12.7373 18.8236 18.7078 12.853 25.4745 12.853C32.6392 12.853 38.2118 18.8236 38.2118 25.5902C38.2118 32.755 32.6392 38.3275 25.4745 38.3275V38.3275Z"
\t\t\t\t\t\t\tfill="#007DC1" />
\t\t\t\t\t</svg>

\t\t\t\t\t<img src="https://ok11static.oktacdn.com/assets/img/ui/indicators/new_interstitial.c41c3b6f3a84458aca9a5919f238fbe3.gif" width="376" height="160" alt="Please wait" class="new-img"/><svg
\t\t\t\t\t\talt="Okta" class="okta-logo" width="106" height="36" viewBox="0 0 203 69" fill="none"
\t\t\t\t\t\txmlns="http://www.w3.org/2000/svg">
\t\t\t\t\t\t<path fill-rule="evenodd" clip-rule="evenodd"
\t\t\t\t\t\t\td="M25.4745 17.1157C11.5432 17.1157 0 28.6589 0 42.5903C0 56.9197 11.5432 68.4629 25.4745 68.4629C39.804 68.4629 51.3471 56.9197 51.3471 42.5903C51.3471 28.6589 39.804 17.1157 25.4745 17.1157V17.1157ZM25.4745 55.3275C18.7078 55.3275 12.7373 49.755 12.7373 42.5902C12.7373 35.8236 18.7078 29.853 25.4745 29.853C32.6392 29.853 38.2118 35.8236 38.2118 42.5902C38.2118 49.755 32.6392 55.3275 25.4745 55.3275V55.3275ZM70.453 51.3471C70.453 49.3569 72.8412 48.1628 74.4334 49.755C80.802 56.1236 91.151 67.2687 91.151 67.2687C91.5491 67.6667 91.5491 67.6667 92.3452 68.0648C92.3452 68.0648 92.7432 68.0648 93.1412 68.0648H104.684C107.073 68.0648 107.471 65.6765 106.675 64.4824L87.5687 44.9785L86.3746 43.7844C84.3844 41.3961 84.7824 40.202 87.1706 37.8138L102.296 20.6981C103.092 19.5039 102.694 17.5137 100.306 17.5137H89.9569C89.5589 17.5137 89.1608 17.5137 89.1608 17.5137C88.3648 17.5137 87.9667 17.9118 87.9667 17.9118C87.9667 17.9118 79.6079 27.0667 74.4334 32.6393C72.8412 34.2314 70.453 33.0373 70.453 31.0471V1.9902C70.453 0.796079 69.2589 0 68.4628 0H59.7059C58.5118 0 57.7157 1.19412 57.7157 1.9902V66.0746C57.7157 67.6667 58.9098 68.0648 59.7059 68.0648H68.4628C69.6569 68.0648 70.453 66.8707 70.453 66.0746V51.3471V51.3471ZM140.11 65.6766L138.916 57.3177C138.916 56.1236 137.722 55.3275 136.926 55.3275C136.13 55.7256 135.334 55.7256 134.935 55.7256C127.771 55.7256 122.596 50.153 122.198 43.3863V42.9883V32.6393C122.198 31.0471 122.994 29.853 124.586 29.853H135.732C136.528 29.853 137.722 29.4549 137.722 27.8628V19.902C137.722 18.3098 136.926 17.5137 136.13 17.5137H124.586C122.994 17.5137 122.198 16.3196 122.198 15.1255V1.9902C122.198 1.19412 121.402 0 119.81 0H111.451C110.257 0 109.063 0.796079 109.063 1.9902C109.063 1.9902 109.063 43.3863 109.063 43.7844C109.461 57.3177 121.004 68.4628 134.935 68.4628C136.13 68.4628 136.926 68.4628 138.12 68.0648C139.314 68.0648 140.11 66.8707 140.11 65.6766V65.6766ZM201.408 54.9295C194.243 54.9295 193.049 52.5413 193.049 42.9883C193.049 42.5903 193.049 42.5903 193.049 42.5903V19.504C193.049 18.7079 192.651 17.5138 191.059 17.5138H182.302C181.506 17.5138 180.312 18.3099 180.312 19.504V20.6981C176.331 18.3099 172.351 17.1157 167.574 17.1157C153.643 17.1157 142.1 28.6589 142.1 42.5903C142.1 56.9197 153.643 68.4629 167.574 68.4629C173.943 68.4629 179.914 66.0746 184.292 62.0942C186.68 65.6766 190.263 68.0648 196.631 68.4629C197.427 68.4629 203 68.4629 203 66.0746V56.9197C203 56.1236 202.204 54.9295 201.408 54.9295V54.9295ZM167.575 55.3275C160.41 55.3275 154.837 49.755 154.837 42.5902C154.837 35.8236 160.41 29.853 167.575 29.853C174.739 29.853 180.312 35.8236 180.312 42.5902C180.312 49.755 174.739 55.3275 167.575 55.3275V55.3275Z"
\t\t\t\t\t\t\tfill="#c2c3c3" />
\t\t\t\t\t</svg>
\t\t\t\t\t<div id="okta-auth-spin"></div>
\t\t\t\t\t<div id="okta-auth-spin-small"></div>
\t\t\t\t\t<h1 id="okta-auth-heading" class='signing-in-text'>Signing in to Amazon Web Services</h1>
\t\t\t\t</div>
\t\t\t</div>
\t\t\t<!--new-interstitial -->
\t\t</div>
\t\t<!--okta-interstitial-wrap -->

\t\t<script type="text/javascript">
\t\t\t$(function(){
                if ($('#okta-auth-spin').hasClass('android-spinner')) {
                    return;
                }

                // Remove gif animation for Safari
                var isSafari = /AppleWebKit/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
                if (isSafari) {
                    $('.new-img').hide(0);
                } else {
                    $('.new-img').on('load', function(evt){
                        //gif loaded correctly, fade out static asset and fade in gif
                        //making sure we show the graphic before the form submit happens in 200ms
                        $('.new-img-static').hide(0,function(){
                            $('.new-img').show(0);
                        });
                    });
                }

                //For cached images with src the load event fires just before you add a listener for it. Hence setting the source again to make sure the event handlers fire in the right order.
                var assetUrl = $('.new-img').attr('src');
                $('.new-img').attr('src', assetUrl);

                var standard = document.getElementById('okta-auth-spin');
                var small = document.getElementById('okta-auth-spin-small');

                var optsStandard = {
                    lines: 9, // The number of lines to draw
                    length: 0, // The length of each line
                    width: 8, // The line thickness
                    radius: 21, // The radius of the inner circle
                    corners: 1, // Corner roundness (0..1)
                    rotate: 0, // The rotation offset
                    direction: 1, // 1: clockwise, -1: counterclockwise
                    color: '#fff', // #rgb or #rrggbb
                    speed: 1, // Rounds per second
                    trail: 60, // Afterglow percentage
                    shadow: false, // Whether to render a shadow
                    hwaccel: false, // Whether to use hardware acceleration
                    className: 'okta-auth-spinner', // The CSS class to assign to the spinner
                    zIndex: 2e9, // The z-index (defaults to 2000000000)
                    top: 'auto', // Top position relative to parent in px
                    left: 'auto' // Left position relative to parent in px
                };

                var optsSmall = {
                    lines: 9, // The number of lines to draw
                    length: 0, // The length of each line
                    width: 6, // The line thickness
                    radius: 14, // The radius of the inner circle
                    corners: 1, // Corner roundness (0..1)
                    rotate: 0, // The rotation offset
                    direction: 1, // 1: clockwise, -1: counterclockwise
                    color: '#fff', // #rgb or #rrggbb
                    speed: 1, // Rounds per second
                    trail: 60, // Afterglow percentage
                    shadow: false, // Whether to render a shadow
                    hwaccel: false, // Whether to use hardware acceleration
                    className: 'okta-auth-spinner', // The CSS class to assign to the spinner
                    zIndex: 2e9, // The z-index (defaults to 2000000000)
                    top: 'auto', // Top position relative to parent in px
                    left: 'auto' // Left position relative to parent in px
                };
                if (typeof Spinner === 'function') {
                    var spinnerStandard = new Spinner(optsStandard);
                    var spinnerSmall = new Spinner(optsSmall);

                    spinnerStandard.spin(standard);
                    spinnerSmall.spin(small);
                }

            });
\t\t</script>
\t\t<form id="appForm" action="https&#x3a;&#x2f;&#x2f;signin.aws.amazon.com&#x2f;saml" method="POST">
\t\t\t<input name="SAMLResponse" type="hidden" value="PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c2FtbDJwOlJlc3BvbnNlIERlc3RpbmF0aW9uPSJodHRwczovL3NpZ25pbi5hd3MuYW1hem9uLmNvbS9zYW1sIiBJRD0iaWQ1NzYzNjg4MTkxOTk1NzA4NTAxOTkxMzAyIiBJc3N1ZUluc3RhbnQ9IjIwMjAtMDktMTFUMTk6MzY6MDIuMzEzWiIgVmVyc2lvbj0iMi4wIiB4bWxuczpzYW1sMnA9InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDpwcm90b2NvbCIgeG1sbnM6eHM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hIj48c2FtbDI6SXNzdWVyIEZvcm1hdD0idXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOm5hbWVpZC1mb3JtYXQ6ZW50aXR5IiB4bWxuczpzYW1sMj0idXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOmFzc2VydGlvbiI&#x2b;aHR0cDovL3d3dy5va3RhLmNvbS9leGsyYWw4eXRYbUlLN0VzTjR4Njwvc2FtbDI6SXNzdWVyPjxkczpTaWduYXR1cmUgeG1sbnM6ZHM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDkveG1sZHNpZyMiPjxkczpTaWduZWRJbmZvPjxkczpDYW5vbmljYWxpemF0aW9uTWV0aG9kIEFsZ29yaXRobT0iaHR0cDovL3d3dy53My5vcmcvMjAwMS8xMC94bWwtZXhjLWMxNG4jIi8&#x2b;PGRzOlNpZ25hdHVyZU1ldGhvZCBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvMDQveG1sZHNpZy1tb3JlI3JzYS1zaGEyNTYiLz48ZHM6UmVmZXJlbmNlIFVSST0iI2lkNTc2MzY4ODE5MTk5NTcwODUwMTk5MTMwMiI&#x2b;PGRzOlRyYW5zZm9ybXM&#x2b;PGRzOlRyYW5zZm9ybSBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDkveG1sZHNpZyNlbnZlbG9wZWQtc2lnbmF0dXJlIi8&#x2b;PGRzOlRyYW5zZm9ybSBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvMTAveG1sLWV4Yy1jMTRuIyI&#x2b;PGVjOkluY2x1c2l2ZU5hbWVzcGFjZXMgUHJlZml4TGlzdD0ieHMiIHhtbG5zOmVjPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzEwL3htbC1leGMtYzE0biMiLz48L2RzOlRyYW5zZm9ybT48L2RzOlRyYW5zZm9ybXM&#x2b;PGRzOkRpZ2VzdE1ldGhvZCBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvMDQveG1sZW5jI3NoYTI1NiIvPjxkczpEaWdlc3RWYWx1ZT5uZ3g3TTJlTVJweTRDa0xqQUxCanVtUXAzTHRKZWEzSVZFTlNqdkpUVGxVPTwvZHM6RGlnZXN0VmFsdWU&#x2b;PC9kczpSZWZlcmVuY2U&#x2b;PC9kczpTaWduZWRJbmZvPjxkczpTaWduYXR1cmVWYWx1ZT5JZzhHZ29TaktZT3hBOTMvYmJSMkNUMjZpdzJrRVdCMzkzUFl3UjF0emhvNDRDNDZGaDZpbzE0VlVCUlQ2S3EvQlRpVy9pUW1zVEtHTk5hcGdqTTBNU2cvTE1VS1ZQMUVPeitIMHZDdnhnZmRDMnltMnZqcno1WjVGM1dOc0o0Q2pUa1Rtek1kTzlkVjZrR0FRWG1CdUE0ZDN0ZjloTFlRdWRaanJJNXVIZkR6QkNrSXFwREdhVG1SZlBWRnU5U2RtMTJJemRZOEVKd0k3SGJnSWZMcDMvVjFrVE8xQXZhMVkyNlh2RERPWVlxSjJUL1JUL1NwY08zN1pZMFUvMXlLUkRhdVlqQnpCUjJIVU4vbUJtcjZnNm5MRE1oNCtKSGx1eUNwcXVyLzlkYStMTTVWQnFjL0ExdXdCbnM2Q2dSTGpuOVF6a3VCVHQzb0diL2kyTHBva3c9PTwvZHM6U2lnbmF0dXJlVmFsdWU&#x2b;PGRzOktleUluZm8&#x2b;PGRzOlg1MDlEYXRhPjxkczpYNTA5Q2VydGlmaWNhdGU&#x2b;TUlJRG5EQ0NBb1NnQXdJQkFnSUdBVytHUldrNU1BMEdDU3FHU0liM0RRRUJDd1VBTUlHT01Rc3dDUVlEVlFRR0V3SlZVekVUTUJFRwpBMVVFQ0F3S1EyRnNhV1p2Y201cFlURVdNQlFHQTFVRUJ3d05VMkZ1SUVaeVlXNWphWE5qYnpFTk1Bc0dBMVVFQ2d3RVQydDBZVEVVCk1CSUdBMVVFQ3d3TFUxTlBVSEp2ZG1sa1pYSXhEekFOQmdOVkJBTU1CbVY0ZEdWdVpERWNNQm9HQ1NxR1NJYjNEUUVKQVJZTmFXNW0KYjBCdmEzUmhMbU52YlRBZUZ3MHlNREF4TURneE56UTNNVE5hRncwek1EQXhNRGd4TnpRNE1UTmFNSUdPTVFzd0NRWURWUVFHRXdKVgpVekVUTUJFR0ExVUVDQXdLUTJGc2FXWnZjbTVwWVRFV01CUUdBMVVFQnd3TlUyRnVJRVp5WVc1amFYTmpiekVOTUFzR0ExVUVDZ3dFClQydDBZVEVVTUJJR0ExVUVDd3dMVTFOUFVISnZkbWxrWlhJeER6QU5CZ05WQkFNTUJtVjRkR1Z1WkRFY01Cb0dDU3FHU0liM0RRRUoKQVJZTmFXNW1iMEJ2YTNSaExtTnZiVENDQVNJd0RRWUpLb1pJaHZjTkFRRUJCUUFEZ2dFUEFEQ0NBUW9DZ2dFQkFLa0R3U0JYOG10NApBRVE4dTRDY0JQOFVtMWJrK3o5akN5OStTbWZOenU1dGlpNzFVQzI5QnJLQTZaekRGQjJKblhaYkVocThMSUJBc2I0RXR3NjNpdGVkCk96SW9iSjRXakxic3lZOC9IVW02Tzc3UTJveWtVRUR3V293eDVUYkg1MHhoTzRsRzFNczNNcnl1UEZncENvRHN6QXBvamJpeXZMb3QKMEtHTzV1cFh5RnJJdWNhN3BqbVdlaTN0RmxHNlp3cmJjU20yMzFsWTM3S1NaOWRVaGJTQmoyZm5qbk1ScXZtZTVyQ1RMQzJMV3RFVAo4djFVRHFsUll4MStUaEYxbUZ4Mm5TdDdYQy8rR2pHWUNKRmxzbmZoeEY0bEdFRko5MGpScWs5V25EMVdkMUxWaXhFblZZNWRyOVF2CjYwY1pOdlpLTTY0aEg2TlJrYzRjY0hzUDdHY0NBd0VBQVRBTkJna3Foa2lHOXcwQkFRc0ZBQU9DQVFFQVNtZDZ5bzhWZ0hTK3JFMjcKaVZiWm9pSTBJOWVKOWtsWmZKVml4Tmh5M1EzNytYaGx5VUh4N3BkV3ZrM0llTmdmTldwSFdJdzlFdDRkaDQzWG1YcUZtZkFVdUJ5YwpWdHhWR2EwWHhnTWtCNW1hNnlyeGZSbFFURm1aZC9MckZwNUhwUWtYSVdYQ0hHa1BBUHpsZnU2R2YyTStMWnF4eDJodXVvRW8zVVA2Clg2TWJyNFc0TGp3RW9pVWhFU0dnVlRFVTBuSWJOT2lRWFNBcDY2aTdySjZudWx5L2x1cTBadUVKdTY0QlRwTkV6MkZRSDJ6OCs5TTkKY0I1MlY4Vi8rMmQ0Um94YTgvVGpoZEtadE5JQkVYMnY0emtWMDUxeE5xQ0J3eVZreTNIRTJPSW9zeVpGSDhtYlFBdnVMTUpSTTVOSApxL3hrSUpOUWU4LzdnQ09hdVl5SUdRPT08L2RzOlg1MDlDZXJ0aWZpY2F0ZT48L2RzOlg1MDlEYXRhPjwvZHM6S2V5SW5mbz48L2RzOlNpZ25hdHVyZT48c2FtbDJwOlN0YXR1cyB4bWxuczpzYW1sMnA9InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDpwcm90b2NvbCI&#x2b;PHNhbWwycDpTdGF0dXNDb2RlIFZhbHVlPSJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoyLjA6c3RhdHVzOlN1Y2Nlc3MiLz48L3NhbWwycDpTdGF0dXM&#x2b;PHNhbWwyOkFzc2VydGlvbiBJRD0iaWQ1NzYzNjg4MTkyMDYyMzA2MTk1MjA4MzU3NCIgSXNzdWVJbnN0YW50PSIyMDIwLTA5LTExVDE5OjM2OjAyLjMxM1oiIFZlcnNpb249IjIuMCIgeG1sbnM6c2FtbDI9InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDphc3NlcnRpb24iIHhtbG5zOnhzPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYSI&#x2b;PHNhbWwyOklzc3VlciBGb3JtYXQ9InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDpuYW1laWQtZm9ybWF0OmVudGl0eSIgeG1sbnM6c2FtbDI9InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDphc3NlcnRpb24iPmh0dHA6Ly93d3cub2t0YS5jb20vZXhrMmFsOHl0WG1JSzdFc040eDY8L3NhbWwyOklzc3Vlcj48ZHM6U2lnbmF0dXJlIHhtbG5zOmRzPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwLzA5L3htbGRzaWcjIj48ZHM6U2lnbmVkSW5mbz48ZHM6Q2Fub25pY2FsaXphdGlvbk1ldGhvZCBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvMTAveG1sLWV4Yy1jMTRuIyIvPjxkczpTaWduYXR1cmVNZXRob2QgQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNyc2Etc2hhMjU2Ii8&#x2b;PGRzOlJlZmVyZW5jZSBVUkk9IiNpZDU3NjM2ODgxOTIwNjIzMDYxOTUyMDgzNTc0Ij48ZHM6VHJhbnNmb3Jtcz48ZHM6VHJhbnNmb3JtIEFsZ29yaXRobT0iaHR0cDovL3d3dy53My5vcmcvMjAwMC8wOS94bWxkc2lnI2VudmVsb3BlZC1zaWduYXR1cmUiLz48ZHM6VHJhbnNmb3JtIEFsZ29yaXRobT0iaHR0cDovL3d3dy53My5vcmcvMjAwMS8xMC94bWwtZXhjLWMxNG4jIj48ZWM6SW5jbHVzaXZlTmFtZXNwYWNlcyBQcmVmaXhMaXN0PSJ4cyIgeG1sbnM6ZWM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvMTAveG1sLWV4Yy1jMTRuIyIvPjwvZHM6VHJhbnNmb3JtPjwvZHM6VHJhbnNmb3Jtcz48ZHM6RGlnZXN0TWV0aG9kIEFsZ29yaXRobT0iaHR0cDovL3d3dy53My5vcmcvMjAwMS8wNC94bWxlbmMjc2hhMjU2Ii8&#x2b;PGRzOkRpZ2VzdFZhbHVlPmM2TWxNd09OejgwWkZiV3grc2UvVzZQVUFPbkt3cHpPYlNmRzcwQm0wWVE9PC9kczpEaWdlc3RWYWx1ZT48L2RzOlJlZmVyZW5jZT48L2RzOlNpZ25lZEluZm8&#x2b;PGRzOlNpZ25hdHVyZVZhbHVlPmRWUmM4Kys1V2hZNGRvYjRSNGpORlhaS1lUemlJYVNDRDFDTU54ektEVHlQSlJrQ3Q5ZnBnN2d4V05yME1zMjRhVWtTUXRlYWwxZjhrOG9JWGZmV0w2bzlVanlJTXlBRWNiYk9CVjRZd2FSY2ZGR2hibXQ3ZVdIdFVSU3pMMTZXUkNFcmQxNmRjOHhaQ1RxeUlrYzN5dTlKV0xWalBjMlpPTGxZZnUvQ1VQU1hMYm5xL2J4OGVyaDV2VHQ1bzFwbWhIeXpIV1p4Ky9oTVVoaHBlaDdUcVJDMmJOeld5enVQblJWbUphNC9BSnJ4SW1BN2JiYkJvZ0p0Q01RYVc4TG5uTHNaZCtNRFhBcDZZUWdTaDJrTnp6QnBaN2IxalVQS2YrcnMzcUp3aVdqQk55ZFFPbDJIMmxYWHJKUjFnNjNQZXdJWjd5RGFzZXRHS0l4ei81M3pYdz09PC9kczpTaWduYXR1cmVWYWx1ZT48ZHM6S2V5SW5mbz48ZHM6WDUwOURhdGE&#x2b;PGRzOlg1MDlDZXJ0aWZpY2F0ZT5NSUlEbkRDQ0FvU2dBd0lCQWdJR0FXK0dSV2s1TUEwR0NTcUdTSWIzRFFFQkN3VUFNSUdPTVFzd0NRWURWUVFHRXdKVlV6RVRNQkVHCkExVUVDQXdLUTJGc2FXWnZjbTVwWVRFV01CUUdBMVVFQnd3TlUyRnVJRVp5WVc1amFYTmpiekVOTUFzR0ExVUVDZ3dFVDJ0MFlURVUKTUJJR0ExVUVDd3dMVTFOUFVISnZkbWxrWlhJeER6QU5CZ05WQkFNTUJtVjRkR1Z1WkRFY01Cb0dDU3FHU0liM0RRRUpBUllOYVc1bQpiMEJ2YTNSaExtTnZiVEFlRncweU1EQXhNRGd4TnpRM01UTmFGdzB6TURBeE1EZ3hOelE0TVROYU1JR09NUXN3Q1FZRFZRUUdFd0pWClV6RVRNQkVHQTFVRUNBd0tRMkZzYVdadmNtNXBZVEVXTUJRR0ExVUVCd3dOVTJGdUlFWnlZVzVqYVhOamJ6RU5NQXNHQTFVRUNnd0UKVDJ0MFlURVVNQklHQTFVRUN3d0xVMU5QVUhKdmRtbGtaWEl4RHpBTkJnTlZCQU1NQm1WNGRHVnVaREVjTUJvR0NTcUdTSWIzRFFFSgpBUllOYVc1bWIwQnZhM1JoTG1OdmJUQ0NBU0l3RFFZSktvWklodmNOQVFFQkJRQURnZ0VQQURDQ0FRb0NnZ0VCQUtrRHdTQlg4bXQ0CkFFUTh1NENjQlA4VW0xYmsrejlqQ3k5K1NtZk56dTV0aWk3MVVDMjlCcktBNlp6REZCMkpuWFpiRWhxOExJQkFzYjRFdHc2M2l0ZWQKT3pJb2JKNFdqTGJzeVk4L0hVbTZPNzdRMm95a1VFRHdXb3d4NVRiSDUweGhPNGxHMU1zM01yeXVQRmdwQ29Ec3pBcG9qYml5dkxvdAowS0dPNXVwWHlGckl1Y2E3cGptV2VpM3RGbEc2WndyYmNTbTIzMWxZMzdLU1o5ZFVoYlNCajJmbmpuTVJxdm1lNXJDVExDMkxXdEVUCjh2MVVEcWxSWXgxK1RoRjFtRngyblN0N1hDLytHakdZQ0pGbHNuZmh4RjRsR0VGSjkwalJxazlXbkQxV2QxTFZpeEVuVlk1ZHI5UXYKNjBjWk52WktNNjRoSDZOUmtjNGNjSHNQN0djQ0F3RUFBVEFOQmdrcWhraUc5dzBCQVFzRkFBT0NBUUVBU21kNnlvOFZnSFMrckUyNwppVmJab2lJMEk5ZUo5a2xaZkpWaXhOaHkzUTM3K1hobHlVSHg3cGRXdmszSWVOZ2ZOV3BIV0l3OUV0NGRoNDNYbVhxRm1mQVV1QnljClZ0eFZHYTBYeGdNa0I1bWE2eXJ4ZlJsUVRGbVpkL0xyRnA1SHBRa1hJV1hDSEdrUEFQemxmdTZHZjJNK0xacXh4Mmh1dW9FbzNVUDYKWDZNYnI0VzRMandFb2lVaEVTR2dWVEVVMG5JYk5PaVFYU0FwNjZpN3JKNm51bHkvbHVxMFp1RUp1NjRCVHBORXoyRlFIMno4KzlNOQpjQjUyVjhWLysyZDRSb3hhOC9UamhkS1p0TklCRVgydjR6a1YwNTF4TnFDQnd5Vmt5M0hFMk9Jb3N5WkZIOG1iUUF2dUxNSlJNNU5ICnEveGtJSk5RZTgvN2dDT2F1WXlJR1E9PTwvZHM6WDUwOUNlcnRpZmljYXRlPjwvZHM6WDUwOURhdGE&#x2b;PC9kczpLZXlJbmZvPjwvZHM6U2lnbmF0dXJlPjxzYW1sMjpTdWJqZWN0IHhtbG5zOnNhbWwyPSJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoyLjA6YXNzZXJ0aW9uIj48c2FtbDI6TmFtZUlEIEZvcm1hdD0idXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOm5hbWVpZC1mb3JtYXQ6dW5zcGVjaWZpZWQiPmNvcmV5QGV4dGVuZC5jb208L3NhbWwyOk5hbWVJRD48c2FtbDI6U3ViamVjdENvbmZpcm1hdGlvbiBNZXRob2Q9InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDpjbTpiZWFyZXIiPjxzYW1sMjpTdWJqZWN0Q29uZmlybWF0aW9uRGF0YSBOb3RPbk9yQWZ0ZXI9IjIwMjAtMDktMTFUMTk6NDE6MDIuMzE0WiIgUmVjaXBpZW50PSJodHRwczovL3NpZ25pbi5hd3MuYW1hem9uLmNvbS9zYW1sIi8&#x2b;PC9zYW1sMjpTdWJqZWN0Q29uZmlybWF0aW9uPjwvc2FtbDI6U3ViamVjdD48c2FtbDI6Q29uZGl0aW9ucyBOb3RCZWZvcmU9IjIwMjAtMDktMTFUMTk6MzE6MDIuMzE0WiIgTm90T25PckFmdGVyPSIyMDIwLTA5LTExVDE5OjQxOjAyLjMxNFoiIHhtbG5zOnNhbWwyPSJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoyLjA6YXNzZXJ0aW9uIj48c2FtbDI6QXVkaWVuY2VSZXN0cmljdGlvbj48c2FtbDI6QXVkaWVuY2U&#x2b;dXJuOmFtYXpvbjp3ZWJzZXJ2aWNlczwvc2FtbDI6QXVkaWVuY2U&#x2b;PC9zYW1sMjpBdWRpZW5jZVJlc3RyaWN0aW9uPjwvc2FtbDI6Q29uZGl0aW9ucz48c2FtbDI6QXV0aG5TdGF0ZW1lbnQgQXV0aG5JbnN0YW50PSIyMDIwLTA5LTExVDE3OjIzOjI3LjIzNVoiIFNlc3Npb25JbmRleD0iaWQxNTk5ODUyOTYyMzEzLjE2MTE0NDk4MjQiIHhtbG5zOnNhbWwyPSJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoyLjA6YXNzZXJ0aW9uIj48c2FtbDI6QXV0aG5Db250ZXh0PjxzYW1sMjpBdXRobkNvbnRleHRDbGFzc1JlZj51cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoyLjA6YWM6Y2xhc3NlczpQYXNzd29yZFByb3RlY3RlZFRyYW5zcG9ydDwvc2FtbDI6QXV0aG5Db250ZXh0Q2xhc3NSZWY&#x2b;PC9zYW1sMjpBdXRobkNvbnRleHQ&#x2b;PC9zYW1sMjpBdXRoblN0YXRlbWVudD48c2FtbDI6QXR0cmlidXRlU3RhdGVtZW50IHhtbG5zOnNhbWwyPSJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoyLjA6YXNzZXJ0aW9uIj48c2FtbDI6QXR0cmlidXRlIE5hbWU9Imh0dHBzOi8vYXdzLmFtYXpvbi5jb20vU0FNTC9BdHRyaWJ1dGVzL1JvbGUiIE5hbWVGb3JtYXQ9InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDphdHRybmFtZS1mb3JtYXQ6dXJpIj48c2FtbDI6QXR0cmlidXRlVmFsdWUgeG1sbnM6eHM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hIiB4bWxuczp4c2k9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hLWluc3RhbmNlIiB4c2k6dHlwZT0ieHM6c3RyaW5nIj5hcm46YXdzOmlhbTo6MTU5NTgxODAwNDAwOnNhbWwtcHJvdmlkZXIvT2t0YSxhcm46YXdzOmlhbTo6MTU5NTgxODAwNDAwOnJvbGUvZXh0ZW5kX2VuZ2luZWVyaW5nX3NlcnZpY2VzX3N1cGVyX2FkbWluPC9zYW1sMjpBdHRyaWJ1dGVWYWx1ZT48L3NhbWwyOkF0dHJpYnV0ZT48c2FtbDI6QXR0cmlidXRlIE5hbWU9Imh0dHBzOi8vYXdzLmFtYXpvbi5jb20vU0FNTC9BdHRyaWJ1dGVzL1JvbGVTZXNzaW9uTmFtZSIgTmFtZUZvcm1hdD0idXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOmF0dHJuYW1lLWZvcm1hdDpiYXNpYyI&#x2b;PHNhbWwyOkF0dHJpYnV0ZVZhbHVlIHhtbG5zOnhzPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYSIgeG1sbnM6eHNpPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYS1pbnN0YW5jZSIgeHNpOnR5cGU9InhzOnN0cmluZyI&#x2b;Y29yZXlAZXh0ZW5kLmNvbTwvc2FtbDI6QXR0cmlidXRlVmFsdWU&#x2b;PC9zYW1sMjpBdHRyaWJ1dGU&#x2b;PHNhbWwyOkF0dHJpYnV0ZSBOYW1lPSJodHRwczovL2F3cy5hbWF6b24uY29tL1NBTUwvQXR0cmlidXRlcy9TZXNzaW9uRHVyYXRpb24iIE5hbWVGb3JtYXQ9InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDphdHRybmFtZS1mb3JtYXQ6YmFzaWMiPjxzYW1sMjpBdHRyaWJ1dGVWYWx1ZSB4bWxuczp4cz0iaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEiIHhtbG5zOnhzaT0iaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEtaW5zdGFuY2UiIHhzaTp0eXBlPSJ4czpzdHJpbmciPjI4ODAwPC9zYW1sMjpBdHRyaWJ1dGVWYWx1ZT48L3NhbWwyOkF0dHJpYnV0ZT48L3NhbWwyOkF0dHJpYnV0ZVN0YXRlbWVudD48L3NhbWwyOkFzc2VydGlvbj48L3NhbWwycDpSZXNwb25zZT4&#x3d;"/>
\t\t\t<input name="RelayState" type="hidden" value=""/>
</form>

\t\t\t<script
\t\t\t\tsrc="https://ok11static.oktacdn.com/assets/js/app/sso/interstitial.474dce61acfac4a4d016921943cf2a68.js"
\t\t\t\tcrossorigin="anonymous"
\t\t\t\tintegrity="sha384-rIRjIHrr5XnyB1DG8t+uL1F3e5asM+gYMial0fj56hCWADEBdp3BiwtOAnNpU7Zc"
\t\t\t\ttype="text/javascript"></script>
\t</div>
\t<!-- close #container -->
</body>

</html>`

const factor1: OktaFactor = {
  id: 'aaaaabbbbbccccc',
  factorType: 'push',
  provider: 'OKTA',
  vendorName: 'OKTA',
  _links: {},
  profile: {
    credentialId: 'tom.jones@not-unusual.com',
    deviceType: 'SmartPhone_Android',
    keys: [
      {
        kty: 'RSA',
        use: 'sig',
        kid: 'default',
        e: 'AQAB',
        n: 'PvFLVjKaWzEnmpn-rzS1UHwvUw'
      }
    ],
    name: 'ONEPLUS A6010',
    platform: 'ANDROID',
    version: '28'
  }
}

const mfaSuccess: OktaAuthResponse = {
  expiresAt: '2020-09-14T00:15:30.000Z',
  status: 'SUCCESS',
  sessionToken: '20111BIZQK-AAAAAAA4x55ChSu9UzpdpozqzXj8oH3kvMV_mr6BBBBB',
  _embedded: {
    user: {
      id: '011asaseyb6PR7PQZ474x6',
      passwordChanged: '2020-02-17T21:39:44.000Z',
      profile: {
        login: 'tom.jones@not-unusual.com',
        firstName: 'Tom',
        lastName: 'Jones',
        locale: 'en',
        timeZone: 'America/Los_Angeles'
      }
    }
  },
  _links: {
    cancel: {
      href: 'https://oktaorg.okta.com/api/v1/authn/cancel',
      hints: {
        allow: [
          'POST'
        ]
      }
    }
  }
}

const mfaRequired: OktaAuthResponse = {
  'stateToken': '00vDzrZpwEy_aaa_bHZcXUqNhAAUjJyidrfu0WgAnz',
  'expiresAt': '2020-09-14T00:15:08.000Z',
  'status': 'MFA_REQUIRED',
  '_embedded': {
    'user': {
      'id': '12345678',
      'passwordChanged': '2020-02-17T21:39:44.000Z',
      'profile': {
        'login': 'tom.jones@not-unusual.com',
        'firstName': 'Tom',
        'lastName': 'Jones',
        'locale': 'en',
        'timeZone': 'America/Los_Angeles'
      }
    },
    'factors': [
      factor1
    ],
    'policy': {
      'allowRememberDevice': true,
      'rememberDeviceLifetimeInMinutes': 0,
      'rememberDeviceByDefault': true,
      'factorsPolicyInfo': {
        'oassuwkjwKcUCNZi24x6': {
          'autoPushEnabled': false
        }
      }
    }
  },
  '_links': {
    'cancel': {
      'href': 'https://youroktaorg.okta.com/api/v1/authn/cancel',
      'hints': {
        'allow': [
          'POST'
        ]
      }
    }
  }
}

const authReponseWithMissingFactors: OktaAuthResponse = {
  status: 'LOCKED_OUT'
}

describe('ExtAws', () => {
  let auth: ExtAws
  beforeEach(async () => {
    auth = new ExtAws()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe( 'axios client', () => {
    test('properly sets withCredentials', () => {
      auth.createAxiosClient()
      expect(auth.client.defaults.withCredentials).toBe(true)
    })
    test('has a cookie jar', () => {
      auth.createAxiosClient()
      expect(auth.client.defaults.jar).toBeInstanceOf(CookieJar)
    })
  })

  test( 'function selectToken returns the factor when only one provided', async () => {
    const factor = await (ExtAws as any).selectToken([factor1])
    expect(factor).toBe('aaaaabbbbbccccc')
  })

  test( 'properly handles MFA', async() => {
    async function mockedVerify(): Promise<OktaAuthResponse> {
      return mfaSuccess
    }
    // TODO: Find a way to fix this test so we can mock verifyFactor and extend the class to access protected method
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore-next-line
    jest.spyOn(auth, 'verifyFactor').mockImplementation(mockedVerify)
    await (auth as any).handleMFA(mfaRequired)
    expect(auth.sessionToken).toBe(mfaSuccess.sessionToken)
  })


  it( 'should create device tokens of the right length', () => {
    const token = auth.generateDeviceToken(23)
    expect(token.length).toBe(23)
  })

  it('should properly parse roles from html saml', async () => {
    auth.httpAssertion = exampleRawB64
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (auth as any).parseAssertionFromHtml()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const roles = await (auth as any).parseRolesFromXML()
    expect(roles.length).toBeGreaterThan(0)
  })

  describe('on a bad auth response', () => {
    test( 'should properly handle missing factors', () => {
      async function func() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (auth as any).handleMFA(authReponseWithMissingFactors)
      }
      expect(func).rejects.toEqual(Error('Unable to find factors in auth response'))
    })
    test( 'should properly error when auth response is missing factors', () => {
      async function func() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (auth as any).handleMFA(authReponseWithMissingFactors)
      }
      expect(func).rejects.toEqual(Error('Unable to find factors in auth response'))
    })
  })


})
