export class MailTemplateVerifyLink{
  static link="";
  static fullname="";
  public static HTMLLink():any{ 
    const html2=`"<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@100;200;300;400;500;600&family=Poppins:wght@100;200;300;400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
    </head>
    <style></style>
    <body
      style="
        font-size: 62.5%;
        font-family: 'Be Vietnam Pro', sans-serif;
        font-family: 'Poppins', sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        background-color: rgb(245, 245, 245);
        min-height: 100vh;
        font-size: black !important;
      "
    >
      <div class="main" style="margin: auto">
        <div class="box" style="background-color: white; padding: 20px 40px">
          <div class="logo" style="margin-bottom: 40px">
            <img
              src="https://f002.backblazeb2.com/file/summonshop/logo.png"
              alt="logo"
            />
          </div>
          <h3
            style="
              font-size: 28px;
              font-weight: 400;
              margin-bottom: 0px;
              color: #000;
            "
          >
            Welcome,
          </h3>
          <p style="font-size: 40px; color: #000; margin: 0"><b>${this.fullname}</b></p>
          <div class="image" style="width: 260px; margin: 50px auto">
            <img
              src="https://f002.backblazeb2.com/file/summonshop/welcome.png"
              style="display: block; height: 100%; width: 100%; object-fit: cover"
            />
          </div>
          <p style="font-size: 14px; color: #555 !important">
          Quý khách vừa tạo thành công thông tin đăng nhập tài khoản Web ngân hàng của chúng tôi. Đây là thông tin quan trọng dùng để truy cập vào tài khoản Ngân hàng, Quý khách vui lòng ghi nhớ thông tin này và bắt đầu hành trình quản lý tài chính thông minh hơn với ứng dụng Timo hoặc qua Internet Banking tại website https://fe-next-ecommerce.vercel.app/home<br />
            Nhấn vào đường dẫn dưới đây để xác nhận mail
          </p>
          <div class="code" style="margin: 20px 0">
              <a href="${this.link}" style="display: inline-block;
        font-size: 20px;
        background-color: #9BDBF6;
        padding: 4px 28px;
        border-radius: 4px;
        text-decoration: none;
        color: black;
        ">Verify</a>
          </div>
          <p style="font-size: 10px; color: #555555">
          Dưới đây là một số lưu ý trong suốt quá trình sử dụng tài khoản giúp Quý khách đảm bảo an toàn bảo mật và tránh phát sinh rủi ro <br />
          Không chia sẻ thông tin tên đăng nhập và mật khẩu đăng nhập tài khoản cho bất kỳ ai <br />
          Không cung cấp mã xác thực SMS OTP/ iOTP trong mọi tình huống. 
          </p>
          </div>
          <p style="font-size: 10px; color: #555555">
            Nếu bạn có bất cứ câu hỏi nào hay thắc mắc nào xin hãy liên hệ tới Email shopme293@gmail.com.<br />
            All right reserved. Update
            <a
              href="#"
              rel="noopener"
              style="text-decoration: none; color: #555555"
              target="_blank"
              >email preferences</a
            >
          </p>
          <span style="font-weight: 500">Ho Chi Minh City</span>
        </div>
      </div>
    </body>
  </html>`
  return html2;
  }
}
