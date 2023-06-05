export const VerifyAccount = (tokenVerify: string) => {
  return `    
  <html>
    <body>
      <h1>Account Verification</h1>
      <p>Please click the following link to verify your account:</p>
      <a href="http://localhost:3001/v1/users/validate/${tokenVerify}">Verify Account</a>
    </body>
  </html>`;
};
