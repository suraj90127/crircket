import React, { useState, useEffect } from "react";
import { 
  FaArrowLeft, 
  FaPlus, 
  FaHistory, 
  FaWallet, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaClock,
  FaChevronLeft,
  FaCreditCard,
  FaRupeeSign,
  FaCalendar,
  FaIdCard,
  FaBuilding,
  FaListOl,
  FaBarcode,
  FaSave,
  FaTrash,
  FaExchangeAlt,
  FaMoneyBillWave,
  FaShieldAlt,
  FaQrcode,
  FaPhoneAlt,
  FaExclamationTriangle,
  FaQuestion,
  FaInfoCircle
} from "react-icons/fa";
import { toast, Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { 
  addBankAccount, 
  requestWithdrawal, 
  getWithdrawalHistory,
  clearWalletState,
  getUserBankDetails,
  // zilpayRecharge
} from '../redux/reducer/walletSlice';

const DepositWithdrawal = () => {
  const dispatch = useDispatch();
  
  const {
    bankAccounts,
    withdrawals,
    loading,
    error,
    success,
    pagination
  } = useSelector((state) => state.wallet);
  
  const { userInfo } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("deposit");
  const [showHistory, setShowHistory] = useState(false);
  const [showAddBankPopup, setShowAddBankPopup] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("UPI");
  const [currentPage, setCurrentPage] = useState(1);
  const [bankForm, setBankForm] = useState({
    accountType: "Bank Account",
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    phone: "",
  });

  // New states for popups
  const [showDepositConfirm, setShowDepositConfirm] = useState(false);
  const [pendingDeposit, setPendingDeposit] = useState(null);
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);
  const [pendingWithdraw, setPendingWithdraw] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [bankToDelete, setBankToDelete] = useState(null);

  const [depositHistory, setDepositHistory] = useState([]);

  // Load initial data
  useEffect(() => {
<<<<<<< Updated upstream
    // Initial load
   
    dispatch(getUserBankDetails());
    dispatch(getWithdrawalHistory({ page: 1, limit: 10 }));

=======
    dispatch(getUserBankDetails());
    dispatch(getWithdrawalHistory({ page: 1, limit: 10 }));
>>>>>>> Stashed changes
  }, [dispatch]);

  useEffect(() => {
    console.log("Bank Accounts from Redux:", bankAccounts);
  }, [bankAccounts]);

  // Handle success/error messages
  useEffect(() => {
    if (success) {
      toast.success(success);
<<<<<<< Updated upstream
      
      // अगर success message withdrawal/deposit related है, तो balance refresh करें
      if (success.toLowerCase().includes("withdrawal") || 
          success.toLowerCase().includes("deposit") ||
          success.toLowerCase().includes("bank")) 
      
=======
>>>>>>> Stashed changes
      dispatch(clearWalletState());
    }
    if (error) {
      toast.error(error);
      dispatch(clearWalletState());
    }
  }, [success, error, dispatch]);

  // Handle bank account selection on bankAccounts change
  useEffect(() => {
    console.log("Bank accounts changed:", bankAccounts);
    
    if (bankAccounts && bankAccounts.length > 0) {
      // If selectedBank is not valid or null
      if (!selectedBank) {
        const defaultAccount = bankAccounts.find(acc => acc.isDefault);
        const accountToSelect = defaultAccount || bankAccounts[0];
        if (accountToSelect) {
          setSelectedBank(accountToSelect._id || accountToSelect.id);
        }
      } else {
        // Check if selectedBank still exists
        const bankExists = bankAccounts.some(acc => 
          acc._id === selectedBank || acc.id === selectedBank
        );
        if (!bankExists) {
          const defaultAccount = bankAccounts.find(acc => acc.isDefault);
          const accountToSelect = defaultAccount || bankAccounts[0];
          if (accountToSelect) {
            setSelectedBank(accountToSelect._id || accountToSelect.id);
          }
        }
      }
    } else {
      setSelectedBank(null);
    }
  }, [bankAccounts, selectedBank]);

  // Debug info for userInfo changes
  useEffect(() => {
    console.log("User Info updated:", userInfo);
    console.log("Current balance:", userInfo?.avbalance);
  }, [userInfo]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <FaCheckCircle className="text-green-500 mr-2" />;
      case "pending":
        return <FaClock className="text-yellow-500 mr-2" />;
      case "rejected":
        return <FaTimesCircle className="text-red-500 mr-2" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "border-l-4 border-l-green-500 bg-green-50";
      case "pending":
        return "border-l-4 border-l-yellow-500 bg-yellow-50";
      case "rejected":
        return "border-l-4 border-l-red-500 bg-red-50";
      default:
        return "border-l-4 border-l-gray-300 bg-gray-50";
    }
  };

  const handleBankFormChange = (e) => {
    const { name, value } = e.target;
    setBankForm({
      ...bankForm,
      [name]: value
    });
  };

  const handleAddBankAccount = () => {
    // Validate all fields
    if (!bankForm.accountHolderName.trim()) {
      toast.error("Please enter account holder name");
      return;
    }
    if (!bankForm.bankName.trim()) {
      toast.error("Please enter bank name");
      return;
    }
    if (!bankForm.accountNumber.trim() || bankForm.accountNumber.length < 10) {
      toast.error("Please enter valid account number (minimum 10 digits)");
      return;
    }
    if (!bankForm.ifscCode.trim() || bankForm.ifscCode.length !== 11) {
      toast.error("Please enter valid 11-digit IFSC code");
      return;
    }
    if (!bankForm.phone.trim() || bankForm.phone.length !== 10) {
      toast.error("Please enter valid 10-digit phone number");
      return;
    }

    dispatch(addBankAccount(bankForm));
    
    // Reset form
    setBankForm({
      accountType: "Bank Account",
      accountHolderName: "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      phone: "",
    });
  };

  const handleDeleteBankAccount = (id) => {
    setBankToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteBank = () => {
    if (bankToDelete) {
      // Call your delete API here
      toast.success("Bank account deleted successfully");
      // Refresh bank list
      dispatch(getUserBankDetails());
<<<<<<< Updated upstream
     
=======
>>>>>>> Stashed changes
    }
    setShowDeleteConfirm(false);
    setBankToDelete(null);
  };

  const handleSetDefaultBank = (id) => {
    // Note: You need to implement set default bank API endpoint
    toast.error("Set default bank functionality not implemented yet");
  };

  const handleQuickDeposit = (amount) => {
    setDepositAmount(amount.toString());
    toast.success(`₹${amount} selected for deposit`);
  };

  const handleDeposit = () => {
    const amount = Number(depositAmount);
    
    if (!depositAmount || amount <= 0) {
      toast.error("Please enter valid deposit amount");
      return;
    }

    if (amount < 100) {
      toast.error("Minimum deposit amount is ₹100");
      return;
    }

    // Calculate bonus (10% of deposit)
    const bonus = Math.floor(amount * 0.1);

    const depositData = {
      id: Date.now(),
      amount: amount,
      displayAmount: `₹${amount.toLocaleString()}`,
      bonus: `₹${bonus.toLocaleString()}`,
      status: "pending",
      accountType: selectedPaymentMethod,
      date: new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      reason: "Regular deposit",
      transactionId: `TXN${Date.now().toString().slice(-8)}`
    };

    setPendingDeposit(depositData);
    setShowDepositConfirm(true);
  };

  const confirmDeposit = () => {
<<<<<<< Updated upstream
   
=======
    if (pendingDeposit) {
      setDepositHistory([pendingDeposit, ...depositHistory]);
      setDepositAmount("");
      
      toast.success(
        <div>
          <div className="font-bold">Deposit Request Submitted!</div>
          <div>Amount: ₹{pendingDeposit.amount.toLocaleString()}</div>
          <div>Bonus: ₹{Math.floor(pendingDeposit.amount * 0.1).toLocaleString()}</div>
          <div>Status: Processing</div>
        </div>,
        { duration: 4000 }
      );
      
      setPendingDeposit(null);
    }
>>>>>>> Stashed changes
    setShowDepositConfirm(false);
  };

  const handleWithdraw = () => {
    const amount = Number(withdrawAmount);
    
    if (!withdrawAmount || amount <= 0) {
      toast.error("Please enter withdrawal amount");
      return;
    }

    if (!bankAccounts || bankAccounts.length === 0) {
      toast.error("Please add a bank account first");
      setShowAddBankPopup(true);
      return;
    }

    if (!selectedBank) {
      toast.error("Please select a bank account for withdrawal");
      return;
    }

    const withdrawalData = {
      amount: amount,
      bankAccountId: selectedBank,
      paymentMethod: "Bank Transfer"
    };

    setPendingWithdraw(withdrawalData);
    setShowWithdrawConfirm(true);
  };

  const confirmWithdrawal = () => {
    if (pendingWithdraw) {
<<<<<<< Updated upstream
      dispatch(requestWithdrawal(pendingWithdraw))
=======
      dispatch(requestWithdrawal(pendingWithdraw));
>>>>>>> Stashed changes
      setWithdrawAmount("");
    }
    setShowWithdrawConfirm(false);
    setPendingWithdraw(null);
  };

  const handleLoadMoreHistory = () => {
    const nextPage = currentPage + 1;
    dispatch(getWithdrawalHistory({ page: nextPage, limit: 10 }));
    setCurrentPage(nextPage);
  };

  const renderContent = () => {
    if (showHistory) {
      const historyData = activeTab === "deposit" ? depositHistory : withdrawals;
      const columns = activeTab === "deposit" 
        ? ["No.", "Transaction ID", "Amount", "Bonus", "Status", "Payment Method", "Date", "Reason"]
        : ["No.", "Transaction ID", "Amount", "Status", "Bank Account", "Date", "Reason"];

      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setShowHistory(false)}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-[#52b202] to-[#3d8c00] text-white font-bold rounded-lg hover:from-[#3d8c00] hover:to-[#52b202] transition-all"
              disabled={loading}
            >
              <FaChevronLeft className="mr-2" />
              Back to {activeTab === "deposit" ? "Deposit" : "Withdrawal"}
            </button>
            
            <div className="flex items-center space-x-2">
              <FaHistory className="text-2xl text-[#52b202]" />
              <h2 className="text-2xl font-bold text-gray-800">
                {activeTab === "deposit" ? "Deposit History" : "Withdrawal History"}
              </h2>
            </div>
          </div>

          {historyData && historyData.length > 0 ? (
            <>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full min-w-max">
                  <thead className="bg-gradient-to-r from-[#52b202] to-[#3d8c00]">
                    <tr>
                      {columns.map((col, index) => (
                        <th 
                          key={index} 
                          className="p-4 text-left text-white font-bold text-sm uppercase tracking-wide"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {historyData.map((item, index) => (
                      <tr 
                        key={item.id || item.transactionId} 
                        className={`hover:bg-gray-50 transition-colors ${getStatusColor(item.status)}`}
                      >
                        <td className="p-4 font-medium">{index + 1}</td>
                        <td className="p-4 font-mono text-sm text-gray-600">
                          {item.transactionId || `WDL${item.id}`}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center">
                            <FaRupeeSign className="mr-1 text-gray-500" />
                            <span className="font-bold text-gray-800">
                              ₹{typeof item.amount === 'number' ? item.amount.toLocaleString() : item.displayAmount || '0'}
                            </span>
                          </div>
                        </td>
                        {activeTab === "deposit" && (
                          <td className="p-4">
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                              {item.bonus || '₹0'}
                            </span>
                          </td>
                        )}
                        <td className="p-4">
                          <div className="flex items-center">
                            {getStatusIcon(item.status)}
                            <span className={`font-medium capitalize ${
                              item.status === 'completed' ? 'text-green-700' :
                              item.status === 'pending' ? 'text-yellow-700' :
                              'text-red-700'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                        </td>
                        {activeTab === "deposit" ? (
                          <td className="p-4">
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                              {item.accountType || 'N/A'}
                            </span>
                          </td>
                        ) : (
                          <td className="p-4">
                            <div>
                              <div className="font-medium">{item.bankName || 'N/A'}</div>
                              <div className="text-sm text-gray-600">
                                {item.accountNumber ? `****${item.accountNumber.slice(-4)}` : 'N/A'}
                              </div>
                            </div>
                          </td>
                        )}
                        <td className="p-4">
                          <div className="flex items-center">
                            <FaCalendar className="mr-2 text-gray-400" />
                            <span className="text-gray-700">
                              {item.date || (item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A')}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-gray-600">{item.reason || 'Regular transaction'}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {activeTab === "withdrawal" && pagination && pagination.currentPage < pagination.totalPages && (
                <div className="text-center">
                  <button
                    onClick={handleLoadMoreHistory}
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-[#52b202] to-[#3d8c00] text-white font-bold rounded-lg hover:from-[#3d8c00] hover:to-[#52b202] transition-all disabled:opacity-50"
                  >
                    {loading ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-2xl">
              <FaHistory className="mx-auto text-6xl text-gray-300 mb-4" />
              <h3 className="text-2xl font-bold text-gray-500 mb-2">No Transaction History</h3>
              <p className="text-gray-400">No {activeTab} transactions found</p>
              <button
                onClick={() => setShowHistory(false)}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-[#52b202] to-[#3d8c00] text-white font-bold rounded-lg hover:from-[#3d8c00] hover:to-[#52b202] transition-all"
              >
                Make Your First {activeTab === "deposit" ? "Deposit" : "Withdrawal"}
              </button>
            </div>
          )}
        </div>
      );
    }

    if (activeTab === "deposit") {
      // Quick deposit amounts
      const quickDepositAmounts = [100, 500, 1000, 5000];

      // Payment methods
      const paymentMethods = [
        { id: "upi", name: "UPI", icon: FaQrcode },
        { id: "card", name: "Credit/Debit Card", icon: FaCreditCard },
        { id: "netbanking", name: "Net Banking", icon: FaBuilding },
        { id: "wallet", name: "Wallet", icon: FaWallet }
      ];

      return (
        <div className="space-y-8">
          {/* Balance Display */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-2xl text-white">
            <h3 className="text-xl font-bold mb-2 flex items-center">
              <FaWallet className="mr-3" />
              Your Wallet Balance
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Available Balance</p>
                <p className="text-4xl font-bold mt-2">
                  ₹{(userInfo?.avbalance || 0).toLocaleString()}
                </p>
              </div>
<<<<<<< Updated upstream
             
=======
>>>>>>> Stashed changes
            </div>
          </div>

          {/* Quick Deposit Section */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FaMoneyBillWave className="mr-3 text-[#52b202]" />
              Quick Deposit Amounts
            </h3>
            <p className="text-gray-600 mb-6">Select amount or enter custom amount</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {quickDepositAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleQuickDeposit(amount)}
                  className={`p-5 rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${
                    depositAmount === amount.toString()
                      ? "bg-gradient-to-r from-[#52b202] to-[#3d8c00] text-white shadow-lg"
                      : "bg-white border-2 border-green-200 hover:border-[#52b202] text-gray-800 hover:shadow-md"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${
                      depositAmount === amount.toString()
                        ? "bg-white/20"
                        : "bg-green-100"
                    }`}>
                      <FaRupeeSign className={`text-2xl ${
                        depositAmount === amount.toString() ? "text-white" : "text-[#52b202]"
                      }`} />
                    </div>
                    <span className="text-2xl font-bold">+₹{amount}</span>
                    {amount === 1000 && (
                      <span className="text-xs mt-2 px-2 py-1 bg-green-100 text-green-800 rounded-full">
                        Most Popular
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount Section */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FaExchangeAlt className="mr-3 text-[#52b202]" />
              Custom Deposit Amount
            </h3>
            
            <div className="relative">
              <div className="flex items-center">
                <span className="absolute left-4 text-2xl font-bold text-gray-500">₹</span>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="Enter custom amount"
                  className="w-full pl-12 pr-4 py-4 text-xl border-2 border-gray-300 rounded-xl focus:border-[#52b202] focus:ring-2 focus:ring-green-100 focus:outline-none transition-all"
                  min="100"
                  step="100"
                  disabled={loading}
                />
              </div>
              
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-gray-500">Minimum: ₹100</span>
                <span className="text-gray-500">Increments of ₹100</span>
              </div>
            </div>
            
            {depositAmount && Number(depositAmount) > 0 && (
              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 text-sm">Deposit Amount</p>
                    <p className="text-2xl font-bold text-gray-800">
                      ₹{Number(depositAmount).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Bonus (10%)</p>
                    <p className="text-2xl font-bold text-green-600">
                      +₹{Math.floor(Number(depositAmount) * 0.1).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Payment Methods */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FaCreditCard className="mr-3 text-[#52b202]" />
              Select Payment Method
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPaymentMethod(method.name)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedPaymentMethod === method.name
                        ? "border-[#52b202] bg-green-50 shadow-md"
                        : "border-gray-200 hover:border-green-300 hover:shadow-sm"
                    }`}
                    disabled={loading}
                  >
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                        selectedPaymentMethod === method.name
                          ? "bg-[#52b202]"
                          : "bg-gray-100"
                      }`}>
                        <Icon className={`text-xl ${
                          selectedPaymentMethod === method.name ? "text-white" : "text-gray-600"
                        }`} />
                      </div>
                      <span className={`font-medium ${
                        selectedPaymentMethod === method.name ? "text-[#52b202]" : "text-gray-700"
                      }`}>
                        {method.name}
                      </span>
                      {selectedPaymentMethod === method.name && (
                        <div className="mt-2 w-4 h-4 rounded-full bg-[#52b202] flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleDeposit}
              disabled={!depositAmount || Number(depositAmount) < 100 || loading}
              className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] ${
                depositAmount && Number(depositAmount) >= 100 && !loading
                  ? "bg-gradient-to-r from-[#52b202] to-[#3d8c00] text-white shadow-lg hover:shadow-xl"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {loading ? (
                'Processing...'
              ) : depositAmount && Number(depositAmount) >= 100 ? (
                <>
                  <FaWallet className="inline mr-2" />
                  DEPOSIT ₹{Number(depositAmount).toLocaleString()}
                </>
              ) : (
                "ENTER AMOUNT TO DEPOSIT"
              )}
            </button>
            
            <button
              onClick={() => setShowHistory(true)}
              className="px-8 py-4 bg-white border-2 border-[#52b202] text-[#52b202] font-bold rounded-xl hover:bg-green-50 transition-all flex items-center justify-center"
              disabled={loading}
            >
              <FaHistory className="mr-3" />
              View History
            </button>
          </div>
        </div>
      );
    }

    // Withdrawal Content
    return (
      <div className="space-y-8">
        {/* Balance Display */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-2xl text-white">
          <h3 className="text-xl font-bold mb-2 flex items-center">
            <FaWallet className="mr-3" />
            Your Wallet Balance
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Available Balance</p>
              <p className="text-4xl font-bold mt-2">
                ₹{(userInfo?.avbalance || 0).toLocaleString()}
              </p>
            </div>
<<<<<<< Updated upstream
           
=======
>>>>>>> Stashed changes
          </div>
        </div>

        {/* Bank Accounts Section */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <FaBuilding className="mr-3 text-red-500" />
                Your Bank Accounts
              </h3>
              <p className="text-gray-600 mt-1">Select bank account for withdrawal</p>
            </div>
            
            {/* Show Add Bank button ONLY when no bank accounts exist */}
            {(!bankAccounts || bankAccounts.length === 0) && (
              <button
                onClick={() => setShowAddBankPopup(true)}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg transition-all flex items-center"
                disabled={loading}
              >
                <FaPlus className="mr-2" />
                Add Bank Account
              </button>
            )}
          </div>

          {bankAccounts && bankAccounts.length > 0 ? (
            <div className="space-y-4">
              {bankAccounts.map((account) => {
                const accountId = account._id || account.id;
                const isSelected = selectedBank === accountId;
                
                return (
                  <div
                    key={accountId}
                    onClick={() => {
                      console.log("Selecting bank:", accountId);
                      setSelectedBank(accountId);
                    }}
                    className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? "border-red-500 bg-red-50 shadow-md"
                        : "border-gray-200 hover:border-red-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-3">
                          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                            <FaBuilding className="text-2xl text-red-500" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-gray-800">{account.bankName}</h4>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1">
                              <span className="text-sm text-gray-600">
                                A/C: {account.accountNumber ? `****${account.accountNumber.slice(-4)}` : 'N/A'}
                              </span>
                              {isSelected && (
                                <span className="px-3 py-1 bg-green-100 text-green-600 text-xs font-bold rounded-full self-start">
                                  SELECTED
                                </span>
                              )}
                              {account.isDefault && (
                                <span className="px-3 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full self-start">
                                  DEFAULT
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                          <div className="flex items-center">
                            <FaIdCard className="text-gray-400 mr-3" />
                            <div>
                              <p className="text-xs text-gray-500">Account Holder</p>
                              <p className="font-medium">{account.accountHolderName}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <FaBarcode className="text-gray-400 mr-3" />
                            <div>
                              <p className="text-xs text-gray-500">IFSC Code</p>
                              <p className="font-mono font-medium">{account.ifscCode}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <FaCalendar className="text-gray-400 mr-3" />
                            <div>
                              <p className="text-xs text-gray-500">Added On</p>
                              <p className="font-medium">
                                {account.createdAt ? new Date(account.createdAt).toLocaleDateString() : 'N/A'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
                        {!account.isDefault && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSetDefaultBank(accountId);
                            }}
                            className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors text-sm"
                            disabled={loading}
                          >
                            Set Default
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteBankAccount(accountId);
                          }}
                          className="p-2 sm:p-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                          disabled={loading}
                        >
                          <FaTrash className="text-sm sm:text-base" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
              <FaBuilding className="mx-auto text-6xl text-gray-300 mb-4" />
              <h4 className="text-2xl font-bold text-gray-500 mb-2">No Bank Account Found</h4>
              <p className="text-gray-400 mb-6">Add your bank account to start withdrawing</p>
              <button
                onClick={() => setShowAddBankPopup(true)}
                className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl hover:from-red-600 hover:to-red-700 shadow-md"
                disabled={loading}
              >
                <FaPlus className="inline mr-2" />
                Add Your First Bank Account
              </button>
            </div>
          )}
        </div>

        {/* Withdrawal Amount Section */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <FaMoneyBillWave className="mr-3 text-red-500" />
            Withdrawal Amount
          </h3>
          
          <div className="relative mb-6">
            <div className="flex items-center">
              <span className="absolute left-4 text-2xl font-bold text-gray-500">₹</span>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Please enter amount"
                className="w-full pl-12 pr-4 py-4 text-xl border-2 border-gray-300 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-100 focus:outline-none transition-all"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleWithdraw}
            disabled={
              !withdrawAmount || 
              !bankAccounts || 
              bankAccounts.length === 0 || 
              !selectedBank || 
              loading
            }
            className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] ${
              withdrawAmount && 
              bankAccounts && 
              bankAccounts.length > 0 && 
              selectedBank && 
              !loading
                ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? (
              'Processing...'
            ) : withdrawAmount && bankAccounts && bankAccounts.length > 0 && selectedBank ? (
              <>
                <FaWallet className="inline mr-2" />
                WITHDRAW ₹{Number(withdrawAmount).toLocaleString()}
              </>
            ) : !bankAccounts || bankAccounts.length === 0 ? (
              "ADD BANK ACCOUNT FIRST"
            ) : !selectedBank ? (
              "SELECT BANK ACCOUNT"
            ) : (
              "ENTER WITHDRAWAL AMOUNT"
            )}
          </button>
          
          <button
            onClick={() => setShowHistory(true)}
            className="px-8 py-4 bg-white border-2 border-red-500 text-red-500 font-bold rounded-xl hover:bg-red-50 transition-all flex items-center justify-center"
            disabled={loading}
          >
            <FaHistory className="mr-3" />
            View History
          </button>
        </div>

        {/* Important Notes */}
        <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-2xl border border-red-200">
          <h4 className="text-lg font-bold text-red-700 mb-4 flex items-center">
            <FaShieldAlt className="mr-3" />
            Important Notes & Guidelines
          </h4>
          <ul className="space-y-3">
            {[
              "This form is for withdrawing the amount from the main wallet only.",
              "The bonus wallet amount cannot be withdrawn by this form.",
              "Do not put Withdraw request without betting with deposit amount. Such activity may be identified as Suspicious.",
              "If multiple users are using same withdraw account then all the linked users will be blocked.",
              "Maximum Withdraw processing time is 20 minutes then only complain on LIVE CHAT.",
              "Withdrawal requests are processed within 1-2 business days.",
              "Ensure your bank account details are correct before submitting withdrawal request."
            ].map((note, index) => (
              <li key={index} className="flex items-start">
                <span className="text-red-500 mr-3 mt-1">•</span>
                <span className="text-red-700">{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10B981',
            },
          },
          error: {
            style: {
              background: '#EF4444',
            },
          },
        }}
      />
      
      {/* Deposit Confirmation Popup */}
      {showDepositConfirm && pendingDeposit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl bg-white/80 backdrop-blur-xl shadow-2xl border border-white/30 animate-scaleIn">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200/50">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <FaExclamationTriangle className="mr-3 text-green-500" />
                Confirm Deposit
              </h3>
              <button
                onClick={() => {
                  setShowDepositConfirm(false);
                  setPendingDeposit(null);
                }}
                className="text-3xl text-gray-400 hover:text-red-500 transition"
                disabled={loading}
              >
                &times;
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                  <FaWallet className="text-3xl text-green-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">
                  Confirm Deposit Request
                </h4>
                <p className="text-gray-600">
                  Please review your deposit details
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200 mb-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Deposit Amount:</span>
                    <span className="font-bold text-gray-800">
                      ₹{pendingDeposit.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bonus (10%):</span>
                    <span className="font-bold text-green-600">
                      +₹{Math.floor(pendingDeposit.amount * 0.1).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-bold text-gray-800">{selectedPaymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Credit:</span>
                    <span className="font-bold text-green-600">
                      ₹{(pendingDeposit.amount + Math.floor(pendingDeposit.amount * 0.1)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowDepositConfirm(false);
                    setPendingDeposit(null);
                  }}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeposit}
                  disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-[#52b202] to-[#3d8c00] text-white font-bold rounded-xl hover:from-[#3d8c00] hover:to-[#52b202] shadow-md hover:shadow-lg transition"
                >
                  {loading ? 'Processing...' : 'Confirm Deposit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Withdrawal Confirmation Popup */}
      {showWithdrawConfirm && pendingWithdraw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl bg-white/80 backdrop-blur-xl shadow-2xl border border-white/30 animate-scaleIn">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200/50">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <FaExclamationTriangle className="mr-3 text-red-500" />
                Confirm Withdrawal
              </h3>
              <button
                onClick={() => {
                  setShowWithdrawConfirm(false);
                  setPendingWithdraw(null);
                }}
                className="text-3xl text-gray-400 hover:text-red-500 transition"
                disabled={loading}
              >
                &times;
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                  <FaQuestion className="text-3xl text-red-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">
                  Are you sure you want to withdraw?
                </h4>
                <p className="text-gray-600">
                  Amount: <span className="font-bold text-red-600">₹{Number(withdrawAmount).toLocaleString()}</span>
                </p>
              </div>
              
              {selectedBank && bankAccounts && (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-xl border border-red-200 mb-6">
                  <div className="flex items-center mb-3">
                    <FaBuilding className="text-red-500 mr-3" />
                    <span className="font-bold text-gray-800">
                      {bankAccounts.find(acc => (acc._id === selectedBank || acc.id === selectedBank))?.bankName}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    A/C: ****{bankAccounts.find(acc => (acc._id === selectedBank || acc.id === selectedBank))?.accountNumber?.slice(-4)}
                  </div>
                </div>
              )}
              
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowWithdrawConfirm(false);
                    setPendingWithdraw(null);
                  }}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmWithdrawal}
                  disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg transition"
                >
                  {loading ? 'Processing...' : 'Confirm Withdraw'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Bank Confirmation Popup */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl bg-white/80 backdrop-blur-xl shadow-2xl border border-white/30">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200/50">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <FaExclamationTriangle className="mr-3 text-red-500" />
                Confirm Delete
              </h3>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-3xl text-gray-400 hover:text-red-500 transition"
                disabled={loading}
              >
                &times;
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                  <FaTrash className="text-3xl text-red-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">
                  Delete Bank Account?
                </h4>
                <p className="text-gray-600">
                  This action cannot be undone. Are you sure you want to delete this bank account?
                </p>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteBank}
                  disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg transition"
                >
                  {loading ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Bank Account Popup */}
      {showAddBankPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl bg-white/80 backdrop-blur-xl shadow-2xl border border-white/30 animate-scaleIn">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200/50">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <FaPlus className="mr-3 text-red-500" />
                Add Bank Account
              </h3>
              <button
                onClick={() => setShowAddBankPopup(false)}
                className="text-3xl text-gray-400 hover:text-red-500 transition"
                disabled={loading}
              >
                &times;
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {/* Account Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <FaIdCard className="mr-2" /> Account Type
                </label>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-100/70 border border-gray-300">
                  <FaBuilding className="text-red-500 text-lg" />
                  <span className="font-medium text-gray-800">Bank Account</span>
                </div>
              </div>

              {/* Phone number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <FaPhoneAlt className="mr-2" /> Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={bankForm.phone}
                  onChange={handleBankFormChange}
                  placeholder="Enter phone number"
                  className="w-full p-4 rounded-xl border border-gray-300 bg-white/70 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition"
                  maxLength="10"
                  pattern="[0-9]{10}"
                />
              </div>

              {/* Holder Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <FaIdCard className="mr-2" /> Account Holder Name
                </label>
                <input
                  type="text"
                  name="accountHolderName"
                  value={bankForm.accountHolderName}
                  onChange={handleBankFormChange}
                  placeholder="Enter holder name"
                  className="w-full p-4 rounded-xl border border-gray-300 bg-white/70 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition"
                  disabled={loading}
                />
              </div>

              {/* Bank Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <FaBuilding className="mr-2" /> Bank Name
                </label>
                <input
                  type="text"
                  name="bankName"
                  value={bankForm.bankName}
                  onChange={handleBankFormChange}
                  placeholder="Enter bank name"
                  className="w-full p-4 rounded-xl border border-gray-300 bg-white/70 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition"
                  disabled={loading}
                />
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <FaListOl className="mr-2" /> Account Number
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  value={bankForm.accountNumber}
                  onChange={handleBankFormChange}
                  placeholder="Enter account number"
                  className="w-full p-4 rounded-xl border border-gray-300 bg-white/70 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition"
                  disabled={loading}
                  maxLength="18"
                />
              </div>

              {/* IFSC */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <FaBarcode className="mr-2" /> IFSC Code
                </label>
                <input
                  type="text"
                  name="ifscCode"
                  value={bankForm.ifscCode}
                  onChange={handleBankFormChange}
                  placeholder="Enter IFSC code"
                  className="w-full p-4 rounded-xl border border-gray-300 bg-white/70 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition"
                  disabled={loading}
                  maxLength="11"
                />
              </div>

              {/* Save Button */}
              <button
                onClick={handleAddBankAccount}
                disabled={loading}
                className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  'Saving...'
                ) : (
                  <>
                    <FaSave className="mr-3" />
                    Save Bank Account
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            <FaWallet className="inline mr-3 text-[#52b202]" />
            Wallet Manager
          </h1>
          <p className="text-gray-600">Deposit funds or withdraw your winnings</p>
        </div>

        {/* Main Container */}
        <div className="bg-white rounded overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex">
            <button
              onClick={() => {
                setActiveTab("deposit");
                setShowHistory(false);
                setDepositAmount("");
              }}
              className={`flex-1 py-5 text-center font-bold text-lg transition-all relative ${
                activeTab === "deposit"
                  ? "bg-gradient-to-r from-[#52b202] to-[#3d8c00] text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              disabled={loading}
            >
              <div className="flex items-center justify-center">
                <FaPlus className="mr-3" />
                DEPOSIT
              </div>
              {activeTab === "deposit" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white"></div>
              )}
            </button>
            
            <button
              onClick={() => {
                setActiveTab("withdrawal");
                setShowHistory(false);
                setWithdrawAmount("");
              }}
              className={`flex-1 py-5 text-center font-bold text-lg transition-all relative ${
                activeTab === "withdrawal"
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              disabled={loading}
            >
              <div className="flex items-center justify-center">
                <FaWallet className="mr-3" />
                WITHDRAWAL
              </div>
              {activeTab === "withdrawal" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white"></div>
              )}
            </button>
          </div>

          {/* Content Area */}
          <div className="p-6 md:p-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositWithdrawal;