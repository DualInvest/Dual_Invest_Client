class User {
    constructor(id, email,name,investedAmount = 0,parentReferralCode, referralIncome = 0,interestAmount = 0 , referralUsers,transactionIds, createdAt) {
      this.id = id;
      this.email = email;
      this.name = name;
      this.investedAmount = investedAmount;
      this.referralCode = id;
      this.parentReferralCode = parentReferralCode;
      this.referralIncome = referralIncome;
      this.interestAmount = interestAmount;
      this.transactionIds = transactionIds || [];
      this.referralUsers = referralUsers || [];
      this.createdAt = createdAt;
    }
}
export default User;