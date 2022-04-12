
export function sendCodeTemplate(code: number) {
    return `
    <body>
    <div class="general-container">
        <div class="header">
            <img class="logo-apx" src="lib/sendCodeEmail/images/image-5.png" />
        </div>
        <div class="body">
            <h1 class="Title"> Te has registrado! 😊 </h1>
            <h3 class="code"> Este es tu código para loguearte: ${code} </h3>
        </div>
        <div class="footer">
            <a class="link" href="https://apx.school/"> www.apx.school.com </a>
            <div class="img-container">
                <img class="twitter" src="$lib/sendCodeEmail/images/image-2.png" />
                <img class="linkedin" src="lib/sendCodeEmail/images/image-1.png" />
                <img class="instagram" src="lib/sendCodeEmail/images/image-3.png" />
            </div>
            <p class="info" > If you have questions regarding your Data, please visit our Privacy Policy
                Want to change how you receive these emails? You can update your preferences or unsubscribe from this list.
            </p>
        </div>
        <div class="les-than-footer"> ©20XX apx.school | Argentina, Buenos Aires. </div>
    </div>
    <style>
        .general-container {
            width: 800px;
            display: flex;
            align-items: center;
            flex-direction: center;
        }
        .header {
            width: 100%;
            height: 50px;
            display: felx;
            flex-direction: column;
            background-color: #fefefe;
        }
        .logo-apx {
            width: 225px;
            height: 225px;
            aign-self: center;
        }
        .body {
            width: 600px;
            height: 400px
            background-image: url("lib/sendCodeEmail/images/image-4.png");
        }
        .footer {
            width: 100%
            height: 800px
            background-color: #34495E;
        }
        .link {
            color: gold;
        }
        .img-container {
            width: 90%
            height: 50px;
            display: flex;
            justify-self: center;
            justify-content: space-between;
        }
        .info {
            width: 80%;
            height: 400px;
        }
        .less-than-footer {
            width: 100%;
            height: 25px;
            color: #7E8C8D;
            align-self: center;
            background-color: #CCCCCC;
        }
    </style>
    </body>`;
}