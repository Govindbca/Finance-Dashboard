import React, { useState, useEffect } from "react";
import { data } from "./data";
import { PieChart, Pie, Tooltip, LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  Moon,
  Sun,
  Plus,
  Edit3,
  Trash2,
  Search,
  BarChart3,
  PieChart as PieChartIcon,
  Eye,
  Shield,
  Target,
  Calendar,
  Tag,
  Save,
  X
} from "lucide-react";

export default function App() {
  const [transactions, setTransactions] = useState(
    JSON.parse(localStorage.getItem("tx")) || data
  );
  const [role, setRole] = useState("viewer");
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: '',
    type: 'expense'
  });

  useEffect(() => {
    localStorage.setItem("tx", JSON.stringify(transactions));
  }, [transactions]);

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + b.amount, 0);
  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + b.amount, 0);
  const balance = income - expense;

  const filtered = transactions.filter((t) =>
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  const categoryData = Object.entries(
    transactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const addTx = () => {
    if (!newTransaction.amount || !newTransaction.category) return;

    const tx = {
      id: Date.now(),
      date: newTransaction.date,
      amount: parseFloat(newTransaction.amount),
      category: newTransaction.category,
      type: newTransaction.type
    };
    setTransactions([...transactions, tx]);
    setNewTransaction({
      date: new Date().toISOString().split('T')[0],
      amount: '',
      category: '',
      type: 'expense'
    });
    setShowAddForm(false);
  };

  const deleteTx = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
    setEditingId(null);
  };

  const startEdit = (t) => {
    setEditingId(t.id);
    setEditData({ ...t });
  };

  const saveEdit = () => {
    setTransactions(
      transactions.map((t) => (t.id === editingId ? editData : t))
    );
    setEditingId(null);
  };

  const highest = Object.entries(
    transactions.reduce((acc, t) => {
      if (t.type === "expense") {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
      }
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1])[0];

  const getTypeColor = (type) => {
    return type === "income"
      ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800"
      : "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950 border-rose-200 dark:border-rose-800";
  };

  const getTypeIcon = (type) => {
    return type === "income" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? "dark" : ""}`}>
      <div className="dark:bg-slate-950 dark:text-white bg-white text-slate-900">
        {/* Header */}
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900 text-white shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <div className="flex items-center gap-3">
                  <Wallet className="w-8 h-8" />
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                      Finance Dashboard
                    </h1>
                    <p className="text-indigo-100 mt-1 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Track your financial journey
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.button
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                onClick={() => setDarkMode(!darkMode)}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-2xl transition-all duration-300 flex items-center gap-3 border border-white/20 hover:border-white/40 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                <span className="font-medium">{darkMode ? "Light" : "Dark"}</span>
              </motion.button>
            </div>
          </div>
        </motion.header>

        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Controls */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex gap-4 mb-8 flex-col sm:flex-row items-center justify-between"
          >
            <div className="flex-1 w-full sm:w-auto">
              <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                User Role
              </label>
              <select
                onChange={(e) => setRole(e.target.value)}
                value={role}
                className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-xl px-4 py-3 w-full sm:w-48 focus:ring-2 focus:ring-indigo-500 outline-none transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <option value="viewer" className="flex items-center gap-2">
                  👁️ Viewer
                </option>
                <option value="admin" className="flex items-center gap-2">
                  ⚙️ Admin
                </option>
              </select>
            </div>

            {role === "admin" && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 dark:from-emerald-600 dark:to-teal-700 dark:hover:from-emerald-700 dark:hover:to-teal-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                Add Transaction
              </motion.button>
            )}
          </motion.div>

          {/* Summary Cards */}
          <motion.section
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900 dark:to-emerald-800 rounded-2xl shadow-xl p-6 border-l-4 border-emerald-500 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-200/30 dark:bg-emerald-700/30 rounded-full -translate-y-10 translate-x-10"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <DollarSign className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                </div>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">Total Income</p>
                <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">₹{income.toLocaleString()}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  From all sources
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900 dark:to-rose-800 rounded-2xl shadow-xl p-6 border-l-4 border-rose-500 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-rose-200/30 dark:bg-rose-700/30 rounded-full -translate-y-10 translate-x-10"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <DollarSign className="w-8 h-8 text-rose-600 dark:text-rose-400" />
                  <TrendingDown className="w-5 h-5 text-rose-500" />
                </div>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">Total Expenses</p>
                <p className="text-3xl font-bold text-rose-700 dark:text-rose-300">₹{expense.toLocaleString()}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1">
                  <BarChart3 className="w-3 h-3" />
                  Spending summary
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`rounded-2xl shadow-xl p-6 border-l-4 relative overflow-hidden group ${
                balance >= 0
                  ? "bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900 dark:to-indigo-800 border-indigo-500"
                  : "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900 dark:to-amber-800 border-amber-500"
              }`}
            >
              <div className={`absolute top-0 right-0 w-20 h-20 rounded-full -translate-y-10 translate-x-10 ${
                balance >= 0 ? "bg-indigo-200/30 dark:bg-indigo-700/30" : "bg-amber-200/30 dark:bg-amber-700/30"
              }`}></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <Wallet className={`w-8 h-8 ${balance >= 0 ? "text-indigo-600 dark:text-indigo-400" : "text-amber-600 dark:text-amber-400"}`} />
                  {balance >= 0 ? <TrendingUp className="w-5 h-5 text-indigo-500" /> : <TrendingDown className="w-5 h-5 text-amber-500" />}
                </div>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">Net Balance</p>
                <p className={`text-3xl font-bold ${balance >= 0 ? "text-indigo-700 dark:text-indigo-300" : "text-amber-700 dark:text-amber-300"}`}>
                  ₹{balance.toLocaleString()}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  Current balance
                </p>
              </div>
            </motion.div>
          </motion.section>

          {/* Add Transaction Modal */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setShowAddForm(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-md"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      Add Transaction
                    </h3>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Date</label>
                      <input
                        type="date"
                        value={newTransaction.date}
                        onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                        className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Amount</label>
                      <input
                        type="number"
                        placeholder="Enter amount"
                        value={newTransaction.amount}
                        onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                        className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Category</label>
                      <input
                        type="text"
                        placeholder="Enter category"
                        value={newTransaction.category}
                        onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                        className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Type</label>
                      <select
                        value={newTransaction.type}
                        onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value})}
                        className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                      >
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                      </select>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={addTx}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Add
                      </button>
                      <button
                        onClick={() => setShowAddForm(false)}
                        className="flex-1 bg-slate-300 hover:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Charts Section */}
          <motion.section
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
          >
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-xl font-bold">Transaction Trend</h2>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={transactions}>
                  <XAxis
                    dataKey="date"
                    stroke="currentColor"
                    className="text-slate-600 dark:text-slate-400"
                  />
                  <YAxis
                    stroke="currentColor"
                    className="text-slate-600 dark:text-slate-400"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? "#1e293b" : "#ffffff",
                      border: "1px solid #94a3b8",
                      borderRadius: "8px"
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ fill: "#6366f1", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "#6366f1", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center gap-3 mb-6">
                <PieChartIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-xl font-bold">Category Breakdown</h2>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#6366f1"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? "#1e293b" : "#ffffff",
                      border: "1px solid #94a3b8",
                      borderRadius: "8px"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          </motion.section>

          {/* Transactions Section */}
          <motion.section
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 mb-8 border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <Tag className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                Transactions
              </h2>
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  placeholder="Search by category..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all duration-200 shadow-sm hover:shadow-md w-full sm:w-80"
                />
              </div>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4 max-h-96 overflow-y-auto"
            >
              <AnimatePresence>
                {filtered.length > 0 ? (
                  filtered.map((t) => (
                    <motion.div
                      key={t.id}
                      variants={itemVariants}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl p-4 hover:shadow-lg transition-all duration-300 group"
                      whileHover={{ scale: 1.01 }}
                    >
                      {editingId === t.id ? (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex gap-3 items-center flex-wrap"
                        >
                          <input
                            type="date"
                            value={editData.date}
                            onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                            className="border border-slate-300 dark:border-slate-500 bg-white dark:bg-slate-600 rounded-lg px-3 py-2 text-sm flex-1 min-w-32"
                          />
                          <input
                            type="number"
                            value={editData.amount}
                            onChange={(e) => setEditData({ ...editData, amount: parseFloat(e.target.value) })}
                            className="border border-slate-300 dark:border-slate-500 bg-white dark:bg-slate-600 rounded-lg px-3 py-2 text-sm w-24"
                          />
                          <input
                            type="text"
                            value={editData.category}
                            onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                            className="border border-slate-300 dark:border-slate-500 bg-white dark:bg-slate-600 rounded-lg px-3 py-2 text-sm flex-1 min-w-32"
                          />
                          <select
                            value={editData.type}
                            onChange={(e) => setEditData({ ...editData, type: e.target.value })}
                            className="border border-slate-300 dark:border-slate-500 bg-white dark:bg-slate-600 rounded-lg px-3 py-2 text-sm"
                          >
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                          </select>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={saveEdit}
                            className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-1"
                          >
                            <Save className="w-4 h-4" />
                            Save
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setEditingId(null)}
                            className="bg-slate-400 hover:bg-slate-500 dark:bg-slate-500 dark:hover:bg-slate-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-1"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </motion.button>
                        </motion.div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center gap-1 ${getTypeColor(t.type)}`}>
                                {getTypeIcon(t.type)}
                                {t.type}
                              </span>
                              <div>
                                <p className="font-semibold text-lg">{t.category}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {t.date}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <p className={`text-xl font-bold ${t.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                                {t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString()}
                              </p>
                              {role === "admin" && (
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => startEdit(t)}
                                    className="bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white p-2 rounded-lg transition-colors duration-200"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => deleteTx(t.id)}
                                    className="bg-rose-500 hover:bg-rose-600 dark:bg-rose-700 dark:hover:bg-rose-600 text-white p-2 rounded-lg transition-colors duration-200"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </motion.button>
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-slate-500 dark:text-slate-400 py-12"
                  >
                    <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No transactions found</p>
                    <p className="text-sm">Try adjusting your search or add a new transaction</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.section>

          {/* Insights */}
          {highest && (
            <motion.section
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              whileHover={{ y: -5 }}
              className="bg-gradient-to-r from-violet-50 via-purple-50 to-indigo-50 dark:from-violet-900 dark:via-purple-900 dark:to-indigo-900 rounded-2xl shadow-xl p-6 border border-violet-200 dark:border-violet-800"
            >
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                <h2 className="text-xl font-bold">Insights</h2>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg text-slate-700 dark:text-slate-300">
                    Your highest spending category is{" "}
                    <span className="font-bold text-violet-600 dark:text-violet-300 text-xl">
                      {highest[0]}
                    </span>{" "}
                    with{" "}
                    <span className="font-bold text-violet-600 dark:text-violet-300 text-xl">
                      ₹{highest[1].toLocaleString()}
                    </span>
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                    Consider reviewing your spending in this category
                  </p>
                </div>
                <div className="text-4xl opacity-20">
                  📊
                </div>
              </div>
            </motion.section>
          )}
        </main>
      </div>
    </div>
  );
}
